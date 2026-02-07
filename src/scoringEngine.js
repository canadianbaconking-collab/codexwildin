const fs = require('fs');
const path = require('path');
const { RULES, MITIGATION_TEMPLATES, METRIC_FALLBACKS } = require('./rules');

const DEFAULT_WEIGHTS = {
  overall: {
    reversibility: 0.3,
    blast_radius: 0.3,
    dependency_weight: 0.2,
    convergence: 0.2,
  },
};

const BASE_SCORES = {
  reversibility: { easy: 80, moderate: 55, hard: 25 },
  blast_radius: { local: 80, subsystem: 55, systemwide: 25 },
  dependency_weight: 70,
  convergence: 40,
};

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const calculateOverallScore = (metrics, weights) => {
  const overall =
    metrics.reversibility * weights.overall.reversibility +
    metrics.blast_radius * weights.overall.blast_radius +
    metrics.dependency_weight * weights.overall.dependency_weight +
    metrics.convergence * weights.overall.convergence;

  return clampScore(overall);
};

const buildOverallComponents = (metrics, weights) =>
  [
    {
      metric: 'reversibility',
      score: metrics.reversibility,
      weight: weights.overall.reversibility,
    },
    {
      metric: 'blast_radius',
      score: metrics.blast_radius,
      weight: weights.overall.blast_radius,
    },
    {
      metric: 'dependency_weight',
      score: metrics.dependency_weight,
      weight: weights.overall.dependency_weight,
    },
    {
      metric: 'convergence',
      score: metrics.convergence,
      weight: weights.overall.convergence,
    },
  ].map((component) => ({
    ...component,
    weighted: Number((component.score * component.weight).toFixed(2)),
  }));

const buildDerivedData = (decision) => ({
  hasHighDataDependency: decision.dependencies_introduced.some(
    (dep) => dep.kind === 'data' && dep.criticality === 'high'
  ),
  highRuntimeDeps: decision.dependencies_introduced.filter(
    (dep) => dep.kind === 'runtime' && dep.criticality === 'high'
  ).length,
  highBuildOpsDeps: decision.dependencies_introduced.filter(
    (dep) => (dep.kind === 'build' || dep.kind === 'ops') && dep.criticality === 'high'
  ).length,
  alternativesCount: decision.alternatives_considered.length,
  allAlternativesDetailed: decision.alternatives_considered.every(
    (alt) => alt.why_not && alt.why_not.trim().length > 20
  ),
});

const buildMitigations = (drivers, metrics) => {
  const mitigations = [];
  const seen = new Set();

  drivers.forEach((driver) => {
    const template = MITIGATION_TEMPLATES[driver.rule_id];
    if (!template) return;
    if (seen.has(template.action)) return;
    seen.add(template.action);
    mitigations.push({ ...template });
  });

  Object.entries(METRIC_FALLBACKS).forEach(([metric, template]) => {
    if (metrics[metric] > 40) return;
    if (mitigations.some((item) => item.linked_metric === metric)) return;
    mitigations.push({ ...template });
  });

  return mitigations.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.action.localeCompare(b.action);
  });
};

const loadWeightsFromConfig = (configPath) => {
  if (!configPath) return null;
  const resolved = path.resolve(configPath);
  if (!fs.existsSync(resolved)) return null;
  const raw = fs.readFileSync(resolved, 'utf-8');
  return JSON.parse(raw);
};

const getWeights = (configPath) => {
  const override = loadWeightsFromConfig(configPath);
  if (!override || !override.overall) return DEFAULT_WEIGHTS;
  return {
    overall: {
      ...DEFAULT_WEIGHTS.overall,
      ...override.overall,
    },
  };
};

const evaluateDecision = (decision, options = {}) => {
  const weights = getWeights(options.weightsPath);
  const drivers = [];
  const flags = [];

  const metricBases = {
    reversibility: BASE_SCORES.reversibility[decision.reversibility_estimate],
    blast_radius: BASE_SCORES.blast_radius[decision.scope_impact],
    dependency_weight: BASE_SCORES.dependency_weight,
    convergence: BASE_SCORES.convergence,
  };

  const metrics = { ...metricBases };
  const derived = buildDerivedData(decision);
  const rules = options.rules || RULES;
  const explainability = Object.fromEntries(
    Object.entries(metricBases).map(([metric, base]) => [
      metric,
      { base, adjustments: [], final: base },
    ])
  );

  const addDriver = (metric, ruleId, description, contribution) => {
    if (contribution === 0) return;
    drivers.push({ metric, rule_id: ruleId, description, contribution });
    explainability[metric].adjustments.push({
      rule_id: ruleId,
      description,
      contribution,
    });
    metrics[metric] += contribution;
  };

  rules.forEach((rule) => {
    const contribution = rule.apply({ decision, derived });
    addDriver(rule.metric, rule.id, rule.description, contribution);
  });

  metrics.reversibility = clampScore(metrics.reversibility);
  metrics.blast_radius = clampScore(metrics.blast_radius);
  metrics.dependency_weight = clampScore(metrics.dependency_weight);
  metrics.convergence = clampScore(metrics.convergence);

  Object.keys(metrics).forEach((metric) => {
    explainability[metric].final = metrics[metric];
  });

  const overallScore = calculateOverallScore(metrics, weights);

  const classification =
    overallScore >= 70 ? 'stable' : overallScore >= 45 ? 'tentative' : 'risky';

  if (metrics.blast_radius <= 40) {
    flags.push({
      code: 'BLAST-RISK',
      severity: 'risk',
      message: 'Blast radius score is low; impact could be wide.',
    });
  }
  if (metrics.reversibility <= 40) {
    flags.push({
      code: 'REV-LOCKIN',
      severity: 'warn',
      message: 'Reversibility appears low; exit strategy may be hard.',
    });
  }
  if (metrics.dependency_weight <= 40) {
    flags.push({
      code: 'DEP-HEAVY',
      severity: 'warn',
      message: 'Dependency weight is high; consider reducing critical dependencies.',
    });
  }
  if (metrics.convergence <= 40) {
    flags.push({
      code: 'CONV-LOW',
      severity: 'info',
      message: 'Convergence is low; decision may need more exploration.',
    });
  }

  const mitigations = buildMitigations(drivers, metrics);
  const overallComponents = buildOverallComponents(metrics, weights);

  return {
    scores: {
      overall_confidence: overallScore,
      reversibility: metrics.reversibility,
      blast_radius: metrics.blast_radius,
      dependency_weight: metrics.dependency_weight,
      convergence: metrics.convergence,
    },
    drivers,
    flags,
    mitigations,
    classification,
    weights,
    explainability: {
      metrics: explainability,
      overall: {
        weights: weights.overall,
        components: overallComponents,
        final: overallScore,
      },
    },
  };
};

module.exports = {
  evaluateDecision,
  getWeights,
  clampScore,
  calculateOverallScore,
  buildOverallComponents,
};

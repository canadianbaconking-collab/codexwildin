const fs = require('fs');
const path = require('path');

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
  const mitigations = [];

  const metricBases = {
    reversibility: BASE_SCORES.reversibility[decision.reversibility_estimate],
    blast_radius: BASE_SCORES.blast_radius[decision.scope_impact],
    dependency_weight: BASE_SCORES.dependency_weight,
    convergence: BASE_SCORES.convergence,
  };

  const metrics = { ...metricBases };
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

  // Reversibility rules
  addDriver(
    'reversibility',
    'R-REV-001',
    'Scope impact is local, increasing reversibility.',
    decision.scope_impact === 'local' ? 10 : 0
  );
  addDriver(
    'reversibility',
    'R-REV-002',
    'High migration cost reduces reversibility.',
    decision.migration_cost_estimate === 'high' ? -15 : 0
  );
  const hasHighDataDependency = decision.dependencies_introduced.some(
    (dep) => dep.kind === 'data' && dep.criticality === 'high'
  );
  addDriver(
    'reversibility',
    'R-REV-003',
    'High-criticality data dependency reduces reversibility.',
    hasHighDataDependency ? -10 : 0
  );

  // Blast radius rules
  addDriver(
    'blast_radius',
    'R-BLAST-001',
    'Large number of dependencies increases blast radius risk.',
    decision.dependencies_introduced.length >= 4 ? -10 : 0
  );
  addDriver(
    'blast_radius',
    'R-BLAST-002',
    'Architecture decisions beyond local scope increase blast radius.',
    decision.decision_type === 'architecture' && decision.scope_impact !== 'local' ? -10 : 0
  );

  // Dependency weight rules
  const highRuntimeDeps = decision.dependencies_introduced.filter(
    (dep) => dep.kind === 'runtime' && dep.criticality === 'high'
  ).length;
  const runtimePenalty = Math.max(highRuntimeDeps * -10, -30);
  addDriver(
    'dependency_weight',
    'R-DEP-001',
    'High-criticality runtime dependencies reduce dependency score.',
    runtimePenalty
  );
  const highBuildOpsDeps = decision.dependencies_introduced.filter(
    (dep) => (dep.kind === 'build' || dep.kind === 'ops') && dep.criticality === 'high'
  ).length;
  const buildOpsPenalty = Math.max(highBuildOpsDeps * -5, -15);
  addDriver(
    'dependency_weight',
    'R-DEP-002',
    'High-criticality build/ops dependencies reduce dependency score.',
    buildOpsPenalty
  );
  addDriver(
    'dependency_weight',
    'R-DEP-003',
    'High-criticality data dependencies reduce dependency score.',
    hasHighDataDependency ? -10 : 0
  );

  // Convergence rules
  const alternativesCount = decision.alternatives_considered.length;
  addDriver(
    'convergence',
    'R-CONV-001',
    'Considering at least three alternatives improves convergence.',
    alternativesCount >= 3 ? 15 : 0
  );
  const allAlternativesDetailed = decision.alternatives_considered.every(
    (alt) => alt.why_not && alt.why_not.trim().length > 20
  );
  addDriver(
    'convergence',
    'R-CONV-002',
    'Alternatives have detailed rationale, improving convergence.',
    allAlternativesDetailed ? 10 : 0
  );
  addDriver(
    'convergence',
    'R-CONV-003',
    'Only one alternative for non-local scope reduces convergence.',
    alternativesCount === 1 && decision.scope_impact !== 'local' ? -10 : 0
  );

  metrics.reversibility = clampScore(metrics.reversibility);
  metrics.blast_radius = clampScore(metrics.blast_radius);
  metrics.dependency_weight = clampScore(metrics.dependency_weight);
  metrics.convergence = clampScore(metrics.convergence);

  Object.keys(metrics).forEach((metric) => {
    explainability[metric].final = metrics[metric];
  });

  const overall =
    metrics.reversibility * weights.overall.reversibility +
    metrics.blast_radius * weights.overall.blast_radius +
    metrics.dependency_weight * weights.overall.dependency_weight +
    metrics.convergence * weights.overall.convergence;

  const overallScore = clampScore(overall);

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

  const mitigationBase = [
    {
      priority: 1,
      action: 'Define a rollback or escape plan with clear triggers.',
      rationale: 'Improves reversibility and reduces lock-in risk.',
      linked_metric: 'reversibility',
    },
    {
      priority: 2,
      action: 'Limit initial deployment scope and monitor blast radius.',
      rationale: 'Reduces impact if issues arise.',
      linked_metric: 'blast_radius',
    },
    {
      priority: 3,
      action: 'Reduce or tier critical dependencies where possible.',
      rationale: 'Improves dependency weight score.',
      linked_metric: 'dependency_weight',
    },
    {
      priority: 4,
      action: 'Document rejected alternatives and revisit if assumptions change.',
      rationale: 'Improves convergence and decision traceability.',
      linked_metric: 'convergence',
    },
  ];

  mitigations.push(...mitigationBase);

  const overallComponents = [
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
};

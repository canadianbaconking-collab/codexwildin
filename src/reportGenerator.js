const { evaluateDecision, clampScore, calculateOverallScore } = require('./scoringEngine');
const { stableStringify } = require('./utils');

const sortDrivers = (drivers) =>
  [...drivers].sort((a, b) => {
    const magnitude = Math.abs(b.contribution) - Math.abs(a.contribution);
    if (magnitude !== 0) return magnitude;
    return a.rule_id.localeCompare(b.rule_id);
  });

const buildSensitivity = (decision, evaluation) => {
  if (!Array.isArray(decision.assumptions) || decision.assumptions.length === 0) {
    return { assumption_impact: [] };
  }

  const deltaConvergence = -5;
  const baseOverall = evaluation.scores.overall_confidence;

  const assumptionImpact = decision.assumptions.map((assumption, index) => {
    const newConvergence = clampScore(evaluation.scores.convergence + deltaConvergence);
    const newOverall = calculateOverallScore(
      {
        reversibility: evaluation.scores.reversibility,
        blast_radius: evaluation.scores.blast_radius,
        dependency_weight: evaluation.scores.dependency_weight,
        convergence: newConvergence,
      },
      evaluation.weights
    );

    return {
      index,
      assumption,
      metric: 'convergence',
      delta_convergence: deltaConvergence,
      delta_overall: newOverall - baseOverall,
      new_overall: newOverall,
      rule_id: 'SENS-ASSUMP-001',
      description: 'Assumption invalidation reduces convergence by 5.',
    };
  });

  return { assumption_impact: assumptionImpact };
};

const generateReport = (decision, options = {}) => {
  const evaluation = evaluateDecision(decision, options);
  const generatedAt = options.generatedAt || new Date().toISOString();
  const drivers = sortDrivers(evaluation.drivers);

  const sensitivity = buildSensitivity(decision, evaluation);
  const report = {
    input_id: decision.id,
    scores: evaluation.scores,
    flags: evaluation.flags,
    drivers,
    mitigations: evaluation.mitigations,
    classification: evaluation.classification,
    explainability: evaluation.explainability,
    sensitivity,
    version: '0.1',
    generated_at: generatedAt,
  };

  const explainabilityLines = Object.entries(report.explainability.metrics)
    .map(([metric, detail]) => {
      const adjustments =
        detail.adjustments.length === 0
          ? '  - None'
          : detail.adjustments
              .map(
                (adjustment) =>
                  `  - ${adjustment.rule_id}: ${adjustment.description} (${adjustment.contribution})`
              )
              .join('\n');
      return `### ${metric}\nBase: ${detail.base}\nAdjustments:\n${adjustments}\nFinal: ${detail.final}`;
    })
    .join('\n\n');

  const overallExplainability = report.explainability.overall.components
    .map(
      (component) =>
        `- ${component.metric}: ${component.score} × ${component.weight} = ${component.weighted}`
    )
    .join('\n');

  const markdown = `# Decision Confidence Thermometer\n\n## ${decision.title}\n\n**Decision ID:** ${decision.id}\n**Date:** ${decision.date}\n**Type:** ${decision.decision_type}\n**Scope:** ${decision.scope_impact}\n\n## Scores\n- Overall Confidence: ${report.scores.overall_confidence}\n- Reversibility: ${report.scores.reversibility}\n- Blast Radius: ${report.scores.blast_radius}\n- Dependency Weight: ${report.scores.dependency_weight}\n- Convergence: ${report.scores.convergence}\n\n## Classification\n${report.classification.toUpperCase()}\n\n## Explainability\n${explainabilityLines}\n\n**Overall calculation**\n${overallExplainability}\n\n## Flags\n${report.flags.length === 0 ? 'None' : report.flags.map((flag) => `- [${flag.severity.toUpperCase()}] ${flag.code}: ${flag.message}`).join('\n')}\n\n## Top Drivers\n${drivers.length === 0 ? 'None' : drivers.slice(0, 6).map((driver) => `- ${driver.metric} (${driver.rule_id}): ${driver.description} (${driver.contribution})`).join('\n')}\n\n## Mitigations\n${report.mitigations.map((mitigation) => `- P${mitigation.priority}: ${mitigation.action} (${mitigation.linked_metric})`).join('\n')}\n\n## Confidence Sensitivity\n${report.sensitivity.assumption_impact.length === 0 ? 'None' : report.sensitivity.assumption_impact.map((impact) => `- Assumption ${impact.index + 1}: ${impact.assumption} → Δ overall ${impact.delta_overall} (new overall ${impact.new_overall})`).join('\n')}\n\n---\nGenerated at ${report.generated_at}\n`;

  return {
    report,
    markdown,
    json: stableStringify(report),
  };
};

module.exports = {
  generateReport,
  stableStringify,
};

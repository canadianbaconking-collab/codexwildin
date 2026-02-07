const { evaluateDecision } = require('./scoringEngine');
const { stableStringify } = require('./utils');

const sortDrivers = (drivers) =>
  [...drivers].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

const generateReport = (decision, options = {}) => {
  const evaluation = evaluateDecision(decision, options);
  const generatedAt = options.generatedAt || new Date().toISOString();
  const drivers = sortDrivers(evaluation.drivers);

  const report = {
    input_id: decision.id,
    scores: evaluation.scores,
    flags: evaluation.flags,
    drivers,
    mitigations: evaluation.mitigations,
    classification: evaluation.classification,
    explainability: evaluation.explainability,
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

  const markdown = `# Decision Confidence Thermometer\n\n## ${decision.title}\n\n**Decision ID:** ${decision.id}\n**Date:** ${decision.date}\n**Type:** ${decision.decision_type}\n**Scope:** ${decision.scope_impact}\n\n## Scores\n- Overall Confidence: ${report.scores.overall_confidence}\n- Reversibility: ${report.scores.reversibility}\n- Blast Radius: ${report.scores.blast_radius}\n- Dependency Weight: ${report.scores.dependency_weight}\n- Convergence: ${report.scores.convergence}\n\n## Classification\n${report.classification.toUpperCase()}\n\n## Explainability\n${explainabilityLines}\n\n**Overall calculation**\n${overallExplainability}\n\n## Flags\n${report.flags.length === 0 ? 'None' : report.flags.map((flag) => `- [${flag.severity.toUpperCase()}] ${flag.code}: ${flag.message}`).join('\n')}\n\n## Top Drivers\n${drivers.length === 0 ? 'None' : drivers.slice(0, 6).map((driver) => `- ${driver.metric} (${driver.rule_id}): ${driver.description} (${driver.contribution})`).join('\n')}\n\n## Mitigations\n${report.mitigations.map((mitigation) => `- P${mitigation.priority}: ${mitigation.action} (${mitigation.linked_metric})`).join('\n')}\n\n---\nGenerated at ${report.generated_at}\n`;

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

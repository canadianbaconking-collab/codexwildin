const test = require('node:test');
const assert = require('node:assert');
const { generateReport } = require('../src/reportGenerator');

test('sensitivity analysis reports deterministic assumption impacts', () => {
  const decision = {
    id: 'dec-sens-001',
    title: 'Sensitivity check',
    date: '2025-01-02T00:00:00.000Z',
    decision_type: 'tooling',
    context: 'We need a deterministic sensitivity check.',
    motivation: 'Ensure assumption flips are visible.',
    alternatives_considered: [{ name: 'Alt', why_not: 'Too limited for the scenario.' }],
    dependencies_introduced: [],
    scope_impact: 'local',
    reversibility_estimate: 'easy',
    migration_cost_estimate: 'low',
    time_horizon: 'days',
    constraints: ['Offline only.'],
    assumptions: ['Team capacity remains stable.', 'Performance targets stay fixed.'],
  };

  const { report } = generateReport(decision, { generatedAt: '2025-02-01T00:00:00.000Z' });
  assert.strictEqual(report.sensitivity.assumption_impact.length, 2);
  assert.strictEqual(report.sensitivity.assumption_impact[0].delta_convergence, -5);
  assert.strictEqual(report.sensitivity.assumption_impact[0].delta_overall <= 0, true);
});

const test = require('node:test');
const assert = require('node:assert');
const { evaluateDecision } = require('../src/scoringEngine');

const baseDecision = {
  id: 'dec-test-000',
  title: 'Test decision',
  date: '2025-01-01T00:00:00.000Z',
  decision_type: 'tooling',
  context: 'Context',
  motivation: 'Motivation',
  alternatives_considered: [{ name: 'Alt A', why_not: 'Short reason with enough detail.' }],
  dependencies_introduced: [],
  scope_impact: 'local',
  reversibility_estimate: 'easy',
  migration_cost_estimate: 'low',
  time_horizon: 'days',
  constraints: ['None'],
  assumptions: ['None'],
};

test('rule R-REV-002 applies high migration cost penalty', () => {
  const decision = { ...baseDecision, migration_cost_estimate: 'high' };
  const result = evaluateDecision(decision);
  const driver = result.drivers.find((item) => item.rule_id === 'R-REV-002');
  assert.ok(driver, 'Expected driver for R-REV-002');
  assert.strictEqual(driver.contribution, -15);
});

test('rule R-DEP-001 caps runtime penalties', () => {
  const decision = {
    ...baseDecision,
    dependencies_introduced: [
      { name: 'A', kind: 'runtime', criticality: 'high' },
      { name: 'B', kind: 'runtime', criticality: 'high' },
      { name: 'C', kind: 'runtime', criticality: 'high' },
      { name: 'D', kind: 'runtime', criticality: 'high' }
    ],
  };
  const result = evaluateDecision(decision);
  const driver = result.drivers.find((item) => item.rule_id === 'R-DEP-001');
  assert.ok(driver, 'Expected driver for R-DEP-001');
  assert.strictEqual(driver.contribution, -30);
});

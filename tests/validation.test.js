const test = require('node:test');
const assert = require('node:assert');
const { validateDecision } = require('../src/validation');

test('validateDecision returns deterministic errors for missing fields', () => {
  const result = validateDecision({});
  assert.strictEqual(result.isValid, false);
  assert.deepStrictEqual(result.errors, [
    { field: 'id', message: 'id must be a non-empty string.' },
    { field: 'title', message: 'title must be a non-empty string.' },
    { field: 'date', message: 'date must be a non-empty string.' },
    { field: 'decision_type', message: 'decision_type must be a non-empty string.' },
    { field: 'context', message: 'context must be a non-empty string.' },
    { field: 'motivation', message: 'motivation must be a non-empty string.' },
    {
      field: 'alternatives_considered',
      message: 'alternatives_considered must be an array.',
    },
    {
      field: 'dependencies_introduced',
      message: 'dependencies_introduced must be an array.',
    },
    { field: 'scope_impact', message: 'scope_impact must be a non-empty string.' },
    {
      field: 'reversibility_estimate',
      message: 'reversibility_estimate must be a non-empty string.',
    },
    {
      field: 'migration_cost_estimate',
      message: 'migration_cost_estimate must be a non-empty string.',
    },
    { field: 'time_horizon', message: 'time_horizon must be a non-empty string.' },
    { field: 'constraints', message: 'constraints must be an array of strings.' },
    { field: 'assumptions', message: 'assumptions must be an array of strings.' },
  ]);
});

test('validateDecision flags invalid enums and sentence counts', () => {
  const invalid = {
    id: 'dec-invalid',
    title: 'Bad',
    date: '2025-01-01',
    decision_type: 'invalid',
    context: 'One. Two. Three. Four. Five. Six. Seven.',
    motivation: '',
    alternatives_considered: [],
    dependencies_introduced: [{ name: '', kind: 'other', criticality: 'critical' }],
    scope_impact: 'global',
    reversibility_estimate: 'maybe',
    migration_cost_estimate: 'expensive',
    time_horizon: 'decades',
    constraints: [''],
    assumptions: ['Ok'],
  };
  const result = validateDecision(invalid);
  assert.strictEqual(result.isValid, false);
  const fields = result.errors.map((error) => error.field);
  assert.ok(fields.includes('date'));
  assert.ok(fields.includes('decision_type'));
  assert.ok(fields.includes('context'));
  assert.ok(fields.includes('motivation'));
  assert.ok(fields.includes('alternatives_considered'));
  assert.ok(fields.includes('dependencies_introduced[0].name'));
  assert.ok(fields.includes('dependencies_introduced[0].kind'));
  assert.ok(fields.includes('dependencies_introduced[0].criticality'));
  assert.ok(fields.includes('scope_impact'));
  assert.ok(fields.includes('reversibility_estimate'));
  assert.ok(fields.includes('migration_cost_estimate'));
  assert.ok(fields.includes('time_horizon'));
  assert.ok(fields.includes('constraints'));
});

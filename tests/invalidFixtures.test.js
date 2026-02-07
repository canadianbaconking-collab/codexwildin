const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { validateDecision } = require('../src/validation');

const invalidDir = path.join(__dirname, '..', 'fixtures', 'invalid');
const invalidFiles = fs
  .readdirSync(invalidDir)
  .filter((file) => file.endsWith('.json'))
  .sort();

test('invalid fixtures are rejected by schema validation', () => {
  invalidFiles.forEach((file) => {
    const fixturePath = path.join(invalidDir, file);
    const decision = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
    const result = validateDecision(decision);
    assert.strictEqual(result.isValid, false, `Expected ${file} to be invalid`);
    assert.ok(result.errors.length > 0, `Expected ${file} to have errors`);
  });
});

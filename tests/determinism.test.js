const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { generateReport } = require('../src/reportGenerator');

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const fixtureFiles = fs
  .readdirSync(fixturesDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => path.join(fixturesDir, file));

const generatedAt = '2025-02-01T00:00:00.000Z';

test('determinism: same input yields byte-identical JSON', () => {
  fixtureFiles.forEach((fixturePath) => {
    const decision = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
    const first = generateReport(decision, { generatedAt }).json;
    const second = generateReport(decision, { generatedAt }).json;
    assert.strictEqual(first, second, `Mismatch for fixture ${fixturePath}`);
  });
});

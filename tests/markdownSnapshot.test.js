const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { generateReport } = require('../src/reportGenerator');

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const snapshotDir = path.join(__dirname, 'snapshots');
const fixtureFiles = fs
  .readdirSync(fixturesDir)
  .filter((file) => file.endsWith('.json'))
  .sort();

const generatedAt = '2025-02-01T00:00:00.000Z';

test('markdown snapshots remain stable', () => {
  fixtureFiles.forEach((fixtureFile) => {
    const fixturePath = path.join(fixturesDir, fixtureFile);
    const decision = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
    const markdown = generateReport(decision, { generatedAt }).markdown;
    const snapshotPath = path.join(snapshotDir, fixtureFile.replace('.json', '.md'));
    const expected = fs.readFileSync(snapshotPath, 'utf-8');
    assert.strictEqual(markdown, expected, `Snapshot mismatch for ${fixtureFile}`);
  });
});

const fs = require('fs');
const path = require('path');
const { generateReport } = require('./reportGenerator');
const { validateDecision } = require('./validation');
const { stableStringify } = require('./utils');

const printUsage = () => {
  console.log(
    'Usage: node src/cli.js <decision.json> [--out-dir <dir>] [--weights <path>] [--generated-at <iso>]'
  );
};

const args = process.argv.slice(2);
if (args.length === 0) {
  printUsage();
  process.exit(1);
}

const decisionPath = args[0];
const outIndex = args.indexOf('--out-dir');
const weightsIndex = args.indexOf('--weights');
const generatedAtIndex = args.indexOf('--generated-at');
const outDir = outIndex >= 0 ? args[outIndex + 1] : 'out';
const weightsPath = weightsIndex >= 0 ? args[weightsIndex + 1] : null;
const generatedAt = generatedAtIndex >= 0 ? args[generatedAtIndex + 1] : null;

if (!decisionPath) {
  printUsage();
  process.exit(1);
}

const decisionRaw = fs.readFileSync(decisionPath, 'utf-8');
const decision = JSON.parse(decisionRaw);

const validation = validateDecision(decision);
if (!validation.isValid) {
  const errorReport = {
    error: 'validation_failed',
    issues: validation.errors,
  };
  console.error(stableStringify(errorReport));
  process.exit(1);
}

const { report, markdown, json } = generateReport(decision, {
  weightsPath,
  generatedAt,
});

const outputDir = path.resolve(outDir);
fs.mkdirSync(outputDir, { recursive: true });

const baseName = path.basename(decisionPath, path.extname(decisionPath));
const jsonPath = path.join(outputDir, `${baseName}.report.json`);
const mdPath = path.join(outputDir, `${baseName}.report.md`);

fs.writeFileSync(jsonPath, json + '\n');
fs.writeFileSync(mdPath, markdown);

console.log(`Report JSON: ${jsonPath}`);
console.log(`Report Markdown: ${mdPath}`);

# DecisionForge Lite (Decision Confidence Thermometer)

DecisionForge Lite is an offline-first, deterministic microtool that evaluates a single technical decision and produces a Decision Confidence Thermometer report with scored sub-metrics, drivers, flags, and mitigations.

## Features
- Deterministic scoring engine with explicit rule IDs.
- JSON report contract (`DecisionReport v0.1`) and markdown summary.
- CLI-first workflow with a stub UI for future expansion.
- Offline-first: no external APIs or telemetry.

## Requirements
- Node.js 18+ (for the built-in `node:test` runner).

## Install
No dependencies required. Clone the repository and run commands directly with Node.

## Run (CLI)
Generate a report from a fixture:
```bash
node src/cli.js fixtures/decision_orm.json --out-dir out
```
Outputs:
- `out/decision_orm.report.json`
- `out/decision_orm.report.md`

## Run tests
```bash
node --test
```

## Offline packaging plan (ZIP)
1. Ensure all reports are generated locally (optional).
2. Zip the repository including `src`, `spec`, `fixtures`, and `README.md`.
3. Distribute the ZIP; no network access is required to run.
4. Verify in an air-gapped environment:
   - `node src/cli.js fixtures/decision_orm.json --out-dir out`
   - `node --test`

## Constraints & roadmap
- **v0.1 constraints:** single decision per run, deterministic rules, no history, and stub UI.
- **Roadmap:** add local history storage, a minimal interactive UI, and rule configuration UI.

## Runbook
- Generate a report from a fixture:
  ```bash
  node src/cli.js fixtures/decision_queue.json --out-dir out
  ```
- Run determinism and rule tests:
  ```bash
  node --test
  ```

## Sample report outputs
Sample reports are stored in `examples/`.

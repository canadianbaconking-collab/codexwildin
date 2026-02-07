# DecisionForge Lite (Decision Confidence Thermometer)

DecisionForge Lite is an offline-first, deterministic microtool that evaluates a single technical decision and produces a Decision Confidence Thermometer report with scored sub-metrics, drivers, flags, and mitigations.

## Features
- Deterministic scoring engine with explicit rule IDs.
- JSON report contract (`DecisionReport v0.1`) and markdown summary.
- Explainability section with base scores, adjustments, and weighted roll-up.
- Deterministic schema validation before scoring.
- Plugin-ready rule registry for extending metrics deterministically.
- Confidence sensitivity analysis for assumption flips.
- Mitigations mapped to triggered rule IDs with deterministic fallbacks.
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
Generate a deterministic report with a fixed timestamp:
```bash
node src/cli.js fixtures/decision_orm.json --out-dir out --generated-at 2025-02-01T00:00:00.000Z
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
- Review the 6×6 fixture matrix summary:
  ```bash
  cat examples/fixture-summary.md
  ```

## Fixture matrix (6×6) + adversarial invalids
- 36 matrix fixtures live in `fixtures/dec-matrix-*.json`.
  - The 6×6 grid uses two deterministic variants for each `scope_impact` and `reversibility_estimate` value to reach 36 fixtures total.
- 10 adversarial invalid fixtures live in `fixtures/invalid/`.
- A score distribution + flag frequency summary is published in `examples/fixture-summary.md`.

## Sample report outputs
Sample reports are stored in `examples/`.

## Sample DecisionReport (JSON)
```json
{"classification":"risky","drivers":[{"contribution":15,"description":"Considering at least three alternatives improves convergence.","metric":"convergence","rule_id":"R-CONV-001"},{"contribution":-15,"description":"High migration cost reduces reversibility.","metric":"reversibility","rule_id":"R-REV-002"},{"contribution":-10,"description":"Large number of dependencies increases blast radius risk.","metric":"blast_radius","rule_id":"R-BLAST-001"},{"contribution":-10,"description":"Architecture decisions beyond local scope increase blast radius.","metric":"blast_radius","rule_id":"R-BLAST-002"},{"contribution":10,"description":"Alternatives have detailed rationale, improving convergence.","metric":"convergence","rule_id":"R-CONV-002"},{"contribution":-10,"description":"High-criticality runtime dependencies reduce dependency score.","metric":"dependency_weight","rule_id":"R-DEP-001"},{"contribution":-10,"description":"High-criticality data dependencies reduce dependency score.","metric":"dependency_weight","rule_id":"R-DEP-003"},{"contribution":-10,"description":"High-criticality data dependency reduces reversibility.","metric":"reversibility","rule_id":"R-REV-003"},{"contribution":-5,"description":"High-criticality build/ops dependencies reduce dependency score.","metric":"dependency_weight","rule_id":"R-DEP-002"}],"explainability":{"metrics":{"blast_radius":{"adjustments":[{"contribution":-10,"description":"Large number of dependencies increases blast radius risk.","rule_id":"R-BLAST-001"},{"contribution":-10,"description":"Architecture decisions beyond local scope increase blast radius.","rule_id":"R-BLAST-002"}],"base":25,"final":5},"convergence":{"adjustments":[{"contribution":15,"description":"Considering at least three alternatives improves convergence.","rule_id":"R-CONV-001"},{"contribution":10,"description":"Alternatives have detailed rationale, improving convergence.","rule_id":"R-CONV-002"}],"base":40,"final":65},"dependency_weight":{"adjustments":[{"contribution":-10,"description":"High-criticality runtime dependencies reduce dependency score.","rule_id":"R-DEP-001"},{"contribution":-5,"description":"High-criticality build/ops dependencies reduce dependency score.","rule_id":"R-DEP-002"},{"contribution":-10,"description":"High-criticality data dependencies reduce dependency score.","rule_id":"R-DEP-003"}],"base":70,"final":45},"reversibility":{"adjustments":[{"contribution":-15,"description":"High migration cost reduces reversibility.","rule_id":"R-REV-002"},{"contribution":-10,"description":"High-criticality data dependency reduces reversibility.","rule_id":"R-REV-003"}],"base":25,"final":0}},"overall":{"components":[{"metric":"reversibility","score":0,"weight":0.3,"weighted":0},{"metric":"blast_radius","score":5,"weight":0.3,"weighted":1.5},{"metric":"dependency_weight","score":45,"weight":0.2,"weighted":9},{"metric":"convergence","score":65,"weight":0.2,"weighted":13}],"final":24,"weights":{"blast_radius":0.3,"convergence":0.2,"dependency_weight":0.2,"reversibility":0.3}}},"flags":[{"code":"BLAST-RISK","message":"Blast radius score is low; impact could be wide.","severity":"risk"},{"code":"REV-LOCKIN","message":"Reversibility appears low; exit strategy may be hard.","severity":"warn"}],"generated_at":"2025-02-01T00:00:00.000Z","input_id":"dec-queue-003","mitigations":[{"action":"Define a rollback or escape plan with clear triggers.","linked_metric":"reversibility","priority":1,"rationale":"High migration cost makes reversibility harder without an exit plan."},{"action":"Prototype data migrations and validate rollback paths early.","linked_metric":"reversibility","priority":1,"rationale":"High-criticality data dependencies require careful exit validation."},{"action":"Limit initial deployment scope and monitor blast radius.","linked_metric":"blast_radius","priority":2,"rationale":"A large dependency surface increases potential impact."},{"action":"Stage architecture changes behind incremental rollouts.","linked_metric":"blast_radius","priority":2,"rationale":"Architecture changes outside local scope increase blast radius."},{"action":"Audit build/ops dependencies for criticality and substitution.","linked_metric":"dependency_weight","priority":3,"rationale":"Build and ops dependencies can be decoupled to reduce risk."},{"action":"Harden data dependency contracts and minimize tight coupling.","linked_metric":"dependency_weight","priority":3,"rationale":"High-criticality data dependencies elevate migration risk."},{"action":"Reduce or tier critical runtime dependencies where possible.","linked_metric":"dependency_weight","priority":3,"rationale":"Runtime dependencies can compound operational risk."},{"action":"Capture trade-offs across alternatives to preserve decision context.","linked_metric":"convergence","priority":4,"rationale":"Maintains convergence gains by documenting explored options."},{"action":"Summarize why rejected options were insufficient.","linked_metric":"convergence","priority":4,"rationale":"Detailed rationale strengthens convergence signals."}],"scores":{"blast_radius":5,"convergence":65,"dependency_weight":45,"overall_confidence":24,"reversibility":0},"sensitivity":{"assumption_impact":[{"assumption":"Operations team can manage broker upgrades","delta_convergence":-5,"delta_overall":-1,"description":"Assumption invalidation reduces convergence by 5.","index":0,"metric":"convergence","new_overall":23,"rule_id":"SENS-ASSUMP-001"}]},"version":"0.1"}
```

## Sample DecisionReport (Markdown)
```markdown
# Decision Confidence Thermometer

## Introduce RabbitMQ for async processing

**Decision ID:** dec-queue-003
**Date:** 2025-01-15T09:00:00.000Z
**Type:** architecture
**Scope:** systemwide

## Scores
- Overall Confidence: 24
- Reversibility: 0
- Blast Radius: 5
- Dependency Weight: 45
- Convergence: 65

## Classification
RISKY

## Explainability
### reversibility
Base: 25
Adjustments:
  - R-REV-002: High migration cost reduces reversibility. (-15)
  - R-REV-003: High-criticality data dependency reduces reversibility. (-10)
Final: 0

### blast_radius
Base: 25
Adjustments:
  - R-BLAST-001: Large number of dependencies increases blast radius risk. (-10)
  - R-BLAST-002: Architecture decisions beyond local scope increase blast radius. (-10)
Final: 5

### dependency_weight
Base: 70
Adjustments:
  - R-DEP-001: High-criticality runtime dependencies reduce dependency score. (-10)
  - R-DEP-002: High-criticality build/ops dependencies reduce dependency score. (-5)
  - R-DEP-003: High-criticality data dependencies reduce dependency score. (-10)
Final: 45

### convergence
Base: 40
Adjustments:
  - R-CONV-001: Considering at least three alternatives improves convergence. (15)
  - R-CONV-002: Alternatives have detailed rationale, improving convergence. (10)
Final: 65

**Overall calculation**
- reversibility: 0 × 0.3 = 0
- blast_radius: 5 × 0.3 = 1.5
- dependency_weight: 45 × 0.2 = 9
- convergence: 65 × 0.2 = 13

## Flags
- [RISK] BLAST-RISK: Blast radius score is low; impact could be wide.
- [WARN] REV-LOCKIN: Reversibility appears low; exit strategy may be hard.

## Top Drivers
- convergence (R-CONV-001): Considering at least three alternatives improves convergence. (15)
- reversibility (R-REV-002): High migration cost reduces reversibility. (-15)
- blast_radius (R-BLAST-001): Large number of dependencies increases blast radius risk. (-10)
- blast_radius (R-BLAST-002): Architecture decisions beyond local scope increase blast radius. (-10)
- convergence (R-CONV-002): Alternatives have detailed rationale, improving convergence. (10)
- dependency_weight (R-DEP-001): High-criticality runtime dependencies reduce dependency score. (-10)

## Mitigations
- P1: Define a rollback or escape plan with clear triggers. (reversibility)
- P1: Prototype data migrations and validate rollback paths early. (reversibility)
- P2: Limit initial deployment scope and monitor blast radius. (blast_radius)
- P2: Stage architecture changes behind incremental rollouts. (blast_radius)
- P3: Audit build/ops dependencies for criticality and substitution. (dependency_weight)
- P3: Harden data dependency contracts and minimize tight coupling. (dependency_weight)
- P3: Reduce or tier critical runtime dependencies where possible. (dependency_weight)
- P4: Capture trade-offs across alternatives to preserve decision context. (convergence)
- P4: Summarize why rejected options were insufficient. (convergence)

## Confidence Sensitivity
- Assumption 1: Operations team can manage broker upgrades → Δ overall -1 (new overall 23)

---
Generated at 2025-02-01T00:00:00.000Z
```

## Final Audit Checklist
- ✅ Deterministic outputs with injectable `generated_at`.
- ✅ Offline-first, no external APIs or telemetry.
- ✅ JSON + markdown outputs for each decision.
- ✅ Explainable scoring with rule IDs and contributions.
- ✅ Rule registry and mitigation mapping in place.
- ✅ Sensitivity analysis included in reports.
- ✅ Single decision per run (v0.1 scope).
- ✅ Required schema fields and validation enforced.
- ✅ Fixture matrix (6×6) and adversarial invalid fixtures generated with summary table.
- ✅ Deliverables: spec, scoring engine, report generator, CLI, tests, fixtures, README.

## Remaining TODOs (prioritized)
1. Add a minimal interactive TUI to preview reports before writing to disk.
2. Add schema versioning guardrails to CLI inputs.
3. Add optional JSON schema export for tool integrations.
4. Expand mitigation templates for each rule ID.
5. Add local history index for past decisions (v0.2).

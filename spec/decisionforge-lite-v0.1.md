# DecisionForge Lite v0.1 Specification

## Product definition
DecisionForge Lite is an offline-first, deterministic microtool that takes a single technical decision input and outputs a “Decision Confidence Thermometer” report. It produces a machine-readable JSON report and a human-readable markdown summary. v0.1 is intentionally small: one decision at a time, rules-based scoring, and a minimal CLI interface with a stub UI.

## Stack choice
**Node.js + JavaScript** (no external services, no network calls). This keeps the tool lightweight, deterministic, and easy to run offline with local files only.

## Decision input schema (DecisionArtifact v0.1)
```json
{
  "id": "string (stable)",
  "title": "string",
  "date": "ISO string",
  "decision_type": "framework | library | architecture | data_model | infra | tooling | process | other",
  "context": "string (1–6 sentences)",
  "motivation": "string (1–6 sentences)",
  "alternatives_considered": [
    { "name": "string", "why_not": "string" }
  ],
  "dependencies_introduced": [
    { "name": "string", "kind": "runtime | build | ops | data", "criticality": "low | med | high" }
  ],
  "scope_impact": "local | subsystem | systemwide",
  "reversibility_estimate": "easy | moderate | hard",
  "migration_cost_estimate": "low | med | high",
  "time_horizon": "days | weeks | months | years",
  "constraints": ["string"],
  "assumptions": ["string"],
  "evidence_links": ["string"],
  "notes": "string"
}
```
Notes:
- `evidence_links` and `notes` are optional. All other fields are required.

## Decision report schema (DecisionReport v0.1)
```json
{
  "input_id": "string",
  "scores": {
    "overall_confidence": 0,
    "reversibility": 0,
    "blast_radius": 0,
    "dependency_weight": 0,
    "convergence": 0
  },
  "flags": [{ "code": "string", "severity": "info | warn | risk", "message": "string" }],
  "drivers": [{ "metric": "string", "rule_id": "string", "description": "string", "contribution": 0 }],
  "mitigations": [{ "priority": 1, "action": "string", "rationale": "string", "linked_metric": "string" }],
  "classification": "stable | tentative | risky",
  "explainability": {
    "metrics": {
      "reversibility": { "base": 0, "adjustments": [{ "rule_id": "string", "description": "string", "contribution": 0 }], "final": 0 },
      "blast_radius": { "base": 0, "adjustments": [{ "rule_id": "string", "description": "string", "contribution": 0 }], "final": 0 },
      "dependency_weight": { "base": 0, "adjustments": [{ "rule_id": "string", "description": "string", "contribution": 0 }], "final": 0 },
      "convergence": { "base": 0, "adjustments": [{ "rule_id": "string", "description": "string", "contribution": 0 }], "final": 0 }
    },
    "overall": {
      "weights": { "reversibility": 0, "blast_radius": 0, "dependency_weight": 0, "convergence": 0 },
      "components": [{ "metric": "string", "score": 0, "weight": 0, "weighted": 0 }],
      "final": 0
    }
  },
  "version": "0.1",
  "generated_at": "ISO string"
}
```

## Scoring model and weights
All rules are deterministic and produce additive contributions. Metrics are clamped to 0–100 after applying base values and rule contributions.

### Metrics and base values
- **Reversibility**: base from `reversibility_estimate` (easy=80, moderate=55, hard=25).
- **Blast radius**: base from `scope_impact` (local=80, subsystem=55, systemwide=25).
- **Dependency weight**: base 70.
- **Convergence**: base 40.

### Rule adjustments (examples)
- **R-REV-001**: +10 if `scope_impact=local`.
- **R-REV-002**: -15 if `migration_cost_estimate=high`.
- **R-REV-003**: -10 if any dependency is `kind=data` and `criticality=high`.
- **R-BLAST-001**: -10 if dependencies count >= 4.
- **R-BLAST-002**: -10 if `decision_type=architecture` and `scope_impact!=local`.
- **R-DEP-001**: -10 per high runtime dependency (max -30).
- **R-DEP-002**: -5 per high build/ops dependency (max -15).
- **R-DEP-003**: -10 if any high criticality data dependency.
- **R-CONV-001**: +15 if `alternatives_considered >= 3`.
- **R-CONV-002**: +10 if all alternatives have `why_not` length > 20.
- **R-CONV-003**: -10 if only 1 alternative and `scope_impact` is subsystem/systemwide.

### Overall confidence
Weighted sum:
- reversibility 0.30
- blast_radius 0.30
- dependency_weight 0.20
- convergence 0.20

### Classification
- stable >= 70
- tentative 45–69
- risky < 45

### Weights table
Weights can be overridden via configuration in `config/weights.json` (optional):
```json
{
  "overall": {
    "reversibility": 0.30,
    "blast_radius": 0.30,
    "dependency_weight": 0.20,
    "convergence": 0.20
  }
}
```

## Examples
- A local tooling decision with easy reversibility and low migration cost yields higher confidence.
- A systemwide architecture decision with multiple high-criticality runtime dependencies yields lower confidence with risk flags.

## Drift guards (do NOT build)
- No accounts, telemetry, analytics, or cloud sync.
- No external API calls or dependency metadata lookups.
- No multi-decision history beyond a stub.
- No non-deterministic or “AI” advice.
- No project management or journaling features.

## Deterministic validation
Inputs are validated deterministically before scoring. Invalid inputs produce a structured error list in a stable order and terminate the CLI with a non-zero exit code.

## CLI flags
- `--out-dir <dir>`: output directory for reports.
- `--weights <path>`: optional weights override JSON file.
- `--generated-at <iso>`: inject a deterministic timestamp for report generation.

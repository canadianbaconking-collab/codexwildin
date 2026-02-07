# Decision Confidence Thermometer

## Matrix systemwide-b / easy-a

**Decision ID:** dec-matrix-systemwide-b-easy-a
**Date:** 2025-01-10T00:00:00.000Z
**Type:** architecture
**Scope:** systemwide

## Scores
- Overall Confidence: 30
- Reversibility: 55
- Blast Radius: 5
- Dependency Weight: 30
- Convergence: 30

## Classification
RISKY

## Explainability
### reversibility
Base: 80
Adjustments:
  - R-REV-002: High migration cost reduces reversibility. (-15)
  - R-REV-003: High-criticality data dependency reduces reversibility. (-10)
Final: 55

### blast_radius
Base: 25
Adjustments:
  - R-BLAST-001: Large number of dependencies increases blast radius risk. (-10)
  - R-BLAST-002: Architecture decisions beyond local scope increase blast radius. (-10)
Final: 5

### dependency_weight
Base: 70
Adjustments:
  - R-DEP-001: High-criticality runtime dependencies reduce dependency score. (-20)
  - R-DEP-002: High-criticality build/ops dependencies reduce dependency score. (-10)
  - R-DEP-003: High-criticality data dependencies reduce dependency score. (-10)
Final: 30

### convergence
Base: 40
Adjustments:
  - R-CONV-003: Only one alternative for non-local scope reduces convergence. (-10)
Final: 30

**Overall calculation**
- reversibility: 55 × 0.3 = 16.5
- blast_radius: 5 × 0.3 = 1.5
- dependency_weight: 30 × 0.2 = 6
- convergence: 30 × 0.2 = 6

## Flags
- [RISK] BLAST-RISK: Blast radius score is low; impact could be wide.
- [WARN] DEP-HEAVY: Dependency weight is high; consider reducing critical dependencies.
- [INFO] CONV-LOW: Convergence is low; decision may need more exploration.

## Top Drivers
- dependency_weight (R-DEP-001): High-criticality runtime dependencies reduce dependency score. (-20)
- reversibility (R-REV-002): High migration cost reduces reversibility. (-15)
- blast_radius (R-BLAST-001): Large number of dependencies increases blast radius risk. (-10)
- blast_radius (R-BLAST-002): Architecture decisions beyond local scope increase blast radius. (-10)
- convergence (R-CONV-003): Only one alternative for non-local scope reduces convergence. (-10)
- dependency_weight (R-DEP-002): High-criticality build/ops dependencies reduce dependency score. (-10)

## Mitigations
- P1: Define a rollback or escape plan with clear triggers. (reversibility)
- P1: Prototype data migrations and validate rollback paths early. (reversibility)
- P2: Limit initial deployment scope and monitor blast radius. (blast_radius)
- P2: Stage architecture changes behind incremental rollouts. (blast_radius)
- P3: Audit build/ops dependencies for criticality and substitution. (dependency_weight)
- P3: Harden data dependency contracts and minimize tight coupling. (dependency_weight)
- P3: Reduce or tier critical runtime dependencies where possible. (dependency_weight)
- P4: Re-open the alternatives list for non-local decisions. (convergence)

## Confidence Sensitivity
- Assumption 1: Team capacity is stable → Δ overall -1 (new overall 29)
- Assumption 2: Latency budget remains unchanged → Δ overall -1 (new overall 29)

---
Generated at 2025-02-01T00:00:00.000Z

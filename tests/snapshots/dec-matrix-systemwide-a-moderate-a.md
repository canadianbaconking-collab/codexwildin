# Decision Confidence Thermometer

## Matrix systemwide-a / moderate-a

**Decision ID:** dec-matrix-systemwide-a-moderate-a
**Date:** 2025-01-10T00:00:00.000Z
**Type:** architecture
**Scope:** systemwide

## Scores
- Overall Confidence: 32
- Reversibility: 45
- Blast Radius: 5
- Dependency Weight: 35
- Convergence: 50

## Classification
RISKY

## Explainability
### reversibility
Base: 55
Adjustments:
  - R-REV-003: High-criticality data dependency reduces reversibility. (-10)
Final: 45

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
  - R-DEP-002: High-criticality build/ops dependencies reduce dependency score. (-5)
  - R-DEP-003: High-criticality data dependencies reduce dependency score. (-10)
Final: 35

### convergence
Base: 40
Adjustments:
  - R-CONV-002: Alternatives have detailed rationale, improving convergence. (10)
Final: 50

**Overall calculation**
- reversibility: 45 × 0.3 = 13.5
- blast_radius: 5 × 0.3 = 1.5
- dependency_weight: 35 × 0.2 = 7
- convergence: 50 × 0.2 = 10

## Flags
- [RISK] BLAST-RISK: Blast radius score is low; impact could be wide.
- [WARN] DEP-HEAVY: Dependency weight is high; consider reducing critical dependencies.

## Top Drivers
- dependency_weight (R-DEP-001): High-criticality runtime dependencies reduce dependency score. (-20)
- blast_radius (R-BLAST-001): Large number of dependencies increases blast radius risk. (-10)
- blast_radius (R-BLAST-002): Architecture decisions beyond local scope increase blast radius. (-10)
- convergence (R-CONV-002): Alternatives have detailed rationale, improving convergence. (10)
- dependency_weight (R-DEP-003): High-criticality data dependencies reduce dependency score. (-10)
- reversibility (R-REV-003): High-criticality data dependency reduces reversibility. (-10)

## Mitigations
- P1: Prototype data migrations and validate rollback paths early. (reversibility)
- P2: Limit initial deployment scope and monitor blast radius. (blast_radius)
- P2: Stage architecture changes behind incremental rollouts. (blast_radius)
- P3: Audit build/ops dependencies for criticality and substitution. (dependency_weight)
- P3: Harden data dependency contracts and minimize tight coupling. (dependency_weight)
- P3: Reduce or tier critical runtime dependencies where possible. (dependency_weight)
- P4: Summarize why rejected options were insufficient. (convergence)

## Confidence Sensitivity
- Assumption 1: Team capacity is stable → Δ overall -1 (new overall 31)
- Assumption 2: Latency budget remains unchanged → Δ overall -1 (new overall 31)

---
Generated at 2025-02-01T00:00:00.000Z

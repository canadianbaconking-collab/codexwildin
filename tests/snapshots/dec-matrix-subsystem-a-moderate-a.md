# Decision Confidence Thermometer

## Matrix subsystem-a / moderate-a

**Decision ID:** dec-matrix-subsystem-a-moderate-a
**Date:** 2025-01-10T00:00:00.000Z
**Type:** architecture
**Scope:** subsystem

## Scores
- Overall Confidence: 47
- Reversibility: 45
- Blast Radius: 45
- Dependency Weight: 50
- Convergence: 50

## Classification
TENTATIVE

## Explainability
### reversibility
Base: 55
Adjustments:
  - R-REV-003: High-criticality data dependency reduces reversibility. (-10)
Final: 45

### blast_radius
Base: 55
Adjustments:
  - R-BLAST-002: Architecture decisions beyond local scope increase blast radius. (-10)
Final: 45

### dependency_weight
Base: 70
Adjustments:
  - R-DEP-001: High-criticality runtime dependencies reduce dependency score. (-10)
  - R-DEP-003: High-criticality data dependencies reduce dependency score. (-10)
Final: 50

### convergence
Base: 40
Adjustments:
  - R-CONV-002: Alternatives have detailed rationale, improving convergence. (10)
Final: 50

**Overall calculation**
- reversibility: 45 × 0.3 = 13.5
- blast_radius: 45 × 0.3 = 13.5
- dependency_weight: 50 × 0.2 = 10
- convergence: 50 × 0.2 = 10

## Flags
None

## Top Drivers
- blast_radius (R-BLAST-002): Architecture decisions beyond local scope increase blast radius. (-10)
- convergence (R-CONV-002): Alternatives have detailed rationale, improving convergence. (10)
- dependency_weight (R-DEP-001): High-criticality runtime dependencies reduce dependency score. (-10)
- dependency_weight (R-DEP-003): High-criticality data dependencies reduce dependency score. (-10)
- reversibility (R-REV-003): High-criticality data dependency reduces reversibility. (-10)

## Mitigations
- P1: Prototype data migrations and validate rollback paths early. (reversibility)
- P2: Stage architecture changes behind incremental rollouts. (blast_radius)
- P3: Harden data dependency contracts and minimize tight coupling. (dependency_weight)
- P3: Reduce or tier critical runtime dependencies where possible. (dependency_weight)
- P4: Summarize why rejected options were insufficient. (convergence)

## Confidence Sensitivity
- Assumption 1: Team capacity is stable → Δ overall -1 (new overall 46)
- Assumption 2: Latency budget remains unchanged → Δ overall -1 (new overall 46)

---
Generated at 2025-02-01T00:00:00.000Z

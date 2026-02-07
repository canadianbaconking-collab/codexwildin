# Decision Confidence Thermometer

## Matrix subsystem-a / hard-a

**Decision ID:** dec-matrix-subsystem-a-hard-a
**Date:** 2025-01-10T00:00:00.000Z
**Type:** architecture
**Scope:** subsystem

## Scores
- Overall Confidence: 41
- Reversibility: 15
- Blast Radius: 45
- Dependency Weight: 50
- Convergence: 65

## Classification
RISKY

## Explainability
### reversibility
Base: 25
Adjustments:
  - R-REV-003: High-criticality data dependency reduces reversibility. (-10)
Final: 15

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
  - R-CONV-001: Considering at least three alternatives improves convergence. (15)
  - R-CONV-002: Alternatives have detailed rationale, improving convergence. (10)
Final: 65

**Overall calculation**
- reversibility: 15 × 0.3 = 4.5
- blast_radius: 45 × 0.3 = 13.5
- dependency_weight: 50 × 0.2 = 10
- convergence: 65 × 0.2 = 13

## Flags
- [WARN] REV-LOCKIN: Reversibility appears low; exit strategy may be hard.

## Top Drivers
- convergence (R-CONV-001): Considering at least three alternatives improves convergence. (15)
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
- P4: Capture trade-offs across alternatives to preserve decision context. (convergence)
- P4: Summarize why rejected options were insufficient. (convergence)

## Confidence Sensitivity
- Assumption 1: Team capacity is stable → Δ overall -1 (new overall 40)
- Assumption 2: Latency budget remains unchanged → Δ overall -1 (new overall 40)

---
Generated at 2025-02-01T00:00:00.000Z

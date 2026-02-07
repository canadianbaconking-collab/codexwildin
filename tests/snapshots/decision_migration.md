# Decision Confidence Thermometer

## Adopt blue-green database migration approach

**Decision ID:** dec-migrate-004
**Date:** 2025-01-20T11:15:00.000Z
**Type:** data_model
**Scope:** systemwide

## Scores
- Overall Confidence: 39
- Reversibility: 30
- Blast Radius: 25
- Dependency Weight: 60
- Convergence: 50

## Classification
RISKY

## Explainability
### reversibility
Base: 55
Adjustments:
  - R-REV-002: High migration cost reduces reversibility. (-15)
  - R-REV-003: High-criticality data dependency reduces reversibility. (-10)
Final: 30

### blast_radius
Base: 25
Adjustments:
  - None
Final: 25

### dependency_weight
Base: 70
Adjustments:
  - R-DEP-003: High-criticality data dependencies reduce dependency score. (-10)
Final: 60

### convergence
Base: 40
Adjustments:
  - R-CONV-002: Alternatives have detailed rationale, improving convergence. (10)
Final: 50

**Overall calculation**
- reversibility: 30 × 0.3 = 9
- blast_radius: 25 × 0.3 = 7.5
- dependency_weight: 60 × 0.2 = 12
- convergence: 50 × 0.2 = 10

## Flags
- [RISK] BLAST-RISK: Blast radius score is low; impact could be wide.
- [WARN] REV-LOCKIN: Reversibility appears low; exit strategy may be hard.

## Top Drivers
- reversibility (R-REV-002): High migration cost reduces reversibility. (-15)
- reversibility (R-REV-003): High-criticality data dependency reduces reversibility. (-10)
- dependency_weight (R-DEP-003): High-criticality data dependencies reduce dependency score. (-10)
- convergence (R-CONV-002): Alternatives have detailed rationale, improving convergence. (10)

## Mitigations
- P1: Define a rollback or escape plan with clear triggers. (reversibility)
- P2: Limit initial deployment scope and monitor blast radius. (blast_radius)
- P3: Reduce or tier critical dependencies where possible. (dependency_weight)
- P4: Document rejected alternatives and revisit if assumptions change. (convergence)

---
Generated at 2025-02-01T00:00:00.000Z

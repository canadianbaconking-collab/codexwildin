# Decision Confidence Thermometer

## Adopt Prisma ORM for core services

**Decision ID:** dec-orm-001
**Date:** 2025-01-10T10:00:00.000Z
**Type:** library
**Scope:** subsystem

## Scores
- Overall Confidence: 58
- Reversibility: 55
- Blast Radius: 55
- Dependency Weight: 60
- Convergence: 65

## Classification
TENTATIVE

## Explainability
### reversibility
Base: 55
Adjustments:
  - None
Final: 55

### blast_radius
Base: 55
Adjustments:
  - None
Final: 55

### dependency_weight
Base: 70
Adjustments:
  - R-DEP-001: High-criticality runtime dependencies reduce dependency score. (-10)
Final: 60

### convergence
Base: 40
Adjustments:
  - R-CONV-001: Considering at least three alternatives improves convergence. (15)
  - R-CONV-002: Alternatives have detailed rationale, improving convergence. (10)
Final: 65

**Overall calculation**
- reversibility: 55 × 0.3 = 16.5
- blast_radius: 55 × 0.3 = 16.5
- dependency_weight: 60 × 0.2 = 12
- convergence: 65 × 0.2 = 13

## Flags
None

## Top Drivers
- convergence (R-CONV-001): Considering at least three alternatives improves convergence. (15)
- dependency_weight (R-DEP-001): High-criticality runtime dependencies reduce dependency score. (-10)
- convergence (R-CONV-002): Alternatives have detailed rationale, improving convergence. (10)

## Mitigations
- P1: Define a rollback or escape plan with clear triggers. (reversibility)
- P2: Limit initial deployment scope and monitor blast radius. (blast_radius)
- P3: Reduce or tier critical dependencies where possible. (dependency_weight)
- P4: Document rejected alternatives and revisit if assumptions change. (convergence)

---
Generated at 2025-02-01T00:00:00.000Z

# Decision Confidence Thermometer

## Switch web framework from Express to Fastify

**Decision ID:** dec-framework-002
**Date:** 2025-01-12T14:30:00.000Z
**Type:** framework
**Scope:** subsystem

## Scores
- Overall Confidence: 51
- Reversibility: 40
- Blast Radius: 55
- Dependency Weight: 60
- Convergence: 50

## Classification
TENTATIVE

## Explainability
### reversibility
Base: 55
Adjustments:
  - R-REV-002: High migration cost reduces reversibility. (-15)
Final: 40

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
  - R-CONV-002: Alternatives have detailed rationale, improving convergence. (10)
Final: 50

**Overall calculation**
- reversibility: 40 × 0.3 = 12
- blast_radius: 55 × 0.3 = 16.5
- dependency_weight: 60 × 0.2 = 12
- convergence: 50 × 0.2 = 10

## Flags
- [WARN] REV-LOCKIN: Reversibility appears low; exit strategy may be hard.

## Top Drivers
- reversibility (R-REV-002): High migration cost reduces reversibility. (-15)
- dependency_weight (R-DEP-001): High-criticality runtime dependencies reduce dependency score. (-10)
- convergence (R-CONV-002): Alternatives have detailed rationale, improving convergence. (10)

## Mitigations
- P1: Define a rollback or escape plan with clear triggers. (reversibility)
- P2: Limit initial deployment scope and monitor blast radius. (blast_radius)
- P3: Reduce or tier critical dependencies where possible. (dependency_weight)
- P4: Document rejected alternatives and revisit if assumptions change. (convergence)

---
Generated at 2025-02-01T00:00:00.000Z

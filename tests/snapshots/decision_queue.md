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
- reversibility (R-REV-002): High migration cost reduces reversibility. (-15)
- convergence (R-CONV-001): Considering at least three alternatives improves convergence. (15)
- reversibility (R-REV-003): High-criticality data dependency reduces reversibility. (-10)
- blast_radius (R-BLAST-001): Large number of dependencies increases blast radius risk. (-10)
- blast_radius (R-BLAST-002): Architecture decisions beyond local scope increase blast radius. (-10)
- dependency_weight (R-DEP-001): High-criticality runtime dependencies reduce dependency score. (-10)

## Mitigations
- P1: Define a rollback or escape plan with clear triggers. (reversibility)
- P2: Limit initial deployment scope and monitor blast radius. (blast_radius)
- P3: Reduce or tier critical dependencies where possible. (dependency_weight)
- P4: Document rejected alternatives and revisit if assumptions change. (convergence)

---
Generated at 2025-02-01T00:00:00.000Z

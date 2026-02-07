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

# Decision Confidence Thermometer

## Matrix local-a / hard-b

**Decision ID:** dec-matrix-local-a-hard-b
**Date:** 2025-01-10T00:00:00.000Z
**Type:** tooling
**Scope:** local

## Scores
- Overall Confidence: 57
- Reversibility: 35
- Blast Radius: 80
- Dependency Weight: 70
- Convergence: 40

## Classification
TENTATIVE

## Explainability
### reversibility
Base: 25
Adjustments:
  - R-REV-001: Scope impact is local, increasing reversibility. (10)
Final: 35

### blast_radius
Base: 80
Adjustments:
  - None
Final: 80

### dependency_weight
Base: 70
Adjustments:
  - None
Final: 70

### convergence
Base: 40
Adjustments:
  - None
Final: 40

**Overall calculation**
- reversibility: 35 × 0.3 = 10.5
- blast_radius: 80 × 0.3 = 24
- dependency_weight: 70 × 0.2 = 14
- convergence: 40 × 0.2 = 8

## Flags
- [WARN] REV-LOCKIN: Reversibility appears low; exit strategy may be hard.
- [INFO] CONV-LOW: Convergence is low; decision may need more exploration.

## Top Drivers
- reversibility (R-REV-001): Scope impact is local, increasing reversibility. (10)

## Mitigations
- P1: Define a rollback or escape plan with clear triggers. (reversibility)
- P4: Document rejected alternatives and revisit if assumptions change. (convergence)

## Confidence Sensitivity
- Assumption 1: Team capacity is stable → Δ overall -1 (new overall 56)
- Assumption 2: Latency budget remains unchanged → Δ overall -1 (new overall 56)

---
Generated at 2025-02-01T00:00:00.000Z

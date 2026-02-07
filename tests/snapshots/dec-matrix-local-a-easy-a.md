# Decision Confidence Thermometer

## Matrix local-a / easy-a

**Decision ID:** dec-matrix-local-a-easy-a
**Date:** 2025-01-10T00:00:00.000Z
**Type:** tooling
**Scope:** local

## Scores
- Overall Confidence: 73
- Reversibility: 90
- Blast Radius: 80
- Dependency Weight: 70
- Convergence: 40

## Classification
STABLE

## Explainability
### reversibility
Base: 80
Adjustments:
  - R-REV-001: Scope impact is local, increasing reversibility. (10)
Final: 90

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
- reversibility: 90 × 0.3 = 27
- blast_radius: 80 × 0.3 = 24
- dependency_weight: 70 × 0.2 = 14
- convergence: 40 × 0.2 = 8

## Flags
- [INFO] CONV-LOW: Convergence is low; decision may need more exploration.

## Top Drivers
- reversibility (R-REV-001): Scope impact is local, increasing reversibility. (10)

## Mitigations
- P4: Document rejected alternatives and revisit if assumptions change. (convergence)

## Confidence Sensitivity
- Assumption 1: Team capacity is stable → Δ overall -1 (new overall 72)
- Assumption 2: Latency budget remains unchanged → Δ overall -1 (new overall 72)

---
Generated at 2025-02-01T00:00:00.000Z

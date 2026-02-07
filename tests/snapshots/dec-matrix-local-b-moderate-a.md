# Decision Confidence Thermometer

## Matrix local-b / moderate-a

**Decision ID:** dec-matrix-local-b-moderate-a
**Date:** 2025-01-10T00:00:00.000Z
**Type:** tooling
**Scope:** local

## Scores
- Overall Confidence: 68
- Reversibility: 65
- Blast Radius: 80
- Dependency Weight: 70
- Convergence: 50

## Classification
TENTATIVE

## Explainability
### reversibility
Base: 55
Adjustments:
  - R-REV-001: Scope impact is local, increasing reversibility. (10)
Final: 65

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
  - R-CONV-002: Alternatives have detailed rationale, improving convergence. (10)
Final: 50

**Overall calculation**
- reversibility: 65 × 0.3 = 19.5
- blast_radius: 80 × 0.3 = 24
- dependency_weight: 70 × 0.2 = 14
- convergence: 50 × 0.2 = 10

## Flags
None

## Top Drivers
- convergence (R-CONV-002): Alternatives have detailed rationale, improving convergence. (10)
- reversibility (R-REV-001): Scope impact is local, increasing reversibility. (10)

## Mitigations
- P4: Summarize why rejected options were insufficient. (convergence)

## Confidence Sensitivity
- Assumption 1: Team capacity is stable → Δ overall -1 (new overall 67)
- Assumption 2: Latency budget remains unchanged → Δ overall -1 (new overall 67)

---
Generated at 2025-02-01T00:00:00.000Z

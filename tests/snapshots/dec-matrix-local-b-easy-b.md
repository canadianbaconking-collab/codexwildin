# Decision Confidence Thermometer

## Matrix local-b / easy-b

**Decision ID:** dec-matrix-local-b-easy-b
**Date:** 2025-01-10T00:00:00.000Z
**Type:** tooling
**Scope:** local

## Scores
- Overall Confidence: 78
- Reversibility: 90
- Blast Radius: 80
- Dependency Weight: 70
- Convergence: 65

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
  - R-CONV-001: Considering at least three alternatives improves convergence. (15)
  - R-CONV-002: Alternatives have detailed rationale, improving convergence. (10)
Final: 65

**Overall calculation**
- reversibility: 90 × 0.3 = 27
- blast_radius: 80 × 0.3 = 24
- dependency_weight: 70 × 0.2 = 14
- convergence: 65 × 0.2 = 13

## Flags
None

## Top Drivers
- convergence (R-CONV-001): Considering at least three alternatives improves convergence. (15)
- convergence (R-CONV-002): Alternatives have detailed rationale, improving convergence. (10)
- reversibility (R-REV-001): Scope impact is local, increasing reversibility. (10)

## Mitigations
- P4: Capture trade-offs across alternatives to preserve decision context. (convergence)
- P4: Summarize why rejected options were insufficient. (convergence)

## Confidence Sensitivity
- Assumption 1: Team capacity is stable → Δ overall -1 (new overall 77)
- Assumption 2: Latency budget remains unchanged → Δ overall -1 (new overall 77)

---
Generated at 2025-02-01T00:00:00.000Z

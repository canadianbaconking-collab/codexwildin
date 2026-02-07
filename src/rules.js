const RULES = [
  {
    id: 'R-REV-001',
    metric: 'reversibility',
    description: 'Scope impact is local, increasing reversibility.',
    apply: ({ decision }) => (decision.scope_impact === 'local' ? 10 : 0),
  },
  {
    id: 'R-REV-002',
    metric: 'reversibility',
    description: 'High migration cost reduces reversibility.',
    apply: ({ decision }) => (decision.migration_cost_estimate === 'high' ? -15 : 0),
  },
  {
    id: 'R-REV-003',
    metric: 'reversibility',
    description: 'High-criticality data dependency reduces reversibility.',
    apply: ({ derived }) => (derived.hasHighDataDependency ? -10 : 0),
  },
  {
    id: 'R-BLAST-001',
    metric: 'blast_radius',
    description: 'Large number of dependencies increases blast radius risk.',
    apply: ({ decision }) => (decision.dependencies_introduced.length >= 4 ? -10 : 0),
  },
  {
    id: 'R-BLAST-002',
    metric: 'blast_radius',
    description: 'Architecture decisions beyond local scope increase blast radius.',
    apply: ({ decision }) =>
      decision.decision_type === 'architecture' && decision.scope_impact !== 'local' ? -10 : 0,
  },
  {
    id: 'R-DEP-001',
    metric: 'dependency_weight',
    description: 'High-criticality runtime dependencies reduce dependency score.',
    apply: ({ derived }) => Math.max(derived.highRuntimeDeps * -10, -30),
  },
  {
    id: 'R-DEP-002',
    metric: 'dependency_weight',
    description: 'High-criticality build/ops dependencies reduce dependency score.',
    apply: ({ derived }) => Math.max(derived.highBuildOpsDeps * -5, -15),
  },
  {
    id: 'R-DEP-003',
    metric: 'dependency_weight',
    description: 'High-criticality data dependencies reduce dependency score.',
    apply: ({ derived }) => (derived.hasHighDataDependency ? -10 : 0),
  },
  {
    id: 'R-CONV-001',
    metric: 'convergence',
    description: 'Considering at least three alternatives improves convergence.',
    apply: ({ derived }) => (derived.alternativesCount >= 3 ? 15 : 0),
  },
  {
    id: 'R-CONV-002',
    metric: 'convergence',
    description: 'Alternatives have detailed rationale, improving convergence.',
    apply: ({ derived }) => (derived.allAlternativesDetailed ? 10 : 0),
  },
  {
    id: 'R-CONV-003',
    metric: 'convergence',
    description: 'Only one alternative for non-local scope reduces convergence.',
    apply: ({ derived, decision }) =>
      derived.alternativesCount === 1 && decision.scope_impact !== 'local' ? -10 : 0,
  },
];

const MITIGATION_TEMPLATES = {
  'R-REV-002': {
    priority: 1,
    action: 'Define a rollback or escape plan with clear triggers.',
    rationale: 'High migration cost makes reversibility harder without an exit plan.',
    linked_metric: 'reversibility',
  },
  'R-REV-003': {
    priority: 1,
    action: 'Prototype data migrations and validate rollback paths early.',
    rationale: 'High-criticality data dependencies require careful exit validation.',
    linked_metric: 'reversibility',
  },
  'R-BLAST-001': {
    priority: 2,
    action: 'Limit initial deployment scope and monitor blast radius.',
    rationale: 'A large dependency surface increases potential impact.',
    linked_metric: 'blast_radius',
  },
  'R-BLAST-002': {
    priority: 2,
    action: 'Stage architecture changes behind incremental rollouts.',
    rationale: 'Architecture changes outside local scope increase blast radius.',
    linked_metric: 'blast_radius',
  },
  'R-DEP-001': {
    priority: 3,
    action: 'Reduce or tier critical runtime dependencies where possible.',
    rationale: 'Runtime dependencies can compound operational risk.',
    linked_metric: 'dependency_weight',
  },
  'R-DEP-002': {
    priority: 3,
    action: 'Audit build/ops dependencies for criticality and substitution.',
    rationale: 'Build and ops dependencies can be decoupled to reduce risk.',
    linked_metric: 'dependency_weight',
  },
  'R-DEP-003': {
    priority: 3,
    action: 'Harden data dependency contracts and minimize tight coupling.',
    rationale: 'High-criticality data dependencies elevate migration risk.',
    linked_metric: 'dependency_weight',
  },
  'R-CONV-001': {
    priority: 4,
    action: 'Capture trade-offs across alternatives to preserve decision context.',
    rationale: 'Maintains convergence gains by documenting explored options.',
    linked_metric: 'convergence',
  },
  'R-CONV-002': {
    priority: 4,
    action: 'Summarize why rejected options were insufficient.',
    rationale: 'Detailed rationale strengthens convergence signals.',
    linked_metric: 'convergence',
  },
  'R-CONV-003': {
    priority: 4,
    action: 'Re-open the alternatives list for non-local decisions.',
    rationale: 'Single-option decisions at scale benefit from more exploration.',
    linked_metric: 'convergence',
  },
};

const METRIC_FALLBACKS = {
  reversibility: {
    priority: 1,
    action: 'Define a rollback or escape plan with clear triggers.',
    rationale: 'Low reversibility requires a clear exit strategy.',
    linked_metric: 'reversibility',
  },
  blast_radius: {
    priority: 2,
    action: 'Limit initial deployment scope and monitor blast radius.',
    rationale: 'Reducing exposure helps contain wide impact.',
    linked_metric: 'blast_radius',
  },
  dependency_weight: {
    priority: 3,
    action: 'Reduce or tier critical dependencies where possible.',
    rationale: 'Lower dependency weight improves resilience.',
    linked_metric: 'dependency_weight',
  },
  convergence: {
    priority: 4,
    action: 'Document rejected alternatives and revisit if assumptions change.',
    rationale: 'Low convergence benefits from deeper exploration.',
    linked_metric: 'convergence',
  },
};

module.exports = {
  RULES,
  MITIGATION_TEMPLATES,
  METRIC_FALLBACKS,
};

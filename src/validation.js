const DECISION_TYPE = [
  'framework',
  'library',
  'architecture',
  'data_model',
  'infra',
  'tooling',
  'process',
  'other',
];
const DEPENDENCY_KIND = ['runtime', 'build', 'ops', 'data'];
const CRITICALITY = ['low', 'med', 'high'];
const SCOPE_IMPACT = ['local', 'subsystem', 'systemwide'];
const REVERSIBILITY = ['easy', 'moderate', 'hard'];
const MIGRATION_COST = ['low', 'med', 'high'];
const TIME_HORIZON = ['days', 'weeks', 'months', 'years'];

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const countSentences = (text) =>
  text
    .split(/[.!?]+/)
    .map((segment) => segment.trim())
    .filter(Boolean).length;

const validateDecision = (decision) => {
  const errors = [];

  const requireString = (field, label = field) => {
    if (typeof decision[field] !== 'string' || decision[field].trim() === '') {
      errors.push({ field, message: `${label} must be a non-empty string.` });
      return false;
    }
    return true;
  };

  requireString('id', 'id');
  requireString('title', 'title');

  if (requireString('date', 'date') && !ISO_DATE_REGEX.test(decision.date)) {
    errors.push({ field: 'date', message: 'date must be an ISO string with milliseconds and Z.' });
  }

  if (requireString('decision_type', 'decision_type') && !DECISION_TYPE.includes(decision.decision_type)) {
    errors.push({ field: 'decision_type', message: 'decision_type must be a valid enum value.' });
  }

  if (requireString('context', 'context')) {
    const count = countSentences(decision.context);
    if (count < 1 || count > 6) {
      errors.push({ field: 'context', message: 'context must be 1–6 sentences.' });
    }
  }

  if (requireString('motivation', 'motivation')) {
    const count = countSentences(decision.motivation);
    if (count < 1 || count > 6) {
      errors.push({ field: 'motivation', message: 'motivation must be 1–6 sentences.' });
    }
  }

  if (!Array.isArray(decision.alternatives_considered)) {
    errors.push({
      field: 'alternatives_considered',
      message: 'alternatives_considered must be an array.',
    });
  } else {
    if (decision.alternatives_considered.length < 1) {
      errors.push({
        field: 'alternatives_considered',
        message: 'alternatives_considered must include at least one alternative.',
      });
    }
    decision.alternatives_considered.forEach((alt, index) => {
      if (!alt || typeof alt !== 'object') {
        errors.push({
          field: `alternatives_considered[${index}]`,
          message: 'alternative must be an object.',
        });
        return;
      }
      if (typeof alt.name !== 'string' || alt.name.trim() === '') {
        errors.push({
          field: `alternatives_considered[${index}].name`,
          message: 'alternative name must be a non-empty string.',
        });
      }
      if (typeof alt.why_not !== 'string' || alt.why_not.trim() === '') {
        errors.push({
          field: `alternatives_considered[${index}].why_not`,
          message: 'alternative why_not must be a non-empty string.',
        });
      }
    });
  }

  if (!Array.isArray(decision.dependencies_introduced)) {
    errors.push({
      field: 'dependencies_introduced',
      message: 'dependencies_introduced must be an array.',
    });
  } else {
    decision.dependencies_introduced.forEach((dep, index) => {
      if (!dep || typeof dep !== 'object') {
        errors.push({
          field: `dependencies_introduced[${index}]`,
          message: 'dependency must be an object.',
        });
        return;
      }
      if (typeof dep.name !== 'string' || dep.name.trim() === '') {
        errors.push({
          field: `dependencies_introduced[${index}].name`,
          message: 'dependency name must be a non-empty string.',
        });
      }
      if (!DEPENDENCY_KIND.includes(dep.kind)) {
        errors.push({
          field: `dependencies_introduced[${index}].kind`,
          message: 'dependency kind must be runtime | build | ops | data.',
        });
      }
      if (!CRITICALITY.includes(dep.criticality)) {
        errors.push({
          field: `dependencies_introduced[${index}].criticality`,
          message: 'dependency criticality must be low | med | high.',
        });
      }
    });
  }

  if (requireString('scope_impact', 'scope_impact') && !SCOPE_IMPACT.includes(decision.scope_impact)) {
    errors.push({ field: 'scope_impact', message: 'scope_impact must be a valid enum value.' });
  }

  if (
    requireString('reversibility_estimate', 'reversibility_estimate') &&
    !REVERSIBILITY.includes(decision.reversibility_estimate)
  ) {
    errors.push({
      field: 'reversibility_estimate',
      message: 'reversibility_estimate must be a valid enum value.',
    });
  }

  if (
    requireString('migration_cost_estimate', 'migration_cost_estimate') &&
    !MIGRATION_COST.includes(decision.migration_cost_estimate)
  ) {
    errors.push({
      field: 'migration_cost_estimate',
      message: 'migration_cost_estimate must be a valid enum value.',
    });
  }

  if (requireString('time_horizon', 'time_horizon') && !TIME_HORIZON.includes(decision.time_horizon)) {
    errors.push({ field: 'time_horizon', message: 'time_horizon must be a valid enum value.' });
  }

  if (!Array.isArray(decision.constraints)) {
    errors.push({ field: 'constraints', message: 'constraints must be an array of strings.' });
  } else if (decision.constraints.some((item) => typeof item !== 'string' || item.trim() === '')) {
    errors.push({ field: 'constraints', message: 'constraints must be non-empty strings.' });
  }

  if (!Array.isArray(decision.assumptions)) {
    errors.push({ field: 'assumptions', message: 'assumptions must be an array of strings.' });
  } else if (decision.assumptions.some((item) => typeof item !== 'string' || item.trim() === '')) {
    errors.push({ field: 'assumptions', message: 'assumptions must be non-empty strings.' });
  }

  if (decision.evidence_links !== undefined) {
    if (!Array.isArray(decision.evidence_links)) {
      errors.push({ field: 'evidence_links', message: 'evidence_links must be an array of strings.' });
    } else if (decision.evidence_links.some((item) => typeof item !== 'string' || item.trim() === '')) {
      errors.push({ field: 'evidence_links', message: 'evidence_links must be non-empty strings.' });
    }
  }

  if (decision.notes !== undefined && (typeof decision.notes !== 'string' || decision.notes.trim() === '')) {
    errors.push({ field: 'notes', message: 'notes must be a non-empty string when provided.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateDecision,
};

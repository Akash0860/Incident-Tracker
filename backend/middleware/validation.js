// Validation middleware for incident creation
const validateIncident = (req, res, next) => {
  const { title, service, severity, status } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (!service || service.trim().length === 0) {
    errors.push('Service is required');
  }
  if (!severity || !['SEV1', 'SEV2', 'SEV3', 'SEV4'].includes(severity)) {
    errors.push('Severity must be one of: SEV1, SEV2, SEV3, SEV4');
  }
  if (!status || !['OPEN', 'MITIGATED', 'RESOLVED'].includes(status)) {
    errors.push('Status must be one of: OPEN, MITIGATED, RESOLVED');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = {
  validateIncident
};

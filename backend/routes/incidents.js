const express = require('express');
const router = express.Router();
const { validateIncident } = require('../middleware/validation');
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident
} = require('../controllers/incidentController');

// POST /api/incidents - Create new incident
router.post('/', validateIncident, createIncident);

// GET /api/incidents - Get all incidents with pagination
router.get('/', getIncidents);

// GET /api/incidents/:id - Get single incident
router.get('/:id', getIncidentById);

// PATCH /api/incidents/:id - Update incident
router.patch('/:id', updateIncident);

module.exports = router;

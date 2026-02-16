const { pool } = require('../config/database');

// Create new incident
const createIncident = async (req, res) => {
  try {
    const { title, service, severity, status, owner, summary } = req.body;
    
    const query = `
      INSERT INTO incidents (title, service, severity, status, owner, summary)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [title, service, severity, status, owner || null, summary || null];
    const result = await pool.query(query, values);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating incident:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all incidents with pagination, filtering, and sorting
const getIncidents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const search = req.query.search || '';
    const services = req.query.services ? req.query.services.split(',') : [];
    const severities = req.query.severities ? req.query.severities.split(',') : [];
    const statuses = req.query.statuses ? req.query.statuses.split(',') : [];
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'DESC';

    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];
    let paramCounter = 1;

    if (search) {
      whereConditions.push(`(title ILIKE $${paramCounter} OR summary ILIKE $${paramCounter})`);
      queryParams.push(`%${search}%`);
      paramCounter++;
    }

    if (services.length > 0) {
      whereConditions.push(`service = ANY($${paramCounter})`);
      queryParams.push(services);
      paramCounter++;
    }

    if (severities.length > 0) {
      whereConditions.push(`severity = ANY($${paramCounter})`);
      queryParams.push(severities);
      paramCounter++;
    }

    if (statuses.length > 0) {
      whereConditions.push(`status = ANY($${paramCounter})`);
      queryParams.push(statuses);
      paramCounter++;
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Validate sortBy column
    const allowedSortColumns = ['title', 'service', 'severity', 'status', 'created_at', 'owner'];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM incidents ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM incidents
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
    `;
    
    const dataResult = await pool.query(dataQuery, [...queryParams, limit, offset]);

    res.json({
      incidents: dataResult.rows,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching incidents:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single incident by ID
const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM incidents WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching incident:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update incident
const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, service, severity, status, owner, summary } = req.body;
    
    // Validate if incident exists
    const checkQuery = 'SELECT * FROM incidents WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCounter}`);
      values.push(title);
      paramCounter++;
    }
    if (service !== undefined) {
      updates.push(`service = $${paramCounter}`);
      values.push(service);
      paramCounter++;
    }
    if (severity !== undefined) {
      if (!['SEV1', 'SEV2', 'SEV3', 'SEV4'].includes(severity)) {
        return res.status(400).json({ error: 'Invalid severity value' });
      }
      updates.push(`severity = $${paramCounter}`);
      values.push(severity);
      paramCounter++;
    }
    if (status !== undefined) {
      if (!['OPEN', 'MITIGATED', 'RESOLVED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      updates.push(`status = $${paramCounter}`);
      values.push(status);
      paramCounter++;
    }
    if (owner !== undefined) {
      updates.push(`owner = $${paramCounter}`);
      values.push(owner);
      paramCounter++;
    }
    if (summary !== undefined) {
      updates.push(`summary = $${paramCounter}`);
      values.push(summary);
      paramCounter++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE incidents
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating incident:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident
};

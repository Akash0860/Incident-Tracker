import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentAPI } from '../api';
import './CreateIncident.css';

const SERVICES = ['Auth', 'Payments', 'Backend', 'Frontend', 'Database', 'API Gateway', 'Cache', 'Search'];
const SEVERITIES = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const STATUSES = ['OPEN', 'MITIGATED', 'RESOLVED'];

function CreateIncident() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    service: '',
    severity: 'SEV1',
    status: '',
    owner: '',
    summary: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.service) {
      setError('Service is required');
      return;
    }
    if (!formData.status) {
      setError('Status is required');
      return;
    }

    setLoading(true);

    try {
      await incidentAPI.createIncident({
        title: formData.title,
        service: formData.service,
        severity: formData.severity,
        status: formData.status,
        owner: formData.owner || null,
        summary: formData.summary || null,
      });
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Failed to create incident');
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Incident Tracker</h1>
      
      <div className="card">
        <div className="card-header">
          Create Incident
        </div>

        <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Create New Incident</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Issue Title..."
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Service</label>
            <select
              name="service"
              className="form-select"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="">Select Service</option>
              {SERVICES.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Severity</label>
            <div className="radio-group">
              {SEVERITIES.map(severity => (
                <div key={severity} className="radio-option">
                  <input
                    type="radio"
                    id={severity}
                    name="severity"
                    value={severity}
                    checked={formData.severity === severity}
                    onChange={handleChange}
                  />
                  <label htmlFor={severity}>{severity}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              {STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Assigned To <span className="optional-text">Optional</span>
            </label>
            <input
              type="text"
              name="owner"
              className="form-input"
              value={formData.owner}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Summary</label>
            <textarea
              name="summary"
              className="form-textarea"
              placeholder="Describe the incident..."
              value={formData.summary}
              onChange={handleChange}
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Incident'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIncident;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { incidentAPI } from '../api';
import './IncidentDetail.css';

const SEVERITIES = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const STATUSES = ['OPEN', 'MITIGATED', 'RESOLVED'];

function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [incident, setIncident] = useState(null);
  const [formData, setFormData] = useState({
    severity: '',
    status: '',
    owner: '',
    summary: '',
  });

  const fetchIncident = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await incidentAPI.getIncident(id);
      setIncident(data);
      setFormData({
        severity: data.severity,
        status: data.status,
        owner: data.owner || '',
        summary: data.summary || '',
      });
    } catch (err) {
      setError('Failed to fetch incident');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchIncident();
  }, [fetchIncident]);

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
    setSaving(true);

    try {
      await incidentAPI.updateIncident(id, formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update incident');
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="page-container">
        <div className="error">Incident not found</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Incident Tracker</h1>
      
      <div className="card">
        <div className="card-header">
          Incident Detail
        </div>

        <h2 className="incident-title">{incident.title}</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="detail-row">
            <label className="detail-label">Service:</label>
            <span className="detail-value">{incident.service}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Severity:</label>
            <select
              name="severity"
              className="form-select detail-select"
              value={formData.severity}
              onChange={handleChange}
            >
              {SEVERITIES.map(severity => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status:</label>
            <select
              name="status"
              className="form-select detail-select"
              value={formData.status}
              onChange={handleChange}
            >
              {STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned To:</label>
            <input
              type="text"
              name="owner"
              className="form-input detail-input"
              value={formData.owner}
              onChange={handleChange}
            />
          </div>

          <div className="detail-row">
            <label className="detail-label">Occurred At:</label>
            <span className="detail-value">{formatDate(incident.created_at)}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Summary</label>
            <textarea
              name="summary"
              className="form-textarea"
              value={formData.summary}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
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

export default IncidentDetail;

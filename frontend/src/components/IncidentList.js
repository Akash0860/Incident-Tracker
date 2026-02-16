import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentAPI } from '../api';
import './IncidentList.css';

const SERVICES = ['Auth', 'Payments', 'Backend', 'Frontend', 'Database', 'API Gateway', 'Cache', 'Search'];
const SEVERITIES = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const STATUSES = ['OPEN', 'MITIGATED', 'RESOLVED'];

function IncidentList() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSeverities, setSelectedSeverities] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit: 10,
        search,
        sortBy,
        sortOrder,
      };
      
      if (selectedServices.length > 0) {
        params.services = selectedServices.join(',');
      }
      
      if (selectedSeverities.length > 0) {
        params.severities = selectedSeverities.join(',');
      }
      
      if (selectedStatuses.length > 0) {
        params.statuses = selectedStatuses.join(',');
      }
      
      const data = await incidentAPI.getIncidents(params);
      setIncidents(data.incidents);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError('Failed to fetch incidents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedServices, selectedSeverities, selectedStatuses, sortBy, sortOrder]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
    setPage(1);
  };

  const handleSeverityToggle = (severity) => {
    setSelectedSeverities(prev => {
      if (prev.includes(severity)) {
        return prev.filter(s => s !== severity);
      } else {
        return [...prev, severity];
      }
    });
    setPage(1);
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
    setPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${page === i ? 'active' : ''}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <span className="pagination-info">Page {page} of {totalPages}</span>
        <div className="pagination-buttons">
          <button
            className="pagination-btn"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            &lt;&lt;
          </button>
          {pages}
          <button
            className="pagination-btn"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            Next &gt;&gt;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Incident Tracker</h1>
      
      <div className="card">
        <div className="card-header-row">
          <h2>Incident List</h2>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create')}
          >
            New Incident 
          </button>
        </div>

        <div className="filters-section">
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Service </label>
              <div className="checkbox-group">
                {SERVICES.map(service => (
                  <div key={service} className="checkbox-option">
                    <input
                      type="checkbox"
                      id={service}
                      checked={selectedServices.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                    />
                    <label htmlFor={service}>{service}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Severity </label>
              <div className="checkbox-group">
                {SEVERITIES.map(severity => (
                  <div key={severity} className="checkbox-option">
                    <input
                      type="checkbox"
                      id={`sev-${severity}`}
                      checked={selectedSeverities.includes(severity)}
                      onChange={() => handleSeverityToggle(severity)}
                    />
                    <label htmlFor={`sev-${severity}`}>{severity}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Status </label>
              <div className="checkbox-group">
                {STATUSES.map(status => (
                  <div key={status} className="checkbox-option">
                    <input
                      type="checkbox"
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusToggle(status)}
                    />
                    <label htmlFor={`status-${status}`}>{status}</label>
                  </div>
                ))}
              </div>
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn btn-secondary" onClick={fetchIncidents}>
              Filter
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <table className="incidents-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('title')}>
                    Title {sortBy === 'title' && (sortOrder === 'ASC' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('severity')}>
                    Severity {sortBy === 'severity' && (sortOrder === 'ASC' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('status')}>
                    Status {sortBy === 'status' && (sortOrder === 'ASC' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('created_at')}>
                    Created At {sortBy === 'created_at' && (sortOrder === 'ASC' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('owner')}>
                    Owner {sortBy === 'owner' && (sortOrder === 'ASC' ? '▲' : '▼')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(incident => (
                  <tr 
                    key={incident.id}
                    onClick={() => navigate(`/incidents/${incident.id}`)}
                    className="incident-row"
                  >
                    <td>{incident.title}</td>
                    <td>{incident.severity}</td>
                    <td>
                      <span className={getStatusClass(incident.status)}>
                        {incident.status}
                      </span>
                    </td>
                    <td>{formatDate(incident.created_at)}</td>
                    <td>{incident.owner || '...'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}

export default IncidentList;

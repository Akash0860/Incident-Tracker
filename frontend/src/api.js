import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const incidentAPI = {
  // Get all incidents with pagination and filters
  getIncidents: async (params) => {
    const response = await axios.get(`${API_BASE_URL}/incidents`, { params });
    return response.data;
  },

  // Get single incident by ID
  getIncident: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/incidents/${id}`);
    return response.data;
  },

  // Create new incident
  createIncident: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/incidents`, data);
    return response.data;
  },

  // Update incident
  updateIncident: async (id, data) => {
    const response = await axios.patch(`${API_BASE_URL}/incidents/${id}`, data);
    return response.data;
  },
};

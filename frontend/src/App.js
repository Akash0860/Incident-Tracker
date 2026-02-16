import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IncidentList from './components/IncidentList';
import IncidentDetail from './components/IncidentDetail';
import CreateIncident from './components/CreateIncident';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IncidentList />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
          <Route path="/create" element={<CreateIncident />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

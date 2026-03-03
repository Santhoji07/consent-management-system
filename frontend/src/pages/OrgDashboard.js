import React, { useState } from 'react';
import RequestAccess from '../components/RequestAccess';
import '../styles/dashboard.css';

function OrgDashboard() {
  const [activeSection, setActiveSection] = useState('request');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Organization Dashboard</h1>
        <p>Request access to user consents</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-sidebar">
          <button 
            className={activeSection === 'request' ? 'active' : ''} 
            onClick={() => setActiveSection('request')}
          >
            Request Access
          </button>
        </div>

        <div className="dashboard-content">
          {activeSection === 'request' && <RequestAccess />}
        </div>
      </div>
    </div>
  );
}

export default OrgDashboard;


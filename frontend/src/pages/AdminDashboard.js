import React, { useState } from 'react';
import EnforcementLogs from '../components/EnforcementLogs';
import ViewHistory from '../components/ViewHistory';
import '../styles/dashboard.css';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('enforcements');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor and manage consents</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-sidebar">
          <button 
            className={activeSection === 'enforcements' ? 'active' : ''} 
            onClick={() => setActiveSection('enforcements')}
          >
            Enforcement Logs
          </button>
          <button 
            className={activeSection === 'history' ? 'active' : ''} 
            onClick={() => setActiveSection('history')}
          >
            View History
          </button>
        </div>

        <div className="dashboard-content">
          {activeSection === 'enforcements' && <EnforcementLogs />}
          {activeSection === 'history' && <ViewHistory />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


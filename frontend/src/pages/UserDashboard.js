import React, { useState } from 'react';
import CreateConsent from '../components/CreateConsent';
import UpdateConsent from '../components/UpdateConsent';
import RevokeConsent from '../components/RevokeConsent';
import ViewHistory from '../components/ViewHistory';
import '../styles/dashboard.css';

function UserDashboard() {
  const [activeSection, setActiveSection] = useState('create');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <p>Manage your consents</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-sidebar">
          <button 
            className={activeSection === 'create' ? 'active' : ''} 
            onClick={() => setActiveSection('create')}
          >
            Create Consent
          </button>
          <button 
            className={activeSection === 'update' ? 'active' : ''} 
            onClick={() => setActiveSection('update')}
          >
            Update Consent
          </button>
          <button 
            className={activeSection === 'revoke' ? 'active' : ''} 
            onClick={() => setActiveSection('revoke')}
          >
            Revoke Consent
          </button>
          <button 
            className={activeSection === 'history' ? 'active' : ''} 
            onClick={() => setActiveSection('history')}
          >
            View History
          </button>
        </div>

        <div className="dashboard-content">
          {activeSection === 'create' && <CreateConsent />}
          {activeSection === 'update' && <UpdateConsent />}
          {activeSection === 'revoke' && <RevokeConsent />}
          {activeSection === 'history' && <ViewHistory />}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;


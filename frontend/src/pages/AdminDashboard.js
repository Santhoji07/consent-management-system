import React from 'react';
import EnforcementLogs from '../components/EnforcementLogs';
import ViewHistory from '../components/ViewHistory';

function AdminDashboard() {

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <EnforcementLogs />
      <ViewHistory />

    </div>
  );
}

export default AdminDashboard;
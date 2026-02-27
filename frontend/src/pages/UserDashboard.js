import React from 'react';
import CreateConsent from '../components/CreateConsent';
import UpdateConsent from '../components/UpdateConsent';
import RevokeConsent from '../components/RevokeConsent';
import ViewHistory from '../components/ViewHistory';

function UserDashboard() {

  return (
    <div>
      <h1>User Dashboard</h1>

      <CreateConsent />
      <UpdateConsent />
      <RevokeConsent />
      <ViewHistory />

    </div>
  );
}

export default UserDashboard;
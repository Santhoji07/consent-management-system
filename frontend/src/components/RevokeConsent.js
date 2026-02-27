import React, { useState } from 'react';
import API from '../services/api';

function RevokeConsent() {

  const [consentId, setConsentId] = useState('');

  const handleRevoke = async () => {
    try {
      await API.post('/consent/revoke', { consentId });
      alert('Consent Revoked');
    } catch (err) {
      alert('Revoke Failed');
    }
  };

  return (
    <div>
      <h3>Revoke Consent</h3>
      <input placeholder="Consent ID" onChange={e => setConsentId(e.target.value)} />
      <button onClick={handleRevoke}>Revoke</button>
    </div>
  );
}

export default RevokeConsent;
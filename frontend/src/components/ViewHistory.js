import React, { useState } from 'react';
import API from '../services/api';

function ViewHistory() {

  const [consentId, setConsentId] = useState('');
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const res = await API.get(`/consent/history/${consentId}`);
    setHistory(res.data);
  };

  return (
    <div>
      <h3>View Consent History</h3>
      <input placeholder="Consent ID" onChange={e => setConsentId(e.target.value)} />
      <button onClick={fetchHistory}>Fetch</button>

      <pre>{JSON.stringify(history, null, 2)}</pre>
    </div>
  );
}

export default ViewHistory;
import React, { useState } from 'react';
import API from '../services/api';

function EnforcementLogs() {

  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const res = await API.get('/consent/enforcements');
    setLogs(res.data);
  };

  return (
    <div>
      <h3>All Enforcement Logs</h3>
      <button onClick={fetchLogs}>Load Logs</button>

      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
}

export default EnforcementLogs;
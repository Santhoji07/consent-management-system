import React, { useState } from 'react';
import API from '../services/api';

function RequestAccess() {

  const [data, setData] = useState({
    consentId: '',
    orgId: '',
    purpose: ''
  });

  const [result, setResult] = useState(null);

  const handleRequest = async () => {
    const res = await API.post('/consent/request-access', data);
    setResult(res.data);
  };

  return (
    <div>
      <h3>Request Access</h3>

      {Object.keys(data).map(key => (
        <input
          key={key}
          placeholder={key}
          onChange={e => setData({ ...data, [key]: e.target.value })}
        />
      ))}

      <button onClick={handleRequest}>Request</button>

      {result && (
        <div>
          <h4>Decision: {result.decision}</h4>
          <p>Reason: {result.reason}</p>
        </div>
      )}
    </div>
  );
}

export default RequestAccess;
import React, { useState } from 'react';
import API from '../services/api';

function EnforcementLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await API.get('/consent/enforcements');
      setLogs(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch enforcement logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>All Enforcement Logs</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <button onClick={fetchLogs} disabled={loading} style={{ marginBottom: '20px' }}>
        {loading ? 'Loading...' : 'Load Logs'}
      </button>

      {logs && logs.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Total Logs: {logs.length}</h4>
          <pre className="pre-json">{JSON.stringify(logs, null, 2)}</pre>
        </div>
      )}
      
      {logs && logs.length === 0 && !loading && (
        <p style={{ marginTop: '20px', color: '#666' }}>No enforcement logs found.</p>
      )}
    </div>
  );
}

export default EnforcementLogs;


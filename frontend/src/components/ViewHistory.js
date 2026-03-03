import React, { useState } from 'react';
import API from '../services/api';

function ViewHistory() {
  const [consentId, setConsentId] = useState('');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setHistory(null);
    
    try {
      const res = await API.get(`/consent/history/${consentId}`);
      setHistory(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>View Consent History</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={fetchHistory}>
        <div className="form-group">
          <label>Consent ID</label>
          <input 
            placeholder="Enter Consent ID" 
            value={consentId}
            onChange={e => setConsentId(e.target.value)} 
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch History'}
        </button>
      </form>

      {history && (
        <div className="response-display">
          <h4>Consent History</h4>
          <pre className="pre-json">{JSON.stringify(history, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ViewHistory;


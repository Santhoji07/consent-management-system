import React, { useState } from 'react';
import API from '../services/api';

function RequestAccess() {
  const username = localStorage.getItem('username') || '';
  
  const [data, setData] = useState({
    consentId: '',
    orgId: username,
    purpose: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const res = await API.post('/consent/request-access', data);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Request Access</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleRequest}>
        <div className="form-group">
          <label>Consent ID</label>
          <input
            type="text"
            placeholder="Enter Consent ID"
            value={data.consentId}
            onChange={e => setData({ ...data, consentId: e.target.value })}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Organization ID</label>
          <input
            type="text"
            value={data.orgId}
            onChange={e => setData({ ...data, orgId: e.target.value })}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Purpose</label>
          <input
            type="text"
            placeholder="Enter purpose for access"
            value={data.purpose}
            onChange={e => setData({ ...data, purpose: e.target.value })}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Request Access'}
        </button>
      </form>

      {result && (
        <div className="response-display">
          <h4>Decision: <span className={result.decision === 'GRANTED' ? 'decision-granted' : 'decision-denied'}>
            {result.decision}
          </span></h4>
          {result.reason && <p>Reason: {result.reason}</p>}
          {result.policyUsed && <p>Policy Used: {result.policyUsed}</p>}
        </div>
      )}
    </div>
  );
}

export default RequestAccess;


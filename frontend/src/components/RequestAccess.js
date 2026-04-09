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

  // Render detailed condition check
  const renderConditionCheck = (key, value) => {
    if (!value) return null;
    
    const labels = {
      purpose: 'Purpose Check',
      expiry: 'Expiry Check',
      dataType: 'Data Type Check',
      operation: 'Operation Check',
      recipient: 'Recipient Check',
      retention: 'Retention Check'
    };

    return (
      <div key={key} className="condition-check">
        <strong>{labels[key] || key}:</strong>
        <span className={value.match || value.valid || value.compliant ? 'check-pass' : 'check-fail'}>
          {value.match !== undefined ? (value.match ? '✓ Pass' : '✗ Fail') : 
           value.valid !== undefined ? (value.valid ? '✓ Valid' : '✗ Expired') :
           value.compliant !== undefined ? (value.compliant ? '✓ Compliant' : '✗ Exceeds Limit') : ''}
        </span>
        {value.reason && <span className="condition-reason">{value.reason}</span>}
      </div>
    );
  };

  return (
    <div className="request-access-container">
      <h3>Request Access</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleRequest} className="access-request-form">
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
        
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Processing...' : 'Request Access'}
        </button>
      </form>

      {result && (
        <div className="decision-result">
          <div className="decision-header">
            <h4>Decision: 
              <span className={`decision-badge ${result.decision === 'GRANTED' ? 'granted' : 'denied'}`}>
                {result.decision}
              </span>
            </h4>
            {result.reason && <p className="decision-reason">Reason: {result.reason}</p>}
            {result.policyUsed && <p className="policy-version">Policy Version: {result.policyUsed}</p>}
          </div>

          {/* Detailed Explanation */}
          {result.explanation && result.explanation.length > 0 && (
            <div className="explanation-section">
              <h5>Decision Explanation:</h5>
              <ul className="explanation-list">
                {result.explanation.map((item, index) => (
                  <li key={index} className={item.startsWith('✓') ? 'explain-pass' : 'explain-fail'}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Condition Checks */}
          {result.checkedConditions && Object.keys(result.checkedConditions).length > 0 && (
            <div className="conditions-section">
              <h5>Detailed Policy Conditions:</h5>
              <div className="conditions-grid">
                {Object.entries(result.checkedConditions).map(([key, value]) => 
                  renderConditionCheck(key, value)
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RequestAccess;


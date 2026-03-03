import React, { useState } from 'react';
import API from '../services/api';

function RevokeConsent() {
  const [consentId, setConsentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleRevoke = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await API.post('/consent/revoke', { consentId });
      setMessage({ type: 'success', text: 'Consent revoked successfully!' });
      setConsentId('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Revoke failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Revoke Consent</h3>
      
      {message.text && (
        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleRevoke}>
        <div className="form-group">
          <label>Consent ID</label>
          <input 
            placeholder="Enter Consent ID to Revoke" 
            value={consentId}
            onChange={e => setConsentId(e.target.value)} 
            required
          />
        </div>
        
        <button type="submit" disabled={loading} style={{ background: '#dc3545' }}>
          {loading ? 'Revoking...' : 'Revoke Consent'}
        </button>
      </form>
    </div>
  );
}

export default RevokeConsent;


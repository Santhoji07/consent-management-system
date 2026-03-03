import React, { useState } from 'react';
import API from '../services/api';

function UpdateConsent() {
  const [consentId, setConsentId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [dataType, setDataType] = useState('');
  const [expiry, setExpiry] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await API.put('/consent/update', {
        consentId,
        purpose,
        dataType,
        expiry
      });
      setMessage({ type: 'success', text: 'Consent updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Update Consent</h3>
      
      {message.text && (
        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Consent ID</label>
          <input 
            placeholder="Enter Consent ID" 
            value={consentId}
            onChange={e => setConsentId(e.target.value)} 
            required
          />
        </div>
        
        <div className="form-group">
          <label>Purpose</label>
          <input 
            placeholder="New Purpose" 
            value={purpose}
            onChange={e => setPurpose(e.target.value)} 
          />
        </div>
        
        <div className="form-group">
          <label>Data Type</label>
          <input 
            placeholder="New Data Type" 
            value={dataType}
            onChange={e => setDataType(e.target.value)} 
          />
        </div>
        
        <div className="form-group">
          <label>Expiry Date</label>
          <input 
            type="date"
            value={expiry}
            onChange={e => setExpiry(e.target.value)} 
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Consent'}
        </button>
      </form>
    </div>
  );
}

export default UpdateConsent;


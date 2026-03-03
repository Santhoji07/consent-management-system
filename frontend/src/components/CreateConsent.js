import React, { useState } from 'react';
import API from '../services/api';

function CreateConsent() {
  const username = localStorage.getItem('username') || '';
  
  const [form, setForm] = useState({
    consentId: `CONSENT_${Date.now()}`,
    userId: username,
    orgId: '',
    purpose: '',
    dataType: '',
    expiry: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await API.post('/consent/create', form);
      setMessage({ type: 'success', text: 'Consent created successfully!' });
      // Reset form with new consent ID
      setForm({
        ...form,
        consentId: `CONSENT_${Date.now()}`,
        orgId: '',
        purpose: '',
        dataType: '',
        expiry: ''
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Error creating consent' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Create Consent</h3>
      
      {message.text && (
        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Consent ID</label>
          <input
            type="text"
            value={form.consentId}
            onChange={e => setForm({ ...form, consentId: e.target.value })}
            required
          />
        </div>
        
        <div className="form-group">
          <label>User ID</label>
          <input
            type="text"
            value={form.userId}
            onChange={e => setForm({ ...form, userId: e.target.value })}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Organization ID</label>
          <input
            type="text"
            value={form.orgId}
            onChange={e => setForm({ ...form, orgId: e.target.value })}
            placeholder="Enter ORG ID"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Purpose</label>
          <input
            type="text"
            value={form.purpose}
            onChange={e => setForm({ ...form, purpose: e.target.value })}
            placeholder="e.g., Medical Research"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Data Type</label>
          <input
            type="text"
            value={form.dataType}
            onChange={e => setForm({ ...form, dataType: e.target.value })}
            placeholder="e.g., Health Records"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="date"
            value={form.expiry}
            onChange={e => setForm({ ...form, expiry: e.target.value })}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Consent'}
        </button>
      </form>
    </div>
  );
}

export default CreateConsent;


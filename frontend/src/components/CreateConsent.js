import React, { useState } from 'react';
import API from '../services/api';

function CreateConsent() {

  const [form, setForm] = useState({
    consentId: '',
    userId: '',
    orgId: '',
    purpose: '',
    dataType: '',
    expiry: ''
  });

  const handleSubmit = async () => {
    try {
      const res = await API.post('/consent/create', form);
      alert('Consent Created');
    } catch (err) {
      alert('Error creating consent');
    }
  };

  return (
    <div>
      <h3>Create Consent</h3>

      {Object.keys(form).map(key => (
        <input
          key={key}
          placeholder={key}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
        />
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CreateConsent;
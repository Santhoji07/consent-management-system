import React, { useState } from 'react';
import API from '../services/api';

function UpdateConsent() {

  const [consentId, setConsentId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [dataType, setDataType] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleUpdate = async () => {
    try {
      await API.put('/consent/update', {
        consentId,
        purpose,
        dataType,
        expiry
      });

      alert('Consent Updated');
    } catch (err) {
      alert('Update Failed');
    }
  };

  return (
    <div>
      <h3>Update Consent</h3>
      <input placeholder="Consent ID" onChange={e => setConsentId(e.target.value)} />
      <input placeholder="Purpose" onChange={e => setPurpose(e.target.value)} />
      <input placeholder="Data Type" onChange={e => setDataType(e.target.value)} />
      <input placeholder="Expiry" onChange={e => setExpiry(e.target.value)} />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}

export default UpdateConsent;
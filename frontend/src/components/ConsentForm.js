import React, { useState } from "react";

function ConsentForm() {
  const [form, setForm] = useState({
    consentId: "",
    userId: "",
    orgId: "",
    purpose: "",
    dataType: "",
    expiry: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createConsent = async () => {
    const response = await fetch("http://localhost:3000/consent/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const result = await response.json();
    alert(JSON.stringify(result));
  };

  return (
    <div className="section">
      <h2>Create Consent</h2>

      <input name="consentId" placeholder="Consent ID" onChange={handleChange} />
      <input name="userId" placeholder="User ID" onChange={handleChange} />
      <input name="orgId" placeholder="Org ID" onChange={handleChange} />
      <input name="purpose" placeholder="Purpose" onChange={handleChange} />
      <input name="dataType" placeholder="Data Type" onChange={handleChange} />
      <input name="expiry" placeholder="Expiry (YYYY-MM-DD)" onChange={handleChange} />

      <button onClick={createConsent}>Create</button>
    </div>
  );
}

export default ConsentForm;
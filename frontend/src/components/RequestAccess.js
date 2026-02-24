import React, { useState } from "react";

function RequestAccess() {
  const [form, setForm] = useState({
    logId: "",
    consentId: "",
    orgId: "",
    purpose: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const requestAccess = async () => {
    const response = await fetch("http://localhost:3000/consent/request-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="section">
      <h2>Request Access</h2>

      <input name="logId" placeholder="Log ID" onChange={handleChange} />
      <input name="consentId" placeholder="Consent ID" onChange={handleChange} />
      <input name="orgId" placeholder="Org ID" onChange={handleChange} />
      <input name="purpose" placeholder="Purpose" onChange={handleChange} />

      <button onClick={requestAccess}>Request</button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default RequestAccess;
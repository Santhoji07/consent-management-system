import React, { useState } from "react";
import API from "../api/axiosConfig";

function UserDashboard() {

  const [form, setForm] = useState({
    consentId: "",
    userId: "",
    orgId: "",
    purpose: "",
    dataType: "",
    expiry: ""
  });

  const createConsent = async () => {
    try {
      const res = await API.post("/consent/create", form);
      alert("Consent Created");
      console.log(res.data);
    } catch (err) {
      alert("Error creating consent");
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>

      <h3>Create Consent</h3>

      <input placeholder="Consent ID" onChange={e => setForm({...form, consentId: e.target.value})} />
      <input placeholder="User ID" onChange={e => setForm({...form, userId: e.target.value})} />
      <input placeholder="Org ID" onChange={e => setForm({...form, orgId: e.target.value})} />
      <input placeholder="Purpose" onChange={e => setForm({...form, purpose: e.target.value})} />
      <input placeholder="Data Type" onChange={e => setForm({...form, dataType: e.target.value})} />
      <input placeholder="Expiry (YYYY-MM-DD)" onChange={e => setForm({...form, expiry: e.target.value})} />

      <button onClick={createConsent}>Submit</button>
    </div>
  );
}

export default UserDashboard;
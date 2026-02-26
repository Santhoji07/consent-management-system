import React, { useState } from "react";
import API from "../api/axiosConfig";

function OrgDashboard() {

  const [data, setData] = useState({
    consentId: "",
    orgId: "",
    purpose: ""
  });

  const requestAccess = async () => {
    try {
      const res = await API.post("/consent/request-access", data);
      alert(`Decision: ${res.data.decision}`);
    } catch (err) {
      alert("Access request failed");
    }
  };

  return (
    <div>
      <h2>Organization Dashboard</h2>

      <input placeholder="Consent ID" onChange={e => setData({...data, consentId: e.target.value})} />
      <input placeholder="Org ID" onChange={e => setData({...data, orgId: e.target.value})} />
      <input placeholder="Purpose" onChange={e => setData({...data, purpose: e.target.value})} />

      <button onClick={requestAccess}>Request Access</button>
    </div>
  );
}

export default OrgDashboard;
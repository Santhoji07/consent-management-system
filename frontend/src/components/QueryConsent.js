import React, { useState } from "react";

function QueryConsent() {
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);

  const queryConsent = async () => {
    const response = await fetch(`http://localhost:3000/consent/${id}`);
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="section">
      <h2>View Consent</h2>

      <input placeholder="Consent ID" onChange={(e) => setId(e.target.value)} />
      <button onClick={queryConsent}>View</button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default QueryConsent;
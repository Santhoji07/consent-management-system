import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";

function AdminDashboard() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await API.get("/consent/enforcements");
      setLogs(res.data);
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Enforcement Logs</h3>

      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            {log.consentId} | {log.orgId} | {log.decision}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
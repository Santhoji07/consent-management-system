import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "USER") navigate("/user");
      if (res.data.role === "ORG") navigate("/org");
      if (res.data.role === "ADMIN") navigate("/admin");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Consent Management Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {

  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'USER'
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post('/auth/register', form);

      alert('Registration successful! Please login.');
      navigate('/');

    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="Username"
        onChange={e => setForm({ ...form, username: e.target.value })}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <select
        onChange={e => setForm({ ...form, role: e.target.value })}
      >
        <option value="USER">USER</option>
        <option value="ORG">ORG</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      <button onClick={handleRegister}>Register</button>

      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import OrgDashboard from './pages/OrgDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {

  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {role === 'USER' && (
          <Route path="/dashboard" element={<UserDashboard />} />
        )}

        {role === 'ORG' && (
          <Route path="/dashboard" element={<OrgDashboard />} />
        )}

        {role === 'ADMIN' && (
          <Route path="/dashboard" element={<AdminDashboard />} />
        )}

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
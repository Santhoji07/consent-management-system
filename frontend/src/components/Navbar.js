import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Only show navbar when logged in
  if (!token) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Consent Management System</h2>
      </div>
      
      <div className="navbar-links">
        {role === 'USER' && (
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            My Consents
          </Link>
        )}
        
        {role === 'ORG' && (
          <Link to="/org-dashboard" className={location.pathname === '/org-dashboard' ? 'active' : ''}>
            Organization Dashboard
          </Link>
        )}
        
        {role === 'ADMIN' && (
          <Link to="/admin-dashboard" className={location.pathname === '/admin-dashboard' ? 'active' : ''}>
            Admin Dashboard
          </Link>
        )}
      </div>

      <div className="navbar-user">
        <span className="username">
          {username || role}
        </span>
        <span className="role-badge">{role}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;


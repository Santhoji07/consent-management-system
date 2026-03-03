import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Check if user is logged in
  if (!token || !userRole) {
    return <Navigate to="/" />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'USER') {
      return <Navigate to="/dashboard" />;
    } else if (userRole === 'ORG') {
      return <Navigate to="/org-dashboard" />;
    } else if (userRole === 'ADMIN') {
      return <Navigate to="/admin-dashboard" />;
    }
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;

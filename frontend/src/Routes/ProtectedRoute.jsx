import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Still checking auth (on app load / refresh)
  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="loading-animation">
          <div className="fashion-spinner large"></div>
          <div className="loading-text">
            <h3>ATHIX WEAR</h3>
            <p>Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="unauthorized-page">
        <div className="unauthorized-content">
          <h2>🔒 Access Restricted</h2>
          <p>Administrator privileges required to access this page.</p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

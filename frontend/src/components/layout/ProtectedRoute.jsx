import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuth } from "../../services/authService";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState({
    authenticated: false,
    role: null,
  });

  const location = useLocation();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const data = await checkAuth();

        setAuth({
          authenticated: true,
          role: data.role,
        });
      } catch (error) {
        setAuth({
          authenticated: false,
          role: null,
        });
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="fashion-spinner large"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!auth.authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && auth.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

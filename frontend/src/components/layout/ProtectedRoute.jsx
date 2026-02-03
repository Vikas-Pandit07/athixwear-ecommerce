import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState({
    authenticated: false,
    isAdmin: false,
  });
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:9090/api/user/check-role",
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (response.ok && data.authenticated) {
          setAuthStatus({
            authenticated: true,
            isAdmin: data.isAdmin || false,
          });
        } else {
          setAuthStatus({
            authenticated: false,
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthStatus({
          authenticated: false,
          isAdmin: false,
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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

  if (!authStatus.authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !authStatus.isAdmin) {
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

// ProtectedRoute.js - Update to handle admin routes
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:9090/api/user/check-role", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        
        if (response.ok && data.authenticated) {
          setAuthData(data);
          
          // Check if admin role is required but user is not admin
          if (requireAdmin && !data.isAdmin) {
            setAuthData({ ...data, authorized: false });
          } else {
            setAuthData({ ...data, authorized: true });
          }
        } else {
          setAuthData({ authenticated: false, authorized: false });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthData({ authenticated: false, authorized: false });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requireAdmin]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="fashion-spinner"></div>
        <p>Checking authorization...</p>
      </div>
    );
  }

  if (!authData?.authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !authData?.authorized) {
    return (
      <div className="unauthorized">
        <h2>Access Denied</h2>
        <p>Admin privileges required to access this page.</p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

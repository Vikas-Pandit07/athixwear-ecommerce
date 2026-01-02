import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:9090/api/auth/verify", {
          method: "GET",
          credentials: "include", // IMPORTANT: Sends cookies
        });

        const data = await response.json();
        
        if (response.ok && data.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="fashion-spinner"></div>
        <p style={{ color: "#D4AF37", marginTop: "20px" }}>Verifying authentication...</p>
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
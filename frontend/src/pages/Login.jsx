import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/auth.css";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:9090/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/dashboard", {replace: true});
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Server not reachable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split-left">
        <div className="brand-promo-v2">
          <div className="logo-animation">
            {/* <img src="\assist\logo3.jpg" alt="Athix Logo" className="logo-img" /> */}
          </div>
          <div className="brand-statement">
            <div className="auth-logo">ATHIXWEAR</div>
            <p className="luxury-subtitle">Elegance for the Grinders.</p>
          </div>
        </div>
      </div>

      <div className="auth-split-right">
        <div className="form-wrapper">
          {loading && (
            <div className="loading-overlay">
              <div className="fashion-spinner"></div>
            </div>
          )}
          <div className="brand-identity">
            <h2>Welcome Back</h2>
            <p className="brand-subtitle">Sign in to continue your journey</p>
          </div>
          <form onSubmit={handleSubmit} className="fashion-form">
            {error && (
              <div className="error-toast">
                <span className="error-icon">!</span>
                {error}
              </div>
            )}

            <div className="floating-group">
              <input
                type="text"
                className="f-input"
                placeholder=" "
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
                disabled={loading}
              />
              <label className="f-label">Username or Email</label>
            </div>

            <div className="floating-group">
              <input
                type="password"
                className="f-input"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <label className="f-label">Password</label>
            </div>

            <div className="form-options">
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-luxury" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  LOGGING IN...
                </>
              ) : (
                "LOGIN"
              )}
            </button>
            
            <p className="footer-link">
              New User? <Link to="/register">Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
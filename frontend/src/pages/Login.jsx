import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AthixLogo from "../components/AthixLogo";
import "../assets/Auth.css";

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
        credentials: "include", // IMPORTANT: For cookies
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        navigate("/dashboard", {replace: true});
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server not reachable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split-left">
        <div className="brand-promo-v2">
          <img src="/assets/logo10.png" alt="Athix Logo" />
          <div className="brand-statement">
            <AthixLogo color="#D4AF37" width="300" />
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
          </div>
          <form onSubmit={handleSubmit} className="fashion-form">
            {error && (
              <div className="error-toast">
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
              />
              <label className="f-label">Password</label>
            
            </div>
            <p className="footer-link" style={{ marginTop: '10px' }}>
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
            <button type="submit" className="btn-luxury" disabled={loading}>
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>

            <div className="social-divider">
              <span>OR CONTINUE WITH</span>
            </div>
            <div className="social-buttons">
              <button type="button" className="btn-social">
                GOOGLE
              </button>
              <button type="button" className="btn-social">
                APPLE
              </button>
            </div>
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
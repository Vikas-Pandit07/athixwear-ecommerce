import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/auth.css";
import { loginUser } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
       await loginUser({ usernameOrEmail, password});
       await refreshAuth();
       navigate("/dashboard", { replace: true });
    } catch (err) {
       setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split-left">
        <div className="brand-promo-v2">
          <div className="logo-animation">
            <img src={logoSrc} alt="AthixWear Logo" className="auth-logo-img" />
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

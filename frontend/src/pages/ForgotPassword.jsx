import React, { useState } from "react";
import { Link } from "react-router-dom";
import AthixLogo from "../components/AthixLogo";
import "../assets/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:9090/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password reset email sent!');
        setEmail("");
      } else {
        setError(data.error || "Failed to send reset link");
      }
    } catch (err) {
      setError("Server error. Please try again.");
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
            <p className="luxury-subtitle">Reset Your Password</p>
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
            <h2>Forgot Password</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="fashion-form">
            {error && <div className="error-toast">{error}</div>}
            {message && (
              <div className="success-toast">
                {message}
              </div>
            )}
            
            <div className="floating-group">
              <input
                type="email"
                className="f-input"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="f-label">Email Address</label>
            </div>

            <button type="submit" className="btn-luxury" disabled={loading}>
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>
 

            <p className="footer-link">
              Remember your password? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import "../../assets/css/auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await forgotPassword(email);
      setEmailSent(true);
    } catch (err) {
      setError(err?.error || "Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT BRAND PANEL */}
      <div className="auth-left">
        <div className="auth-brand">
          <img src={logoSrc} alt="AthixWear Logo" className="auth-logo-img" />
          <div className="auth-logo">ATHIXWEAR</div>
          <p className="auth-tagline">Secure Account Recovery</p>
          <p className="auth-description">
            Enter your registered email and we’ll help you reset your password
            securely.
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          {!emailSent ? (
            <>
              <h2 className="auth-title">Forgot Password</h2>

              {error && <div className="error-msg">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="auth-link">
                  Remember your password? <Link to="/login">Sign In</Link>
                </div>
              </form>
            </>
          ) : (
            <div className="email-sent-message">
              <div className="success-icon">✓</div>
              <h3>Email Sent</h3>
              <p>
                A password reset link has been sent to <strong>{email}</strong>
              </p>
              <p className="email-note">
                The link will expire in 24 hours. Please check your spam folder
                if you don’t see it.
              </p>

              <div className="resend-options">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEmail("");
                    setEmailSent(false);
                  }}
                >
                  Try Another Email
                </button>

                <Link to="/login" className="btn btn-primary">
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import "../../assets/css/auth.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const logoSrc = `${import.meta.env.BASE_URL}assist/logo10.png`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await resetPassword({ token, newPassword, confirmPassword });

      setSuccess(true);

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err?.error || "Reset link is invalid or expired. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <img src={logoSrc} alt="AthixWear Logo" className="auth-logo-img" />
          <div className="auth-logo">ATHIXWEAR</div>
          <p className="auth-tagline">Set New Password</p>
          <p className="auth-description">
            Create a strong new password for your account.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          {!success ? (
            <>
              <h2 className="auth-title">RESET PASSWORD</h2>
              

              {error && <div className="error-msg">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="form-input"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !newPassword || !confirmPassword}
                >
                  {loading ? (
                    <>
                      <span className="spinner spinner-small"></span>
                      RESETTING...
                    </>
                  ) : (
                    "RESET PASSWORD"
                  )}
                </button>

                <div className="auth-link">
                  Remember your password? <Link to="/login">Sign In</Link>
                </div>
              </form>
            </>
          ) : (
            <div className="success-box">
              <div className="success-icon">✓</div>
              <h3>Password Reset Successful</h3>
              <p>You will be redirected to login shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

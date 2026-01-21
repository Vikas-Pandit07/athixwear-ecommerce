// pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../assets/css/auth.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:9090/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password reset successful!' });
        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reset password' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // If no token in URL
  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-logo">ATHIXWEAR</div>
            <p className="auth-tagline">Invalid Reset Link</p>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <h2 className="auth-title">INVALID LINK</h2>
            <div className="message message-error">
              This password reset link is invalid or has expired.
            </div>
            <div className="reset-options">
              <p>Please request a new password reset link:</p>
              <Link to="/forgot-password" className="btn btn-primary">
                Request New Link
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-brand">
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
          <h2 className="auth-title">RESET PASSWORD</h2>
          
          {message.text && (
            <div className={`message message-${message.type}`}>
              {message.text}
            </div>
          )}

          {!success ? (
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
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <small className="password-hint">
                  Must be at least 8 characters with uppercase, lowercase, number, and special character
                </small>
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="password-strength">
                <div className={`strength-bar ${formData.newPassword.length >= 8 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${/[A-Z]/.test(formData.newPassword) ? 'active' : ''}`}></div>
                <div className={`strength-bar ${/[0-9]/.test(formData.newPassword) ? 'active' : ''}`}></div>
                <div className={`strength-bar ${/[@$!%*?&]/.test(formData.newPassword) ? 'active' : ''}`}></div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !formData.newPassword || !formData.confirmPassword}
              >
                {loading ? (
                  <>
                    <span className="spinner spinner-small"></span>
                    RESETTING...
                  </>
                ) : (
                  'RESET PASSWORD'
                )}
              </button>

              <div className="auth-link">
                Remember your password? <Link to="/login">Sign In</Link>
              </div>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Password Reset Successful!</h3>
              <p>Your password has been successfully updated.</p>
              <p className="redirect-note">
                You will be redirected to the login page in a few seconds...
              </p>
              <Link to="/login" className="btn btn-primary">
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
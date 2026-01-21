// pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:9090/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' });
        setEmailSent(true);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send reset email' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">ATHIXWEAR</div>
          <p className="auth-tagline">Reset Your Password</p>
          <p className="auth-description">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">FORGOT PASSWORD</h2>
          
          {message.text && (
            <div className={`message message-${message.type}`}>
              {message.text}
            </div>
          )}

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <span className="spinner spinner-small"></span>
                    SENDING...
                  </>
                ) : (
                  'SEND RESET LINK'
                )}
              </button>

              <div className="auth-link">
                Remember your password? <Link to="/login">Sign In</Link>
              </div>
            </form>
          ) : (
            <div className="email-sent-message">
              <div className="success-icon">✓</div>
              <h3>Check Your Email</h3>
              <p>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="email-note">
                The link will expire in 24 hours. If you don't see the email, check your spam folder.
              </p>
              <div className="resend-options">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEmailSent(false)}
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
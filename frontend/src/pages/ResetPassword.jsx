// ResetPassword.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AthixLogo from '../components/AthixLogo';
import '../assets/Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid or missing reset token');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9090/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: token,
          newPassword: password,
          confirmPassword: confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Password reset failed');
      }
    } catch (err) {
      setError('Server not reachable');
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
            <p className="luxury-subtitle">Create a new password.</p>
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
            <h2>Reset Password</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="fashion-form">
            {error && <div className="error-toast">{error}</div>}
            {success && <div className="success-toast">{success}</div>}
            
            {!token ? (
              <div className="token-error">
                <p>Invalid reset link. Please request a new password reset.</p>
                <Link to="/forgot-password" className="btn-luxury" style={{ marginTop: '20px' }}>
                  Request New Reset Link
                </Link>
              </div>
            ) : (
              <>
                <div className="floating-group">
                  <input
                    type="password"
                    className="f-input"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="8"
                  />
                  <label className="f-label">New Password</label>
                  
                </div>

                <div className="floating-group">
                  <input
                    type="password"
                    className="f-input"
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <label className="f-label">Confirm New Password</label>
                </div>

                <button type="submit" className="btn-luxury" disabled={loading}>
                  {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                </button>
              </>
            )}

            <p className="footer-link">
              <Link to="/login">Back to Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/auth.css";
import { registerUser } from "../../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setErrors({ server: err.message || "Registration failed" });
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
            <p className="luxury-subtitle">Exclusivity starts here.</p>
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
            <h2>Create Account</h2>
            <p className="brand-subtitle">Join our exclusive community</p>
          </div>

          <form onSubmit={handleSubmit} className="fashion-form">
            {errors.server && (
              <div className="error-toast">
                <span className="error-icon">!</span>
                {errors.server}
              </div>
            )}

            <div className="floating-group">
              <input
                type="text"
                name="username"
                className={`f-input ${errors.username ? "error" : ""}`}
                placeholder=" "
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <label className="f-label">Username</label>
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>

            <div className="floating-group">
              <input
                type="email"
                name="email"
                className={`f-input ${errors.email ? "error" : ""}`}
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <label className="f-label">Email Address</label>
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="floating-group">
              <input
                type="password"
                name="password"
                className={`f-input ${errors.password ? "error" : ""}`}
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <label className="f-label">Password</label>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="floating-group">
              <input
                type="password"
                className={`f-input ${errors.confirmPassword ? "error" : ""}`}
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }
                }}
                required
                disabled={loading}
              />
              <label className="f-label">Confirm Password</label>
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn-luxury" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  CREATING ACCOUNT...
                </>
              ) : (
                "REGISTER"
              )}
            </button>

            <p className="footer-link">
              Already a member? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

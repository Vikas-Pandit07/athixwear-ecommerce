import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AthixLogo from "../components/AthixLogo";
import "../assets/Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "" 
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    // Password validation
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:9090/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuccess(`Account created successfully! Welcome ${data.username}`);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Server connection error. Please try again later.");
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
          </div>

          <form onSubmit={handleSubmit} className="fashion-form">
            {error && <div className="error-toast">{error}</div>}
            {success && <div className="success-toast">{success}</div>}
            
            <div className="floating-group">
              <input 
                type="text" 
                name="username" 
                className="f-input" 
                placeholder=" "
                value={formData.username}
                onChange={handleChange} 
                required 
                minLength="3"
                maxLength="30"
              />
              <label className="f-label">Username</label>
            </div>

            <div className="floating-group">
              <input 
                type="email" 
                name="email" 
                className="f-input" 
                placeholder=" "
                value={formData.email}
                onChange={handleChange} 
                required 
              />
              <label className="f-label">Email Address</label>
            </div>

            <div className="floating-group">
              <input 
                type="password" 
                name="password" 
                className="f-input" 
                placeholder=" "
                value={formData.password}
                onChange={handleChange} 
                required 
                minLength="8"
              />
              <label className="f-label">Password</label>
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
              <label className="f-label">Confirm Password</label>
            </div>

            <button type="submit" className="btn-luxury" disabled={loading}>
              {loading ? "CREATING ACCOUNT..." : "REGISTER"}
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
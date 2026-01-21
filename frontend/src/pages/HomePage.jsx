// pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/globals.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              ELEVATE YOUR STYLE WITH
              <span className="hero-highlight"> ATHIXWEAR</span>
            </h1>
            <p className="hero-subtitle">
              Premium streetwear for the modern hustler. Quality meets style in every thread.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                SHOP NOW
              </Link>
              <Link to="/register" className="btn btn-secondary">
                JOIN THE MOVEMENT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="container">
          <h2 className="section-title">WHY CHOOSE ATHIXWEAR</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Premium Quality</h3>
              <p>Premium fabrics and expert craftsmanship for unmatched durability.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Free shipping on orders above ₹1000. Express delivery available.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy. No questions asked.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>100% secure payments with multiple options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>READY TO ELEVATE YOUR WARDROBE?</h2>
            <p>Join thousands of satisfied customers who trust AthixWear for premium streetwear.</p>
            <Link to="/register" className="btn btn-primary">
              CREATE FREE ACCOUNT
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
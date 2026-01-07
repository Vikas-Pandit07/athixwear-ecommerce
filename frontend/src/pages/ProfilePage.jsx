// ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Profile.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9090/api/user/profile', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfileForm({
          username: data.username,
          email: data.email
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to load profile' });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setMessage({ type: 'error', text: 'Error loading profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('http://localhost:9090/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        
        // If token was regenerated, refresh the page to get new token
        if (data.tokenRegenerated) {
          // Wait 2 seconds then refresh
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          // Just refresh profile data if username didn't change
          fetchProfile();
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: 'Error updating profile' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    try {
      const response = await fetch('http://localhost:9090/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwordForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        // Clear password form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setMessage({ type: 'error', text: 'Error changing password' });
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="fashion-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>MY PROFILE</h1>
        <p className="profile-subtitle">Manage your account settings</p>
      </div>

      {message.text && (
        <div className={`profile-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-container">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <button 
            className={`sidebar-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span>👤</span>
            Profile Information
          </button>
          
          <button 
            className={`sidebar-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <span>🔒</span>
            Change Password
          </button>
          
          <button 
            className={`sidebar-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span>📦</span>
            Order History
          </button>
          
          <button 
            className={`sidebar-tab ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <span>🏠</span>
            Addresses
          </button>
          
          <div className="profile-summary">
            <div className="summary-avatar">
              {profile?.username?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="summary-info">
              <h3>{profile?.username}</h3>
              <p>{profile?.email}</p>
              <span className="member-badge">{profile?.role}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Profile Information</h2>
              <p className="tab-description">Update your personal information</p>
              
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                    required
                    minLength="3"
                    maxLength="30"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Account Type</label>
                  <input
                    type="text"
                    value={profile?.role || 'CUSTOMER'}
                    disabled
                    className="disabled-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Member Since</label>
                  <input
                    type="text"
                    value={profile?.joinDate || '2024'}
                    disabled
                    className="disabled-input"
                  />
                </div>
                
                <button type="submit" className="btn-luxury">
                  SAVE CHANGES
                </button>
              </form>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div className="tab-content">
              <h2>Change Password</h2>
              <p className="tab-description">Update your password for enhanced security</p>
              
              <form onSubmit={handlePasswordChange} className="profile-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    required
                    minLength="8"
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    required
                    minLength="8"
                  />
                  <small>Must be at least 8 characters with uppercase, lowercase, number, and special character</small>
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    required
                    minLength="8"
                  />
                </div>
                
                <button type="submit" className="btn-luxury">
                  UPDATE PASSWORD
                </button>
              </form>
            </div>
          )}

          {/* Order History Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <h2>Order History</h2>
              <p className="tab-description">View your past purchases</p>
              
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders. Start shopping to see your order history here.</p>
                <button 
                  className="btn-luxury"
                  onClick={() => navigate('/dashboard')}
                >
                  START SHOPPING
                </button>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="tab-content">
              <h2>Shipping Addresses</h2>
              <p className="tab-description">Manage your delivery addresses</p>
              
              <div className="empty-state">
                <div className="empty-icon">🏠</div>
                <h3>No Addresses Saved</h3>
                <p>Add your shipping addresses for faster checkout.</p>
                <button className="btn-luxury">
                  ADD NEW ADDRESS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
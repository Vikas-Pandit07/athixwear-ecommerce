<<<<<<< HEAD
// Profile.jsx - Complete Updated Version
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/profile.css";
import AddressesSection from "../components/ui/AddressSection";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:9090/api/user/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfileForm({
          username: data.username,
          email: data.email,
        });
      } else {
        setMessage({ type: "error", text: "Failed to load profile" });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMessage({ type: "error", text: "Error loading profile" });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch("http://localhost:9090/api/orders", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:9090/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });

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
        setMessage({
          type: "error",
          text: data.error || "Failed to update profile",
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({ type: "error", text: "Error updating profile" });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9090/api/user/change-password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(passwordForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        // Clear password form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to change password",
        });
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setMessage({ type: "error", text: "Error changing password" });
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    
    try {
      const response = await fetch("http://localhost:9090/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Logged out successfully" });
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      } else {
        setMessage({ type: "error", text: "Logout failed" });
      }
    } catch (err) {
      console.error("Logout error:", err);
      setMessage({ type: "error", text: "Error logging out" });
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
        <div className={`profile-message ${message.type}`}>{message.text}</div>
      )}

      <div className="profile-container">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <button
            className={`sidebar-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span>👤</span>
            Profile Information
          </button>

          <button
            className={`sidebar-tab ${
              activeTab === "password" ? "active" : ""
            }`}
            onClick={() => setActiveTab("password")}
          >
            <span>🔒</span>
            Change Password
          </button>

          <button
            className={`sidebar-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <span>📦</span>
            Order History
          </button>

          <button
            className={`sidebar-tab ${
              activeTab === "addresses" ? "active" : ""
            }`}
            onClick={() => setActiveTab("addresses")}
          >
            <span>🏠</span>
            Addresses
          </button>

          {/* Logout Button in Sidebar */}
          <button
            className="sidebar-tab logout-tab"
            onClick={handleLogout}
          >
            <span>↪️</span>
            Logout
          </button>

          <div className="profile-summary">
            <div className="summary-avatar">
              {profile?.username?.substring(0, 2).toUpperCase() || "U"}
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
          {activeTab === "profile" && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Profile Information</h2>
                <p className="tab-description">
                  Update your personal information
                </p>
              </div>

              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        username: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Account Type</label>
                  <input
                    type="text"
                    value={profile?.role || "CUSTOMER"}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group">
                  <label>Member Since</label>
                  <input
                    type="text"
                    value={profile?.joinDate || "2024"}
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
          {activeTab === "password" && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Change Password</h2>
                <p className="tab-description">
                  Update your password for enhanced security
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="profile-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    minLength="8"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    minLength="8"
                  />
                  <small>
                    Must be at least 8 characters with uppercase, lowercase,
                    number, and special character
                  </small>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
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
          {activeTab === "orders" && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Order History</h2>
                <p className="tab-description">View your past purchases</p>
              </div>

              {ordersLoading ? (
                <div className="loading-orders">
                  <div className="fashion-spinner small"></div>
                  <p>Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.orderId} className="order-card">
                      <div className="order-header">
                        <div>
                          <h4>Order #{order.orderId}</h4>
                          <p className="order-date">
                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className={`status ${order.orderStatus?.toLowerCase()}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="order-details">
                        <div className="detail-row">
                          <span>Total Amount:</span>
                          <span className="order-total">
                            ₹{order.totalAmount?.toFixed(2)}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span>Payment Status:</span>
                          <span className={`payment-status ${order.paymentStatus?.toLowerCase()}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="view-order-btn"
                        onClick={() => navigate(`/orders/${order.orderId}`)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No Orders Yet</h3>
                  <p>
                    You haven't placed any orders. Start shopping to see your
                    order history here.
                  </p>
                  <button
                    className="btn-luxury"
                    onClick={() => navigate("/dashboard")}
                  >
                    START SHOPPING
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Shipping Addresses</h2>
                <p className="tab-description">Manage your delivery addresses</p>
              </div>

               <AddressesSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
=======
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/profile.css";
import AddressesSection from "../components/ui/AddressSection";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:9090/api/user/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfileForm({
          username: data.username,
          email: data.email,
        });
      } else {
        setMessage({ type: "error", text: "Failed to load profile" });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMessage({ type: "error", text: "Error loading profile" });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch("http://localhost:9090/api/orders", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:9090/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });

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
        setMessage({
          type: "error",
          text: data.error || "Failed to update profile",
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({ type: "error", text: "Error updating profile" });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9090/api/user/change-password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(passwordForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        // Clear password form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to change password",
        });
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setMessage({ type: "error", text: "Error changing password" });
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    
    try {
      const response = await fetch("http://localhost:9090/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Logged out successfully" });
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      } else {
        setMessage({ type: "error", text: "Logout failed" });
      }
    } catch (err) {
      console.error("Logout error:", err);
      setMessage({ type: "error", text: "Error logging out" });
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
        <div className={`profile-message ${message.type}`}>{message.text}</div>
      )}

      <div className="profile-container">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <button
            className={`sidebar-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span>👤</span>
            Profile Information
          </button>

          <button
            className={`sidebar-tab ${
              activeTab === "password" ? "active" : ""
            }`}
            onClick={() => setActiveTab("password")}
          >
            <span>🔒</span>
            Change Password
          </button>

          <button
            className={`sidebar-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <span>📦</span>
            Order History
          </button>

          <button
            className={`sidebar-tab ${
              activeTab === "addresses" ? "active" : ""
            }`}
            onClick={() => setActiveTab("addresses")}
          >
            <span>🏠</span>
            Addresses
          </button>

          {/* Logout Button in Sidebar */}
          <button
            className="sidebar-tab logout-tab"
            onClick={handleLogout}
          >
            <span>↪️</span>
            Logout
          </button>

          <div className="profile-summary">
            <div className="summary-avatar">
              {profile?.username?.substring(0, 2).toUpperCase() || "U"}
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
          {activeTab === "profile" && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Profile Information</h2>
                <p className="tab-description">
                  Update your personal information
                </p>
              </div>

              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        username: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Account Type</label>
                  <input
                    type="text"
                    value={profile?.role || "CUSTOMER"}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group">
                  <label>Member Since</label>
                  <input
                    type="text"
                    value={profile?.joinDate || "2024"}
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
          {activeTab === "password" && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Change Password</h2>
                <p className="tab-description">
                  Update your password for enhanced security
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="profile-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    minLength="8"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    minLength="8"
                  />
                  <small>
                    Must be at least 8 characters with uppercase, lowercase,
                    number, and special character
                  </small>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
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
          {activeTab === "orders" && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Order History</h2>
                <p className="tab-description">View your past purchases</p>
              </div>

              {ordersLoading ? (
                <div className="loading-orders">
                  <div className="fashion-spinner small"></div>
                  <p>Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.orderId} className="order-card">
                      <div className="order-header">
                        <div>
                          <h4>Order #{order.orderId}</h4>
                          <p className="order-date">
                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className={`status ${order.orderStatus?.toLowerCase()}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="order-details">
                        <div className="detail-row">
                          <span>Total Amount:</span>
                          <span className="order-total">
                            ₹{order.totalAmount?.toFixed(2)}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span>Payment Status:</span>
                          <span className={`payment-status ${order.paymentStatus?.toLowerCase()}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="view-order-btn"
                        onClick={() => navigate(`/orders/${order.orderId}`)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No Orders Yet</h3>
                  <p>
                    You haven't placed any orders. Start shopping to see your
                    order history here.
                  </p>
                  <button
                    className="btn-luxury"
                    onClick={() => navigate("/dashboard")}
                  >
                    START SHOPPING
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Shipping Addresses</h2>
                <p className="tab-description">Manage your delivery addresses</p>
              </div>

               <AddressesSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
>>>>>>> b04245a95cc194701d9aa0c1fa5fd9f17998d0a7

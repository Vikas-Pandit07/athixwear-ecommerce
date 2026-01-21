<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9090/api/admin/stats', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 403) {
        setError('Access denied. Admin privileges required.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Failed to load admin dashboard');
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="fashion-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>Access Restricted</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-luxury">
          Go to User Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>ADMIN DASHBOARD</h1>
        <p className="admin-subtitle">Manage your e-commerce platform</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats?.totalOrders || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending Orders</h3>
            <p className="stat-value">{stats?.pendingOrders || 0}</p>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="admin-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="admin-btn">
              <span>📊</span>
              <span>View Analytics</span>
            </button>
            <button className="admin-btn">
              <span>🛍️</span>
              <span>Manage Products</span>
            </button>
            <button className="admin-btn">
              <span>📋</span>
              <span>View Orders</span>
            </button>
            <button className="admin-btn">
              <span>👤</span>
              <span>Manage Users</span>
            </button>
          </div>
        </div>

        <div className="admin-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">🛒</span>
              <div className="activity-details">
                <p>New order #ORD-001 placed</p>
                <span className="activity-time">2 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-details">
                <p>New user registered: john_doe</p>
                <span className="activity-time">15 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📦</span>
              <div className="activity-details">
                <p>Product "Athix Hoodie" stock updated</p>
                <span className="activity-time">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9090/api/admin/stats', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 403) {
        setError('Access denied. Admin privileges required.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Failed to load admin dashboard');
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="fashion-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>Access Restricted</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-luxury">
          Go to User Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>ADMIN DASHBOARD</h1>
        <p className="admin-subtitle">Manage your e-commerce platform</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats?.totalOrders || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending Orders</h3>
            <p className="stat-value">{stats?.pendingOrders || 0}</p>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="admin-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="admin-btn">
              <span>📊</span>
              <span>View Analytics</span>
            </button>
            <button className="admin-btn">
              <span>🛍️</span>
              <span>Manage Products</span>
            </button>
            <button className="admin-btn">
              <span>📋</span>
              <span>View Orders</span>
            </button>
            <button className="admin-btn">
              <span>👤</span>
              <span>Manage Users</span>
            </button>
          </div>
        </div>

        <div className="admin-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">🛒</span>
              <div className="activity-details">
                <p>New order #ORD-001 placed</p>
                <span className="activity-time">2 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-details">
                <p>New user registered: john_doe</p>
                <span className="activity-time">15 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📦</span>
              <div className="activity-details">
                <p>Product "Athix Hoodie" stock updated</p>
                <span className="activity-time">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
>>>>>>> b04245a95cc194701d9aa0c1fa5fd9f17998d0a7

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/admin.css";
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshTime, setRefreshTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:9090/api/admin/stats", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      console.log("Admin stats response:", data); // Debug log

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `HTTP error! status: ${response.status}`,
        );
      }

      if (data.success) {
        setStats(data.stats);
        setRefreshTime(new Date());
        setError(""); // Clear any previous errors
      } else {
        throw new Error(data.message || data.error || "Failed to load stats");
      }
    } catch (err) {
      console.error("Error fetching admin stats:", err);

      // Different message for 403
      if (
        err.message.includes("admin privileges") ||
        err.message.includes("403") ||
        err.message.includes("Forbidden")
      ) {
        setError(
          "🔒 Admin Access Required: You need to be logged in as an administrator to view this page.",
        );
      } else if (
        err.message.includes("401") ||
        err.message.includes("Unauthorized")
      ) {
        setError("🔑 Session Expired: Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (
        err.message.includes("Network Error") ||
        err.message.includes("Failed to fetch")
      ) {
        setError(
          "🌐 Network Error: Unable to connect to the server. Please check your connection.",
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    if (!price) return "₹0";
    try {
      // Handle BigDecimal or number
      const priceNum = typeof price === "object" ? price.toString() : price;
      return `₹${parseFloat(priceNum).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } catch (e) {
      return "₹0";
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format time for last updated
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Get status color for badges
  const getStatusColor = (status) => {
    if (!status) return "status-default";

    switch (status.toUpperCase()) {
      case "PENDING":
        return "status-pending";
      case "CONFIRMED":
      case "PROCESSING":
      case "SHIPPED":
        return "status-processing";
      case "DELIVERED":
        return "status-delivered";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  // Get display status text
  const getDisplayStatus = (status) => {
    if (!status) return "Unknown";

    switch (status.toUpperCase()) {
      case "PENDING":
        return "Pending";
      case "CONFIRMED":
        return "Confirmed";
      case "SHIPPED":
        return "Shipped";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
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

  if (error && !stats) {
    return (
      <div className="admin-error">
        <h2>⚠️ Access Restricted</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button
            onClick={() => navigate("/login")}
            className="btn-luxury primary"
          >
            🔑 Login as Admin
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-luxury secondary"
          >
            👤 Go to User Dashboard
          </button>
          <button onClick={fetchAdminStats} className="btn-luxury outline">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Error banner if there's an error but we have stats */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError("")} className="close-error">
            ×
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="admin-header">
        <div className="header-content">
          <h1>📊 ADMIN DASHBOARD</h1>
          <p className="admin-subtitle">
            Real-time business insights and analytics
          </p>
          <div className="header-actions">
            <button
              className="refresh-btn"
              onClick={fetchAdminStats}
              title="Refresh data"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Refreshing...
                </>
              ) : (
                "🔄 Refresh Data"
              )}
            </button>
            <span className="last-updated">
              Updated: {formatTime(refreshTime)}
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button className="tab-btn" onClick={() => navigate("/admin/products")}>
          🛍️ Products ({stats?.totalProducts || 0})
        </button>
        <button className="tab-btn" onClick={() => navigate("/admin/orders")}>
          📦 Orders ({stats?.totalOrders || 0})
        </button>
        <button
          className="tab-btn"
          onClick={() => navigate("/admin/customers")}
        >
          👥 Customers ({stats?.totalCustomers || 0})
        </button>
        <button
          className="tab-btn"
          onClick={() => navigate("/admin/categories")}
        >
          📂 Categories ({stats?.totalCategories || 0})
        </button>
      </div>

      {/* STATS CARDS GRID */}
      <div className="stats-grid">
        {/* REVENUE CARD */}
        <div className="stat-card revenue">
          <div className="stat-header">
            <div className="stat-icon">💰</div>
            <h3>Total Revenue</h3>
          </div>
          <p className="stat-value">{formatPrice(stats?.totalRevenue)}</p>
          <div className="stat-footer">
            <span className="stat-trend positive">↑ 12.5%</span>
            <span className="stat-period">vs last month</span>
          </div>
        </div>

        {/* ORDERS CARD */}
        <div className="stat-card orders">
          <div className="stat-header">
            <div className="stat-icon">📦</div>
            <h3>Total Orders</h3>
          </div>
          <p className="stat-value">{stats?.totalOrders || 0}</p>
          <div className="stat-details">
            <div className="detail-row">
              <span className="status-dot delivered"></span>
              <span>Delivered: {stats?.deliveredOrders || 0}</span>
            </div>
            <div className="detail-row">
              <span className="status-dot pending"></span>
              <span>Pending: {stats?.pendingOrders || 0}</span>
            </div>
            <div className="detail-row">
              <span className="status-dot processing"></span>
              <span>
                Processing:{" "}
                {
                  // Handle both old and new status naming
                  stats?.processingOrders ||
                    (stats?.confirmedOrders || 0) + (stats?.shippedOrders || 0)
                }
              </span>
            </div>
            <div className="detail-row">
              <span className="status-dot cancelled"></span>
              <span>Cancelled: {stats?.cancelledOrders || 0}</span>
            </div>
          </div>
        </div>

        {/* CUSTOMERS CARD */}
        <div className="stat-card customers">
          <div className="stat-header">
            <div className="stat-icon">👥</div>
            <h3>Total Customers</h3>
          </div>
          <p className="stat-value">{stats?.totalCustomers || 0}</p>
          <div className="stat-footer">
            <span className="stat-trend positive">↑ 15%</span>
            <span className="stat-period">vs last month</span>
          </div>
        </div>

        {/* PRODUCTS CARD */}
        <div className="stat-card products">
          <div className="stat-header">
            <div className="stat-icon">🛍️</div>
            <h3>Total Products</h3>
          </div>
          <p className="stat-value">{stats?.totalProducts || 0}</p>
          <div className="stat-footer">
            <span className="stat-change">+5 new this week</span>
          </div>
        </div>

        {/* AVERAGE ORDER VALUE */}
        <div className="stat-card aov">
          <div className="stat-header">
            <div className="stat-icon">📊</div>
            <h3>Avg. Order Value</h3>
          </div>
          <p className="stat-value">{formatPrice(stats?.averageOrderValue)}</p>
          <div className="stat-footer">
            <span className="stat-trend positive">↑ 8.2%</span>
            <span className="stat-period">vs last month</span>
          </div>
        </div>

        {/* CONVERSION RATE */}
        <div className="stat-card conversion">
          <div className="stat-header">
            <div className="stat-icon">🎯</div>
            <h3>Conversion Rate</h3>
          </div>
          <p className="stat-value">
            {stats?.conversionRate ? stats.conversionRate.toFixed(1) : "0.0"}%
          </p>
          <div className="stat-footer">
            <span className="stat-trend positive">↑ 0.5%</span>
            <span className="stat-period">vs last week</span>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>📦 Recent Orders</h3>
          <button
            className="view-all-btn"
            onClick={() => navigate("/admin/orders")}
          >
            View All →
          </button>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="recent-orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.orderId || order.id}>
                    <td>#{order.orderId || order.id}</td>
                    <td>{order.customerName || "Unknown"}</td>
                    <td className="amount">{formatPrice(order.amount)}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusColor(order.status)}`}
                      >
                        {getDisplayStatus(order.status)}
                      </span>
                    </td>
                    <td className="date">{formatDate(order.date)}</td>
                    <td>
                      <button
                        className="action-btn view"
                        onClick={() =>
                          navigate(`/admin/orders/${order.orderId || order.id}`)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No recent orders found</p>
            <button className="btn-luxury outline" onClick={fetchAdminStats}>
              Refresh Data
            </button>
          </div>
        )}
      </div>

      {/* TOP PRODUCTS SECTION */}
      {stats?.topProducts && stats.topProducts.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h3>🔥 Top Products</h3>
          </div>
          <div className="top-products-grid">
            {stats.topProducts.slice(0, 4).map((product) => (
              <div key={product.productId} className="top-product-card">
                <div className="product-rank">#{product.productId}</div>
                <h4 className="product-name">{product.productName}</h4>
                <div className="product-stats">
                  <span className="sold-count">Sold: {product.soldCount}</span>
                  <span className="product-revenue">
                    {formatPrice(product.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECENT CUSTOMERS SECTION */}
      {stats?.recentCustomers && stats.recentCustomers.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h3>👥 Recent Customers</h3>
            <button
              className="view-all-btn"
              onClick={() => navigate("/admin/customers")}
            >
              View All →
            </button>
          </div>
          <div className="recent-customers-grid">
            {stats.recentCustomers.map((customer) => (
              <div key={customer.customerId} className="customer-card">
                <div className="customer-avatar">
                  {customer.name?.charAt(0) || "U"}
                </div>
                <div className="customer-info">
                  <h4 className="customer-name">
                    {customer.name || "Unknown"}
                  </h4>
                  <p className="customer-email">
                    {customer.email || "No email"}
                  </p>
                  <div className="customer-meta">
                    <span className="join-date">
                      Joined: {formatDate(customer.joinDate)}
                    </span>
                    <span className="order-count">
                      {customer.orderCount || 0} orders
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="dashboard-section">
        <h3>⚡ Quick Actions</h3>
        <div className="quick-actions-grid">
          <button
            className="action-card"
            onClick={() => navigate("/admin/products/new")}
          >
            <span className="action-icon">➕</span>
            <span className="action-text">Add New Product</span>
          </button>

          <button
            className="action-card"
            onClick={() => navigate("/admin/categories")}
          >
            <span className="action-icon">📂</span>
            <span className="action-text">Create Category</span>
          </button>

          <button
            className="action-card"
            onClick={() => navigate("/admin/orders?status=PENDING")}
          >
            <span className="action-icon">⏳</span>
            <span className="action-text">Process Pending Orders</span>
            {stats?.pendingOrders > 0 && (
              <span className="badge">{stats.pendingOrders}</span>
            )}
          </button>

          <button
            className="action-card"
            onClick={() => {
              // In real app, this would generate report
              alert("Report generation feature coming soon!");
            }}
          >
            <span className="action-icon">📄</span>
            <span className="action-text">Generate Report</span>
          </button>
        </div>
      </div>

      {/* MONTHLY REVENUE CHART */}
      {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 && (
        <div className="dashboard-section">
          <h3>📈 Monthly Revenue Trend</h3>
          <div className="revenue-chart">
            <div className="chart-bars">
              {stats.monthlyRevenue.map((monthData, index) => {
                // Calculate bar height as percentage of max revenue
                const maxRevenue = Math.max(
                  ...stats.monthlyRevenue.map((m) => m.revenue || 0),
                );
                const barHeight =
                  maxRevenue > 0
                    ? ((monthData.revenue || 0) / maxRevenue) * 100
                    : 0;

                return (
                  <div key={index} className="chart-bar-container">
                    <div
                      className="chart-bar"
                      style={{ height: `${barHeight}%` }}
                      title={`${monthData.month}: ${formatPrice(monthData.revenue)}`}
                    ></div>
                    <span className="chart-label">{monthData.month}</span>
                    <span className="chart-value">
                      {formatPrice(monthData.revenue)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

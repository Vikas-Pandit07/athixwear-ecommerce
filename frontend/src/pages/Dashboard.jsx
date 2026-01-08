import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/Dashboard.css";
import ProductCard from "../components/ProductCard";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [userInfo, setUserInfo] = useState({ username: "Guest", email: "" });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('CUSTOMER');
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  // Fetch products and user info on component mount
  useEffect(() => {
    fetchProducts();
    fetchUserInfo();
    fetchUserRole();
    fetchCartCount();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = activeCategory === "All" 
        ? "http://localhost:9090/api/products"
        : `http://localhost:9090/api/products?category=${activeCategory}`;
      
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        
        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:9090/api/user/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo({
          username: data.username,
          email: data.email,
          initials: data.username.substring(0, 2).toUpperCase()
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/user/check-role', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.isAdmin ? 'ADMIN' : 'CUSTOMER');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

   // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/cart/count', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.count || 0);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:9090/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };

  // Advanced Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`dashboard-container ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      
      <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>

      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-brand">
          <img src="/assets/logoo.png" alt="Athix Logo" className="sidebar-logo-icon" />
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" className="active">OVERVIEW</a>
          <Link to="/cart">MY CART ({cartCount})</Link>
          <a href="#">NEW ARRIVALS</a>
          <a href="#">COLLECTIONS</a>
           <a href="#">ORDERS</a>
          <a href="#">WISHLIST</a>

          <Link to="/profile" className="profile-link">MY PROFILE
          </Link>
          
          {userRole === 'ADMIN' && (
            <Link to="/admin" className="admin-nav-link">
              <span className="admin-badge">⚙️</span> ADMIN PANEL
            </Link>
          )}
          
          <a href="#">MY STATS</a>
          <a href="#">SETTINGS</a>
          <a href="#">SUPPORT</a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-sidebar">
            <div className="avatar">{userInfo.initials || "GU"}</div>
            <div className="user-info">
              <p className="user-name">{userInfo.username}</p>
              <p className="user-rank">
                {userRole === 'ADMIN' ? 'ADMIN' : 'ATHIX ELITE'}
              </p>
            </div>
          </div>
          <button className="logout-btn-sidebar" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dash-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <div className={`hamburger ${isSidebarOpen ? "is-active" : ""}`}>
                <span></span><span></span><span></span>
              </div>
            </button>
            <div className="welcome-text">
              <h1>WELCOME, {userInfo.username.toUpperCase()}</h1>
            </div>
          </div>

          <div className="header-center">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search Athixwear..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="header-right">
            <Link to="/cart" className="cart-container">
              <span className="cart-icon">🛒</span>
             {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
             )}
            </Link>
            
            {/* Admin Badge in Header */}
            {userRole === 'ADMIN' && (
              <div className="admin-badge-header" title="Administrator">
                ⚙️
              </div>
            )}
          </div>
        </header>

        <section className="category-section">
          <div className="category-scroll">
            {categories.map((cat) => (
              <button 
                key={cat} 
                className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="product-section">
          <div className="section-header">
            <h3>{activeCategory.toUpperCase()} RELEASES</h3>
            {searchTerm && <span className="results-count">{filteredProducts.length} items found</span>}
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="fashion-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div className="product-card-wrapper" key={product.productId}>
                    <ProductCard 
                      productId={product.productId}
                      image={product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"}
                      category={product.category}
                      name={product.name}
                      price={product.price ? `₹${product.price.toLocaleString()}` : "₹0"}
                    />
                  </div>
                ))
              ) : (
                <div className="no-results">
                  {searchTerm 
                    ? `No products found matching "${searchTerm}"`
                    : "No products available in this category"
                  }
                  <button 
                    className="reset-search-btn"
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("All");
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        
      </main>
    </div>
  );
};

export default Dashboard;
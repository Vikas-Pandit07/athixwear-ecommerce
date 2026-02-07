import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/css/dashboard.css";
import ProductCard from "../components/ui/ProductCard";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([{ name: "All", empty: false }]);
  const [userInfo, setUserInfo] = useState({ username: "Guest" });
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState("CUSTOMER");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;
  const categoryImages = {
    all: `${import.meta.env.BASE_URL}all.png`,
    shoes: `${import.meta.env.BASE_URL}shoe.png`,
    footwear: `${import.meta.env.BASE_URL}shoe.png`,
    shirt: `${import.meta.env.BASE_URL}shirt.png`,
    tshirt: `${import.meta.env.BASE_URL}tshirt.png`,
    "t-shirt": `${import.meta.env.BASE_URL}tshirt.png`,
    women: `${import.meta.env.BASE_URL}ladies-dress.png`,
    ladies: `${import.meta.env.BASE_URL}ladies-dress.png`,
    caps: `${import.meta.env.BASE_URL}cap.png`,
    cap: `${import.meta.env.BASE_URL}cap.png`,
    men: `${import.meta.env.BASE_URL}shirt.png`,
  };

  const getCategoryImage = (category) => {
    const key = String(category || "").toLowerCase();

    if (categoryImages[key]) {
      return categoryImages[key];
    }

    if (key.includes("shoe") || key.includes("footwear")) {
      return categoryImages.shoes;
    }

    if (key.includes("tshirt") || key.includes("t-shirt")) {
      return categoryImages.tshirt;
    }

    if (key.includes("shirt")) {
      return categoryImages.shirt;
    }

    if (key.includes("women") || key.includes("ladies")) {
      return categoryImages.women;
    }

    if (key.includes("cap") || key.includes("hat")) {
      return categoryImages.caps;
    }

    if (key.includes("men")) {
      return categoryImages.men;
    }

    return categoryImages.all;
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch cart count
  const fetchCartCount = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:9090/api/cart/count", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCartCount(data.count || 0);
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  }, []);

  // Fetch user info
  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:9090/api/user/check-role",
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUserInfo({
          username: data.username || "Guest",
          isAdmin: data.isAdmin || false,
        });
        setUserRole(data.isAdmin ? "ADMIN" : "CUSTOMER");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, []);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:9090/api/products", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);

        // Update categories list and mark empties
        const uniqueCategories = new Set();
        (data || []).forEach((product) => {
          if (product.category) {
            uniqueCategories.add(product.category);
          }
        });

        setCategories((prev) => {
          const existing = prev.filter((cat) => cat.name !== "All");
          const merged = new Map();

          existing.forEach((cat) => {
            merged.set(cat.name, {
              name: cat.name,
              empty: !uniqueCategories.has(cat.name),
            });
          });

          uniqueCategories.forEach((catName) => {
            merged.set(catName, { name: catName, empty: false });
          });

          return [{ name: "All", empty: false }, ...Array.from(merged.values())];
        });

        filterProducts(data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:9090/api/categories", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const list = data?.data || data || [];
        const categoryNames = list
          .map((cat) => cat?.name || cat?.categoryName || cat?.category)
          .filter(Boolean);

        setCategories((prev) => {
          const merged = new Map();

          categoryNames.forEach((catName) => {
            merged.set(catName, { name: catName, empty: true });
          });

          prev
            .filter((cat) => cat.name !== "All")
            .forEach((cat) => {
              merged.set(cat.name, {
                name: cat.name,
                empty: cat.empty ?? true,
              });
            });

          return [{ name: "All", empty: false }, ...Array.from(merged.values())];
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Filter products
  const filterProducts = useCallback(
    (
      productsList = products,
      category = activeCategory,
      search = searchTerm,
    ) => {
      const filtered = (productsList || []).filter((product) => {
        const matchesCategory =
          category === "All" || product.category === category;
        const matchesSearch =
          search === "" ||
          (product.name &&
            product.name.toLowerCase().includes(search.toLowerCase()));
        return matchesCategory && matchesSearch;
      });
      setFilteredProducts(filtered);
    },
    [products, activeCategory, searchTerm],
  );

  // Handle category change
  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
    filterProducts(products, category, searchTerm);
  };

  // Handle search
  useEffect(() => {
    const timer = setTimeout(() => {
      filterProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filterProducts]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchUserInfo(),
        fetchCartCount(),
      ]);
    };
    fetchData();
  }, [fetchProducts, fetchCategories, fetchUserInfo, fetchCartCount]);

  // Update cart count
  const updateCartCount = useCallback(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".menu-toggle")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isSidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isSidebarOpen]);

  // Toggle body scroll
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleBrandClick = () => {
    setActiveCategory("All");
    setSearchTerm("");
    filterProducts(products, "All", "");
    setSidebarOpen(false);
  };

  const activeCategoryInfo = categories.find(
    (category) => category.name === activeCategory,
  );

  return (
    <div
      className={`dashboard-container ${isSidebarOpen ? "sidebar-open" : ""}`}
    >
      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Enhanced Sidebar */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
      >
        <div className="sidebar-content">
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <div className="welcome-text">
              <h1>
                Hello,{" "}
                <span className="username-highlight">{userInfo.username}</span>
              </h1>
            </div>

            <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <span className="close-icon">✕</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="section-title">NAVIGATION</h3>
              <div className="nav-links">
                <Link
                  to="/dashboard"
                  className="nav-link active"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">🏠</span>
                  <span className="nav-label">Dashboard</span>
                </Link>

                <Link
                  to="/cart"
                  className="nav-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">🛒</span>
                  <span className="nav-label">My Cart</span>
                  {cartCount > 0 && (
                    <span className="nav-badge">{cartCount}</span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="nav-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">👤</span>
                  <span className="nav-label">Profile</span>
                </Link>

                <Link
                  to="/orders"
                  className="nav-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">📦</span>
                  <span className="nav-label">Orders</span>
                </Link>

                <button className="nav-link">
                  <span className="nav-icon">❤️</span>
                  <span className="nav-label">Wishlist</span>
                </button>

                {userRole === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="nav-link admin-link"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="nav-icon">👑</span>
                    <span className="nav-label">Admin Panel</span>
                    <span className="admin-badge">PRO</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="nav-section">
              <h3 className="section-title">SHOP</h3>
              <div className="nav-links">
                <button
                  className="nav-link"
                  onClick={() => handleCategoryChange("New Arrivals")}
                >
                  <span className="nav-icon">🆕</span>
                  <span className="nav-label">New Arrivals</span>
                </button>

                <button
                  className="nav-link"
                  onClick={() => handleCategoryChange("Trending")}
                >
                  <span className="nav-icon">🔥</span>
                  <span className="nav-label">Trending</span>
                </button>

                <button
                  className="nav-link"
                  onClick={() => handleCategoryChange("Collections")}
                >
                  <span className="nav-icon">👕</span>
                  <span className="nav-label">Collections</span>
                </button>

                <button
                  className="nav-link"
                  onClick={() => handleCategoryChange("Sale")}
                >
                  <span className="nav-icon">💰</span>
                  <span className="nav-label">Sale</span>
                  <span className="sale-badge">-50%</span>
                </button>
              </div>
            </div>

            <div className="nav-section">
              <h3 className="section-title">SETTINGS</h3>
              <div className="nav-links">
                <button className="nav-link" onClick={toggleTheme}>
                  <span className="nav-icon">
                    {theme === "light" ? "🌙" : "☀️"}
                  </span>
                  <span className="nav-label">
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </span>
                </button>
              </div>
            </div>
          </nav>

          {/* User Profile */}
          <div className="sidebar-profile">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {userInfo.username?.substring(0, 2).toUpperCase() || "GU"}
              </div>
              <div className="profile-info">
                <h4 className="profile-name">{userInfo.username}</h4>
                <p className="profile-role">
                  {userRole === "ADMIN" ? "Administrator" : "Premium Member"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`dashboard-main ${isSidebarOpen ? "blur" : ""}`}>
        {/* Header */}
        <header className="dash-header">
          <div className="header-left">
            <div className="brand-container">
              <Link
                to="/dashboard"
                className="brand-logo brand-link"
                onClick={handleBrandClick}
              >
                <div className="logo-circle">
                  <img src={logoSrc} alt="AthixWear" className="logo-img" />
                </div>
                <span className="brand-name">ATHIXWEAR</span>
              </Link>
              <p className="brand-tagline">Tailored for the Bold Horizon</p>
            </div>
          </div>

          <div className="header-center">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="header-right">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <Link to="/cart" className="header-cart">
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/profile" className="header-profile">
              <div className="profile-avatar-mini">
                {userInfo.username?.substring(0, 1).toUpperCase() || "G"}
              </div>
            </Link>
          </div>
        </header>

        {/* Categories Section */}
        <section className="category-section">
          <div className="categories-container">
            <div className="categories-scroll">
              <button
                className="menu-toggle"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle menu"
              >
                <div
                  className={`hamburger ${isSidebarOpen ? "is-active" : ""}`}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`category-btn ${activeCategory === cat.name ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat.name)}
                >
                  <span className="category-icon">
                    <img src={getCategoryImage(cat.name)} alt={`${cat.name} icon`} />
                  </span>
                  <span className="category-name">{cat.name}</span>
                  {cat.empty && cat.name !== "All" && (
                    <span className="category-empty">Empty</span>
                  )}
                  {activeCategory === cat.name && (
                    <span className="active-indicator" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section">
          <div className="section-header">
            <div className="header-left">
              <h3>
                {activeCategory === "All"
                  ? "FEATURED PRODUCTS"
                  : `${activeCategory.toUpperCase()} COLLECTION`}
              </h3>
              {searchTerm && (
                <p className="search-results">
                  Found {filteredProducts.length} products matching "
                  {searchTerm}"
                </p>
              )}
            </div>
            <div className="sort-wrapper">
              <select className="sort-select" disabled={loading}>
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="products-loading">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.productId || index}
                  className="product-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard
                    productId={product.productId}
                    image={
                      product.images?.[0] ||
                      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"
                    }
                    category={product.category}
                    name={product.name}
                    price={
                      product.price
                        ? `₹${product.price.toLocaleString()}`
                        : "₹0"
                    }
                    onAddToCart={updateCartCount}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <div className="no-products-icon">🔍</div>
              <h3>No products found</h3>
              <p>
                {activeCategoryInfo?.empty && activeCategory !== "All"
                  ? "This category is empty. Add products to see them here."
                  : "Try adjusting your search or filter."}
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("All");
                }}
              >
                View All Products
              </button>
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="products-footer">
              <p className="products-count">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;


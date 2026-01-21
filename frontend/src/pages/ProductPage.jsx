// pages/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import '../assets/css/products.css';
import ProductCard from '../components/ui/ProductCard';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    sortBy: 'featured',
    priceRange: [0, 10000],
    inStock: false
  });

  useEffect(() => {
    fetchProducts();
  }, [filters.category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = filters.category === 'All' 
        ? 'http://localhost:9090/api/products'
        : `http://localhost:9090/api/products?category=${filters.category}`;
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="products-loading-state">
        <div className="fashion-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>OUR PRODUCTS</h1>
        <p className="products-subtitle">Premium streetwear for the modern hustler</p>
      </div>

      {error && (
        <div className="admin-error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="products-filters">
        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <select 
            className="filter-select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Hoodies">Hoodies</option>
            <option value="Pants">Pants</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sort by:</label>
          <select 
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Price Range:</label>
          <div className="price-range">
            <input 
              type="number" 
              placeholder="Min" 
              value={filters.priceRange[0]}
              onChange={(e) => handleFilterChange('priceRange', [e.target.value, filters.priceRange[1]])}
            />
            <span>to</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], e.target.value])}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-checkbox">
            <input 
              type="checkbox" 
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No Products Found</h3>
          <p>Try adjusting your filters or check back later for new arrivals.</p>
          <button 
            className="btn-luxury"
            onClick={() => handleFilterChange('category', 'All')}
          >
            VIEW ALL PRODUCTS
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.productId}
              productId={product.productId}
              image={product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"}
              category={product.category}
              name={product.name}
              price={product.price ? `₹${product.price.toLocaleString()}` : "₹0"}
              description={product.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
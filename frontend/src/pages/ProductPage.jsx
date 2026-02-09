import React, { useState, useEffect, useMemo } from 'react';
import '../assets/css/products.css';
import ProductCard from '../components/ui/ProductCard';
import { getAllProducts } from '../services/productService';

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
    loadProducts();
  }, [filters.category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
    
      const data = await getAllProducts({
        category: filters.category,
      });

      setProducts(data || []);
    } catch (err) {
      console.error('Product load failed:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const visibleProducts = useMemo(() => {
    const [minPrice, maxPrice] = filters.priceRange.map((value) => {
      const numericValue = Number(value);
      return Number.isFinite(numericValue) ? numericValue : 0;
    });

    const filtered = products.filter((product) => {
      const price = Number(product.price) || 0;
      const inStock = typeof product.stock === 'number'
        ? product.stock > 0
        : product.inStock !== false;

      if (price < minPrice || price > maxPrice) return false;
      if (filters.inStock && !inStock) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;

      if (filters.sortBy === 'price-low') return priceA - priceB;
      if (filters.sortBy === 'price-high') return priceB - priceA;

      if (filters.sortBy === 'newest') {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      }

      return 0;
    });
  }, [products, filters]);

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

      {visibleProducts.length === 0 ? (
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
          {visibleProducts.map(product => (
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

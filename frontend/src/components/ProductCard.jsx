// components/ProductCard.js
import React, { useState } from 'react';
import '../assets/ProductCard.css';

const ProductCard = ({ productId, image, category, name, price }) => {
  const [adding, setAdding] = useState(false);

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600";
  };

  const handleAddToBag = async () => {
    setAdding(true);
    try {
      const response = await fetch('http://localhost:9090/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          productId: productId, 
          quantity: 1 
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Show success message
        
      } else {
        alert(data.error || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error adding to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"} 
          alt={name} 
          className="product-image"
          onError={handleImageError}
        />
        <div className="product-overlay">
          <button 
            className="quick-add" 
            onClick={handleAddToBag}
            disabled={adding}
          >
            {adding ? 'ADDING...' : 'ADD TO BAG'}
          </button>
        </div>
        <div className="product-badge">NEW DROP</div>
      </div>
      
      <div className="product-info">
        <span className="product-category">{category || "Category"}</span>
        <h4 className="product-name">{name}</h4>
        <p className="product-price">{price || "₹0"}</p>
      </div>
    </div>
  );
}

export default ProductCard;

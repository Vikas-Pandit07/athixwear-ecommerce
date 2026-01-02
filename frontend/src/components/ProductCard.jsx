import React from 'react';
import '../assets/ProductCard.css';

const ProductCard = ({ image, category, name, price }) => {
  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600";
  };

  const handleAddToBag = () => {
    alert(`Added ${name} to bag!`);
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
          <button className="quick-add" onClick={handleAddToBag}>
            ADD TO BAG
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
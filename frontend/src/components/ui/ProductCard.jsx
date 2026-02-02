import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "/src/assets/css/products.css";

const formatPrice = (price) => {
  if (!price) return "₹0";
  if (typeof price === "string") return price;
  return `₹${price.toLocaleString("en-IN")}`;
};

const ProductCard = ({
  productId,
  image,
  category,
  name,
  price,
  originalPrice,
  description,
  discount,
  isNew,
  isFeatured,
  isOnSale,
  onAddToCart,
}) => {
  const [adding, setAdding] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showViewCart, setShowViewCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // Check if product is already in cart
  useEffect(() => {
    const checkIfInCart = async () => {
      try {
        const response = await fetch("http://localhost:9090/api/cart", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.items) {
            const productInCart = data.items.find(
              (item) => item.productId === productId,
            );
            setIsInCart(!!productInCart);
            setShowViewCart(!!productInCart);
          }
        }
      } catch (err) {
        console.error("Error checking cart:", err);
      }
    };

    checkIfInCart();
  }, [productId]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    setImageError(true);
    e.target.src =
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600";
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setAdding(true);
    setMessage({ type: "", text: "" });
    setShowViewCart(false);

    try {
      const response = await fetch("http://localhost:9090/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: `${name} added to cart!` });
        setIsInCart(true);
        setShowViewCart(true);

        // Call the callback to update cart count in parent
        if (onAddToCart) {
          onAddToCart();
        }

        // Trigger a global event for other components
        window.dispatchEvent(new CustomEvent("cartUpdated"));

        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.error || data.message || "Failed to add to cart",
        });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setMessage({ type: "error", text: "Network error. Please try again." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } finally {
      setAdding(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${productId}`);
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    navigate("/cart");
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setInWishlist(!inWishlist);
  };

  const calculateDiscount = () => {
    if (originalPrice && price) {
      const orig =
        typeof originalPrice === "string"
          ? parseFloat(originalPrice.replace("₹", "").replace(/,/g, ""))
          : originalPrice;
      const curr =
        typeof price === "string"
          ? parseFloat(price.replace("₹", "").replace(/,/g, ""))
          : price;
      if (orig > curr) {
        return Math.round(((orig - curr) / orig) * 100);
      }
    }
    return 0;
  };

  return (
    <div
      className="product-card"
      onClick={handleViewDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleViewDetails()}
      aria-label={`View ${name} details`}
    >
      <div className="product-image-container">
        {!imageLoaded && !imageError && <div className="image-skeleton"></div>}
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"
          }
          alt={name}
          className={`product-image ${imageLoaded ? "loaded" : ""}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />

        {/* Product Badges */}
        {isOnSale && <div className="product-badge sale">SALE</div>}
        {isNew && <div className="product-badge">NEW</div>}
        {isFeatured && <div className="product-badge featured">FEATURED</div>}

        {/* Discount Badge */}
        {originalPrice && price && calculateDiscount() > 0 && (
          <div className="discount">{calculateDiscount()}% OFF</div>
        )}

        {/* Quick Actions */}
        <div className="product-actions">
          <button
            className={`action-btn wishlist ${inWishlist ? "active" : ""}`}
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {inWishlist ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{category || "Fashion"}</span>
        <h3 className="product-name">{name || "Product Name"}</h3>

        {description && (
          <p className="product-description">
            {description.length > 60
              ? description.substring(0, 60) + "..."
              : description}
          </p>
        )}

        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">{formatPrice(price)}</span>
            {originalPrice && price && calculateDiscount() > 0 && (
              <span className="original-price">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-count">(0)</span>
          </div>
        </div>

        {/* Show View Cart button if product is in cart */}
        {isInCart ? (
          <button
            className="view-cart-btn"
            onClick={handleViewCart}
            aria-label={`View ${name} in cart`}
          >
            <span>🛒</span>
            VIEW CART
          </button>
        ) : (
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={adding}
            aria-label={`Add ${name} to cart`}
          >
            {adding ? (
              <>
                <span className="spinner-tiny"></span>
                ADDING...
              </>
            ) : (
              <>
                <span>🛒</span>
                ADD TO BAG
              </>
            )}
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {message.text && (
        <div className={`product-message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
};

export default ProductCard;

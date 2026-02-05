import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/cart.css";

const CartPage = () => {
    const navigate = useNavigate();
    const [updatingItem, setUpdataingItem] = useState(null);
    const [message, setMessage] = useState()
  
  if (loading) {
    return (
      <div className="cart-loading">
        <div className="fashion-spinner"></div>
        <p>Loading your shopping bag...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>YOUR SHOPPING BAG</h1>
        <div className="cart-stats">
          <span className="item-count">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
          <span className="cart-total">Total: ₹{total.toFixed(2)}</span>
        </div>
      </div>

      {message.text && (
        <div className={`cart-message ${message.type}`}>
          {message.text}
          <button
            className="message-close"
            onClick={() => setMessage({ type: "", text: "" })}
          >
            ×
          </button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛍️</div>
          <h2>Your fashion journey awaits</h2>
          <p>
            Your cart is currently empty. Discover our exclusive collections.
          </p>
          <div className="empty-actions">
            <Link to="/dashboard" className="btn-luxury">
              START SHOPPING
            </Link>
            <Link to="/profile" className="btn-outline">
              VIEW PROFILE
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          <div className="cart-container">
            <div className="cart-items-section">
              <div className="section-title">
                <h3>ITEMS ({cartItems.length})</h3>
              </div>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={
                          item.productImage ||
                          item.prodctImage ||
                          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"
                        }
                        alt={item.productName}
                      />
                    </div>

                    <div className="cart-item-content">
                      <div className="item-header">
                        <h3>{item.productName}</h3>
                        <button
                          className="remove-item-btn"
                          onClick={() => removeItem(item.cartItemId)}
                          disabled={updatingItem === item.cartItemId}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="item-details">
                        <span className="item-price">₹{item.price}</span>
                        <span className="item-category">
                          • {item.category || "General"}
                        </span>
                      </div>

                      <div className="item-controls">
                        <div className="quantity-selector">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity - 1)
                            }
                            disabled={
                              item.quantity <= 1 ||
                              updatingItem === item.cartItemId
                            }
                          >
                            −
                          </button>
                          <span className="qty-value">
                            {updatingItem === item.cartItemId ? (
                              <div className="mini-spinner"></div>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity + 1)
                            }
                            disabled={updatingItem === item.cartItemId}
                          >
                            +
                          </button>
                        </div>

                        <span className="item-total">₹{item.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary-section">
              <div className="summary-card">
                <h3>ORDER SUMMARY</h3>

                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "free" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total-row">
                    <span>Total Amount</span>
                    <span className="total-amount">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="shipping-note">
                    <span className="note-icon">🚚</span>
                    Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}

                <button
                  className="btn-luxury checkout-btn"
                  onClick={() => navigate("/checkout")}
                >
                  PROCEED TO CHECKOUT
                </button>

                <div className="payment-methods">
                  <p>We accept</p>
                  <div className="payment-icons">
                    <span>💳</span>
                    <span>📱</span>
                    <span>🏦</span>
                    <span>💰</span>
                  </div>
                </div>

                <Link to="/dashboard" className="continue-shopping">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

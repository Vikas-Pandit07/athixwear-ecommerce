import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../assets/css/cart.css";

const CURRENCY = "\u20B9";
const FREE_SHIPPING_MIN = 1000;

const CartPage = () => {
  const navigate = useNavigate();
  const [updatingItem, setUpdatingItem] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    items,
    itemCount,
    subtotal,
    shipping,
    total,
    loading,
    updateItem,
    removeItem,
    clearAll,
  } = useCart();

  const amountLeftForFreeShipping = useMemo(
    () => Math.max(0, FREE_SHIPPING_MIN - subtotal),
    [subtotal],
  );

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (!itemId || quantity < 1) return;

    try {
      setUpdatingItem(itemId);
      await updateItem(itemId, quantity);
      setMessage({ type: "success", text: "Cart updated" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Update failed" });
    } finally {
      setUpdatingItem(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!itemId) return;
    if (!window.confirm("Remove this item from cart?")) return;

    try {
      await removeItem(itemId);
      setMessage({ type: "success", text: "Item removed" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Remove failed" });
    }
  };

  const handleClearCart = async () => {
    if (!items.length) return;
    if (!window.confirm("Clear all items from cart?")) return;

    try {
      await clearAll();
      setMessage({ type: "success", text: "Cart cleared" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Clear failed" });
    }
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner-lg"></div>
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
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="cart-total">
            Total: {CURRENCY}
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      {message.text && (
        <div className={`cart-message ${message.type}`}>
          {message.text}
          <button
            className="message-close"
            onClick={() => setMessage({ type: "", text: "" })}
          >
            x
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛍️</div>
          <h2>Your fashion journey awaits</h2>
          <p>Your cart is currently empty.</p>
          <Link to="/dashboard" className="btn-luxury">
            START SHOPPING
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>

          <div className="cart-container">
            <div className="cart-items-section">
              <div className="section-title">
                <h3>ITEMS ({itemCount})</h3>
              </div>

              <div className="cart-items">
                {items.map((item) => {
                  const itemId = item.cartItemId || item.productId;
                  const quantity = Number(item.quantity || 1);
                  const price = Number(item.price || 0);
                  const itemTotal = Number(item.totalPrice) || price * quantity;

                  return (
                    <div key={itemId} className="cart-item">
                      <div className="cart-item-image">
                        <img
                          src={
                            item.productImage ||
                            item.prodctImage ||
                            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"
                          }
                          alt={item.productName || "Product"}
                        />
                      </div>

                      <div className="cart-item-content">
                        <div className="item-header">
                          <h3>{item.productName || "Product"}</h3>
                          <button
                            className="remove-item-btn"
                            onClick={() => handleRemoveItem(itemId)}
                            disabled={updatingItem === itemId}
                          >
                            x
                          </button>
                        </div>

                        <div className="item-details">
                          <span className="item-price">
                            {CURRENCY}
                            {price.toFixed(2)}
                          </span>
                          <span className="item-category">
                            {item.category || "General"}
                          </span>
                        </div>

                        <div className="item-controls">
                          <div className="quantity-selector">
                            <button
                              className="qty-btn"
                              onClick={() =>
                                handleUpdateQuantity(itemId, quantity - 1)
                              }
                              disabled={
                                quantity <= 1 || updatingItem === itemId
                              }
                            >
                              -
                            </button>

                            <span className="qty-value">
                              {updatingItem === itemId ? (
                                <div className="mini-spinner"></div>
                              ) : (
                                quantity
                              )}
                            </span>

                            <button
                              className="qty-btn"
                              onClick={() =>
                                handleUpdateQuantity(itemId, quantity + 1)
                              }
                              disabled={updatingItem === itemId}
                            >
                              +
                            </button>
                          </div>

                          <span className="item-total">
                            {CURRENCY}
                            {itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cart-summary-section">
              <div className="summary-card">
                <h3>ORDER SUMMARY</h3>

                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>
                      {CURRENCY}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "free" : ""}>
                      {shipping === 0
                        ? "FREE"
                        : `${CURRENCY}${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total-row">
                    <span>Total Amount</span>
                    <span className="total-amount">
                      {CURRENCY}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="shipping-note">
                    <span className="note-icon">🚚</span>
                    Add {CURRENCY}
                    {amountLeftForFreeShipping.toFixed(2)} more for free
                    shipping!
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
                  Continue Shopping
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

// pages/CartPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Cart.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9090/api/cart', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        setMessage('Failed to load cart items');
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setMessage('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingItem(itemId);
      const response = await fetch(`http://localhost:9090/api/cart/items/${itemId}?quantity=${newQuantity}`, {
        method: 'PUT',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Update local state
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.cartItemId === itemId 
              ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
              : item
          )
        );
      } else {
        setMessage('Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setMessage('Error updating quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Remove this item from cart?')) return;
    
    try {
      const response = await fetch(`http://localhost:9090/api/cart/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Remove from local state
        setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== itemId));
        setMessage('Item removed from cart');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setMessage('Error removing item');
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.totalPrice) || 0), 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="fashion-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>SHOPPING CART</h1>
        <p className="cart-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
      </div>

      {message && (
        <div className={`cart-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some stylish Athixwear items to get started!</p>
          <Link to="/dashboard" className="btn-luxury">
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.cartItemId} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.productImage} alt={item.productName} />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.productName}</h3>
                  <p className="item-price">₹{item.price}</p>
                  
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItem === item.cartItemId}
                      className="quantity-btn"
                    >
                      −
                    </button>
                    
                    <span className="quantity-value">
                      {updatingItem === item.cartItemId ? '...' : item.quantity}
                    </span>
                    
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      disabled={updatingItem === item.cartItemId}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <p className="item-total">Total: ₹{item.totalPrice}</p>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.cartItemId)}
                    disabled={updatingItem === item.cartItemId}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h2>ORDER SUMMARY</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            
            <div className="summary-row">
              <small>Free shipping on orders above ₹1000</small>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            
            <button 
              className="btn-luxury checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              PROCEED TO CHECKOUT
            </button>
            
            <Link to="/dashboard" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
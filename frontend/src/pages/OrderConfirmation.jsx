// pages/OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../assets/css/order-confirmation.css';
import Confetti from '../components/ui/Confetti';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9090/api/orders/${orderId}`, {
        method: 'GET',
        credentials: 'include'
      });
      
        const data = await response.json();
      if (response.ok) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

   const formatPrice = (price) => {
    if (!price) return "₹0";
    if (typeof price === "number") return `₹${price.toLocaleString("en-IN")}`;
    return price;
  };

  if (loading) {
    return (
      <div className="order-confirmation loading">
        <div className="fashion-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
       <Confetti />
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>ORDER PLACED SUCCESSFULLY!</h1>
        <p className="order-id">Order ID: #{orderId}</p>
        <p className="confirmation-message">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>
      </div>

      <div className="confirmation-details">
        <div className="detail-card">
          <h3>Order Summary</h3>
          <div className="detail-row">
            <span>Order Date:</span>
            <span>{new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</span>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span>
            <span className="total-amount">₹{order?.totalAmount?.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>Payment Status:</span>
            <span className={`status ${order?.paymentStatus?.toLowerCase()}`}>
              {order?.paymentStatus}
            </span>
          </div>
          <div className="detail-row">
            <span>Order Status:</span>
            <span className={`status ${order?.orderStatus?.toLowerCase()}`}>
              {order?.orderStatus}
            </span>
          </div>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div>
                <h4>Order Confirmed</h4>
                <p>We've received your order and are preparing it for shipment.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div>
                <h4>Order Shipped</h4>
                <p>Your order will be shipped within 24-48 hours.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <div>
                <h4>Out for Delivery</h4>
                <p>You'll receive a call from our delivery partner.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <div>
                <h4>Delivered</h4>
                <p>Your order will be delivered to your doorstep.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/dashboard" className="btn-luxury">
            CONTINUE SHOPPING
          </Link>
          <Link to={`/orders/${orderId}`} className="btn-outline">
            VIEW ORDER DETAILS
          </Link>
          <Link to="/profile?tab=orders" className="btn-outline">
            VIEW ALL ORDERS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
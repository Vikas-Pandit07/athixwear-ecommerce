import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:9090/api/orders/${orderId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  return (
    <div className="order-confirmation">
      <div className="confirmation-icon">✓</div>
      <h1>ORDER PLACED SUCCESSFULLY!</h1>
      <p>Your order ID: <strong>{orderId}</strong></p>
      <p>We've sent a confirmation email to your registered email address.</p>
      
      <div className="order-details">
        <h3>Order Summary</h3>
        {/* Display order items, total, shipping address */}
      </div>
      
      <div className="confirmation-actions">
        <Link to="/dashboard" className="btn-luxury">
          Continue Shopping
        </Link>
        <Link to="/profile?tab=orders" className="btn-outline">
          View Order Details
        </Link>
      </div>
    </div>
  );
};
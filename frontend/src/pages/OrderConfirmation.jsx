import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../assets/css/order-confirmation.css";
import Confetti from "../components/ui/Confetti";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:9090/api/orders/${orderId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || "Failed to load order details");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Error loading order details");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "₹0";
    if (typeof price === "number") return `₹${price.toFixed(2)}`;
    return price;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="order-confirmation loading">
        <div className="fashion-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h1>Order Not Found</h1>
          <p>{error || "We couldn't find your order details."}</p>
          <div className="confirmation-actions">
            <Link to="/dashboard" className="btn-luxury">
              CONTINUE SHOPPING
            </Link>
            <Link to="/profile?tab=orders" className="btn-outline">
              VIEW ALL ORDERS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <Confetti />
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>ORDER PLACED SUCCESSFULLY!</h1>
        <p className="order-id">Order ID: #{order.orderId}</p>
        <p className="confirmation-message">
          Thank you for your purchase. Your order has been confirmed and will be
          shipped soon.
        </p>
      </div>

      <div className="confirmation-details">
        <div className="detail-card">
          <h3>Order Summary</h3>
          <div className="detail-row">
            <span>Order Date:</span>
            <span>{formatDate(order.orderDate)}</span>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span>
            <span className="total-amount">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
          <div className="detail-row">
            <span>Payment Status:</span>
            <span className={`status ${order.paymentStatus?.toLowerCase()}`}>
              {order.paymentStatus || "PENDING"}
            </span>
          </div>
          <div className="detail-row">
            <span>Order Status:</span>
            <span className={`status ${order.orderStatus?.toLowerCase()}`}>
              {order.orderStatus || "PROCESSING"}
            </span>
          </div>
          <div className="detail-row">
            <span>Payment Method:</span>
            <span>{order.paymentMethod || "Cash on Delivery"}</span>
          </div>
        </div>

        {order.shippingAddress && (
          <div className="detail-card">
            <h3>Shipping Address</h3>
            <div className="address-details">
              <p>
                <strong>{order.shippingAddress.fullName}</strong>
              </p>
              <p>{order.shippingAddress.addressLine}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.pinCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p>📞 {order.shippingAddress.phone}</p>
            </div>
          </div>
        )}

        {order.items && order.items.length > 0 && (
          <div className="detail-card">
            <h3>Order Items ({order.items.length})</h3>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={item.orderItemId || index} className="order-item">
                  <img
                    src={
                      item.productImage ||
                      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"
                    }
                    alt={item.productName}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.productName}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {formatPrice(item.price)} each</p>
                  </div>
                  <div className="item-total">
                    {formatPrice(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total-summary">
              <div className="summary-row">
                <span>Items Total:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              <div className="summary-row total">
                <span>Grand Total:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="next-steps">
          <h3>What's Next?</h3>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div>
                <h4>Order Confirmed</h4>
                <p>
                  We've received your order and are preparing it for shipment.
                </p>
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
          <Link to={`/orders/${order.orderId}`} className="btn-outline">
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

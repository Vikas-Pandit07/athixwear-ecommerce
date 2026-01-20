import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/checkout.css";

const formatPrice = (price) => {
  if (!price) return "₹0";
  if (typeof price === "number") return `₹${price.toLocaleString("en-IN")}`;
  return price;
};

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    isDefault: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderSummary, setOrderSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
    fetchOrderSummary();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("http://localhost:9090/api/user/addresses", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const addressesData = data.addresses || [];
        setAddresses(addressesData);

        // Select first address if none selected
        if (addressesData.length > 0 && !selectedAddress) {
          const defaultAddress = addressesData.find(
            (addr) => addr.isDefault || addr.default,
          );
          if (defaultAddress) {
            setSelectedAddress(defaultAddress.addressId || defaultAddress.id);
          } else {
            setSelectedAddress(
              addressesData[0].addressId || addressesData[0].id,
            );
          }
        }
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to load addresses",
        });
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setMessage({ type: "error", text: "Failed to load addresses" });
    }
  };

  const fetchOrderSummary = async () => {
    try {
      const response = await fetch("http://localhost:9090/api/cart", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderSummary(data);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to load cart",
        });
      }
    } catch (err) {
      console.error("Error fetching order summary:", err);
      setMessage({ type: "error", text: "Failed to load cart" });
    }
  };

  const handleAddAddress = async () => {
    // Validate form
    if (!newAddress.fullName.trim()) {
      setMessage({ type: "error", text: "Please enter full name" });
      return;
    }
    if (!newAddress.phone.match(/^\d{10}$/)) {
      setMessage({
        type: "error",
        text: "Please enter valid 10-digit phone number",
      });
      return;
    }
    if (!newAddress.addressLine.trim()) {
      setMessage({ type: "error", text: "Please enter address" });
      return;
    }
    if (!newAddress.city.trim()) {
      setMessage({ type: "error", text: "Please enter city" });
      return;
    }
    if (!newAddress.state.trim()) {
      setMessage({ type: "error", text: "Please enter state" });
      return;
    }
    if (!newAddress.pinCode.match(/^\d{6}$/)) {
      setMessage({
        type: "error",
        text: "Please enter valid 6-digit PIN code",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:9090/api/user/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newAddress),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: data.message || "Address added successfully",
        });
        setNewAddress({
          fullName: "",
          phone: "",
          addressLine: "",
          city: "",
          state: "",
          pinCode: "",
          country: "India",
          isDefault: false,
        });
        fetchAddresses();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({
          type: "error",
          text: data.error || data.message || "Failed to add address",
        });
      }
    } catch (err) {
      console.error("Error adding address:", err);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setMessage({ type: "error", text: "Please select a delivery address" });
      return;
    }

    if (
      !orderSummary ||
      !orderSummary.items ||
      orderSummary.items.length === 0
    ) {
      setMessage({ type: "error", text: "Your cart is empty" });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:9090/api/orders/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            addressId: selectedAddress,
            paymentMethod: paymentMethod,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: data.message || "Order placed successfully!",
        });

        setTimeout(() => {
          navigate(`/order-confirmation/${data.orderId}`);
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.error || data.message || "Failed to place order",
        });
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:9090/api/user/addresses/${addressId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: data.message || "Address deleted successfully",
        });
        fetchAddresses();
        // If deleted address was selected, clear selection
        if (selectedAddress === addressId) {
          setSelectedAddress(
            addresses.length > 1
              ? addresses[1].addressId || addresses[1].id
              : null,
          );
        }
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to delete address",
        });
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      setMessage({ type: "error", text: "Failed to delete address" });
    }
  };

  const summary = calculateSummary();

  function calculateSummary() {
    if (!orderSummary) {
      return {
        subtotal: 0,
        shipping: 0,
        total: 0,
      };
    }

    const subtotal = orderSummary.subtotal || orderSummary.totalAmount || 0;
    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;

    return {
      subtotal: subtotal,
      shipping: shipping,
      total: total,
    };
  }

  const selectedAddressObj = addresses.find(
    (addr) => addr.addressId === selectedAddress || addr.id === selectedAddress,
  );

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>CHECKOUT</h1>
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <span className="step-number">1</span>
            <span className="step-label">Address</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirm</span>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`checkout-message ${message.type}`}>
          {message.text}
          <button
            className="message-close"
            onClick={() => setMessage({ type: "", text: "" })}
          >
            ×
          </button>
        </div>
      )}

      <div className="checkout-container">
        <div className="checkout-main">
          {/* Step 1: Address Selection */}
          {step === 1 && (
            <div className="checkout-step">
              <h2>Delivery Address</h2>

              <div className="address-selection">
                <h3>Saved Addresses</h3>
                {addresses.length > 0 ? (
                  <div className="address-grid">
                    {addresses.map((address) => {
                      const addressId = address.addressId || address.id;
                      const isDefault = address.isDefault || address.default;

                      return (
                        <div
                          key={addressId}
                          className={`address-card ${selectedAddress === addressId ? "selected" : ""}`}
                          onClick={() => setSelectedAddress(addressId)}
                        >
                          {isDefault && (
                            <span className="default-badge">Default</span>
                          )}
                          <h4>{address.fullName}</h4>
                          <p>{address.addressLine}</p>
                          <p>
                            {address.city}, {address.state} - {address.pinCode}
                          </p>
                          <p>{address.country}</p>
                          <p>📞 {address.phone}</p>
                          <div className="address-actions">
                            <span className="select-btn">
                              {selectedAddress === addressId
                                ? "✓ Selected"
                                : "Select"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="no-address">
                    No saved addresses. Add a new address below.
                  </p>
                )}

                <div className="add-address-form">
                  <h3>Add New Address</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        value={newAddress.fullName}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            fullName: e.target.value,
                          })
                        }
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10),
                          })
                        }
                        placeholder="Enter 10-digit phone number"
                        maxLength="10"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Address Line *</label>
                      <textarea
                        value={newAddress.addressLine}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            addressLine: e.target.value,
                          })
                        }
                        placeholder="House no., Building, Street, Area"
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            state: e.target.value,
                          })
                        }
                        placeholder="Enter state"
                      />
                    </div>

                    <div className="form-group">
                      <label>PIN Code *</label>
                      <input
                        type="text"
                        value={newAddress.pinCode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            pinCode: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6),
                          })
                        }
                        placeholder="Enter 6-digit PIN code"
                        maxLength="6"
                      />
                    </div>

                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        value={newAddress.country}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            country: e.target.value,
                          })
                        }
                        disabled
                      />
                    </div>

                    <div className="form-group checkbox-group">
                      <input
                        type="checkbox"
                        id="defaultAddress"
                        checked={newAddress.isDefault}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            isDefault: e.target.checked,
                          })
                        }
                      />
                      <label htmlFor="defaultAddress">
                        Set as default address
                      </label>
                    </div>
                  </div>

                  <button
                    className="btn-luxury"
                    onClick={handleAddAddress}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Address"}
                  </button>
                </div>
              </div>

              <div className="step-actions">
                <button
                  className="btn-next"
                  onClick={() => setStep(2)}
                  disabled={!selectedAddress}
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="checkout-step">
              <h2>Payment Method</h2>

              <div className="payment-methods">
                <div
                  className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <div className="payment-option-header">
                    <span className="payment-icon">💵</span>
                    <div>
                      <h3>Cash on Delivery</h3>
                      <p>Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="payment-option-details">
                    <p>• No extra charges</p>
                    <p>• Pay cash to delivery person</p>
                    <p>• Available for all orders</p>
                  </div>
                </div>

                <div
                  className={`payment-option ${paymentMethod === "RAZORPAY" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("RAZORPAY")}
                >
                  <div className="payment-option-header">
                    <span className="payment-icon">💳</span>
                    <div>
                      <h3>Online Payment</h3>
                      <p>Pay securely with Razorpay</p>
                    </div>
                  </div>
                  <div className="payment-option-details">
                    <p>• Credit/Debit Cards</p>
                    <p>• Net Banking</p>
                    <p>• UPI & Wallets</p>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn-back" onClick={() => setStep(1)}>
                  ← Back to Address
                </button>
                <button
                  className="btn-next"
                  onClick={() => setStep(3)}
                  disabled={!paymentMethod}
                >
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Order Review */}
          {step === 3 && (
            <div className="checkout-step">
              <h2>Review Your Order</h2>

              <div className="order-review">
                <div className="review-section">
                  <h3>Delivery Address</h3>
                  {selectedAddressObj ? (
                    <div className="review-address">
                      <h4>{selectedAddressObj.fullName}</h4>
                      <p>{selectedAddressObj.addressLine}</p>
                      <p>
                        {selectedAddressObj.city}, {selectedAddressObj.state} -{" "}
                        {selectedAddressObj.pinCode}
                      </p>
                      <p>📞 {selectedAddressObj.phone}</p>
                      <button className="change-btn" onClick={() => setStep(1)}>
                        Change
                      </button>
                    </div>
                  ) : (
                    <p>No address selected</p>
                  )}
                </div>

                <div className="review-section">
                  <h3>Payment Method</h3>
                  <div className="review-payment">
                    <p>
                      <strong>
                        {paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : "Online Payment (Razorpay)"}
                      </strong>
                    </p>
                    <button className="change-btn" onClick={() => setStep(2)}>
                      Change
                    </button>
                  </div>
                </div>

                <div className="review-section">
                  <h3>Order Items</h3>
                  <div className="review-items">
                    {orderSummary?.items?.map((item) => (
                      <div
                        key={item.cartItemId || item.productId}
                        className="review-item"
                      >
                        <img
                          src={
                            item.productImage ||
                            item.prodctImage ||
                            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"
                          }
                          alt={item.productName}
                        />
                        <div className="item-details">
                          <h4>{item.productName}</h4>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: {formatPrice(item.price)}</p>
                        </div>
                        <div className="item-total">
                          {formatPrice(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn-back" onClick={() => setStep(2)}>
                  ← Back to Payment
                </button>
                <button
                  className="btn-luxury place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={loading || !selectedAddress}
                >
                  {loading ? "Placing Order..." : "PLACE ORDER"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary-card">
            <h3>ORDER SUMMARY</h3>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(summary.subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span className={summary.shipping === 0 ? "free" : ""}>
                  {summary.shipping === 0
                    ? "FREE"
                    : formatPrice(summary.shipping)}
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total Amount</span>
                <span className="total-amount">
                  {formatPrice(summary.total)}
                </span>
              </div>
            </div>

            {summary.shipping > 0 && summary.subtotal < 1000 && (
              <div className="shipping-note">
                <span className="note-icon">🚚</span>
                Add ₹{(1000 - summary.subtotal).toFixed(2)} more for FREE
                shipping!
              </div>
            )}

            {orderSummary?.items && orderSummary.items.length > 0 && (
              <div className="cart-preview">
                <h4>Items ({orderSummary.items.length})</h4>
                {orderSummary.items.slice(0, 3).map((item) => (
                  <div key={item.cartItemId} className="preview-item">
                    <img
                      src={
                        item.productImage ||
                        item.prodctImage ||
                        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"
                      }
                      alt={item.productName}
                    />
                    <div>
                      <p className="item-name">{item.productName}</p>
                      <p className="item-quantity">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
                {orderSummary.items.length > 3 && (
                  <p className="more-items">
                    +{orderSummary.items.length - 3} more items
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

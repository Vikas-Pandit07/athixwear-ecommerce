import React from "react";
import "../assets/css/checkout.css";
import { useCheckout } from "../context/CheckoutContext";

const formatPrice = (price) => {
  if (!price) return "Rs 0";
  if (typeof price === "number") return `Rs ${price.toLocaleString("en-IN")}`;
  return price;
};

const CheckoutPage = () => {
  const {
    step,
    setStep,
    addresses,
    selectedAddress,
    setSelectedAddress,
    selectedAddressObj,
    newAddress,
    setNewAddress,
    paymentMethod,
    setPaymentMethod,
    loading,
    message,
    clearMessage,
    items,
    summary,
    handleAddAddress,
    handlePlaceOrder,
  } = useCheckout();

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>CHECKOUT</h1>
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <span className="step-number">1</span>
            <span className="step-label">Address</span>
          </div>
          <div className="step-divider" />
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
          <div className="step-divider" />
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirm</span>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`checkout-message ${message.type}`}>
          {message.text}
          <button className="message-close" onClick={clearMessage}>
            x
          </button>
        </div>
      )}

      <div className="checkout-container">
        <div className="checkout-main">
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
                          <p>Phone: {address.phone}</p>
                          <div className="address-actions">
                            <span className="select-btn">
                              {selectedAddress === addressId ? "Selected" : "Select"}
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
                            phone: e.target.value.replace(/\D/g, "").slice(0, 10),
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
                            pinCode: e.target.value.replace(/\D/g, "").slice(0, 6),
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
                      <label htmlFor="defaultAddress">Set as default address</label>
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
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-step">
              <h2>Payment Method</h2>

              <div className="payment-methods">
                <div
                  className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <div className="payment-option-header">
                    <span className="payment-icon">Cash</span>
                    <div>
                      <h3>Cash on Delivery</h3>
                      <p>Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="payment-option-details">
                    <p>No extra charges</p>
                    <p>Pay cash to delivery person</p>
                    <p>Available for all orders</p>
                  </div>
                </div>

                <div
                  className={`payment-option ${paymentMethod === "RAZORPAY" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("RAZORPAY")}
                >
                  <div className="payment-option-header">
                    <span className="payment-icon">Card</span>
                    <div>
                      <h3>Online Payment</h3>
                      <p>Pay securely with Razorpay</p>
                    </div>
                  </div>
                  <div className="payment-option-details">
                    <p>Credit/Debit Cards</p>
                    <p>Net Banking</p>
                    <p>UPI and Wallets</p>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn-back" onClick={() => setStep(1)}>
                  Back to Address
                </button>
                <button
                  className="btn-next"
                  onClick={() => setStep(3)}
                  disabled={!paymentMethod}
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

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
                        {selectedAddressObj.city}, {selectedAddressObj.state} - {" "}
                        {selectedAddressObj.pinCode}
                      </p>
                      <p>Phone: {selectedAddressObj.phone}</p>
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
                    {items?.map((item) => (
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
                        <div className="item-total">{formatPrice(item.totalPrice)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn-back" onClick={() => setStep(2)}>
                  Back to Payment
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
                  {summary.shipping === 0 ? "FREE" : formatPrice(summary.shipping)}
                </span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total">
                <span>Total Amount</span>
                <span className="total-amount">{formatPrice(summary.total)}</span>
              </div>
            </div>

            {summary.shipping > 0 && summary.subtotal < 1000 && (
              <div className="shipping-note">
                Add Rs {(1000 - summary.subtotal).toFixed(2)} more for FREE shipping.
              </div>
            )}

            {items && items.length > 0 && (
              <div className="cart-preview">
                <h4>Items ({items.length})</h4>
                {items.slice(0, 3).map((item) => (
                  <div key={item.cartItemId || item.productId} className="preview-item">
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
                        Qty: {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="more-items">+{items.length - 3} more items</p>
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

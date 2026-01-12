import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/checkout.css';

const CheckoutPage = () => {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirm
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    // API call to create order
    try {
      const response = await fetch('http://localhost:9090/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          shippingAddress: address,
          paymentMethod
        })
      });
      
      if (response.ok) {
        const order = await response.json();
        navigate(`/order-confirmation/${order.orderId}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span>1</span>
          <p>Shipping Address</p>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span>2</span>
          <p>Payment Method</p>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span>3</span>
          <p>Place Order</p>
        </div>
      </div>

      {/* Step 1: Address Form */}
      {step === 1 && (
        <div className="checkout-section">
          <h2>Shipping Address</h2>
          <form className="address-form">
            <input type="text" placeholder="Full Name" required />
            <input type="tel" placeholder="Phone Number" required />
            <textarea placeholder="Street Address" rows="3" required />
            <div className="form-row">
              <input type="text" placeholder="City" required />
              <input type="text" placeholder="State" required />
              <input type="text" placeholder="ZIP Code" required />
            </div>
            <button type="button" onClick={() => setStep(2)}>
              Continue to Payment
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Payment Selection */}
      {step === 2 && (
        <div className="checkout-section">
          <h2>Select Payment Method</h2>
          <div className="payment-options">
            <label>
              <input type="radio" name="payment" value="cod" checked />
              <span>Cash on Delivery</span>
            </label>
            <label>
              <input type="radio" name="payment" value="card" />
              <span>Credit/Debit Card</span>
            </label>
            <label>
              <input type="radio" name="payment" value="upi" />
              <span>UPI Payment</span>
            </label>
          </div>
          <button onClick={() => setStep(3)}>Review Order</button>
        </div>
      )}

      {/* Step 3: Order Summary */}
      {step === 3 && (
        <div className="checkout-section">
          <h2>Order Summary</h2>
          <div className="order-summary">
            {/* Show cart items, totals */}
          </div>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
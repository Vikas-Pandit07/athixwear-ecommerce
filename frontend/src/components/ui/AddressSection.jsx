import React, { useState, useEffect } from "react";
import "/src/assets/css/profile.css";

const AddressesSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Address form state
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:9090/api/user/addresses", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setAddresses(data.addresses || []);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to load addresses",
        });
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setMessage({ type: "error", text: "Error loading addresses" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate
    if (
      !addressForm.fullName.trim() ||
      !addressForm.phone ||
      !addressForm.addressLine.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.pinCode
    ) {
      setMessage({ type: "error", text: "Please fill all required fields" });
      return;
    }

    try {
      const response = await fetch("http://localhost:9090/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addressForm),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Address added successfully",
        });
        setAddressForm({
          fullName: "",
          phone: "",
          addressLine: "",
          city: "",
          state: "",
          pinCode: "",
          country: "India",
          isDefault: false,
        });
        setShowAddForm(false);
        fetchAddresses();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to add address",
        });
      }
    } catch (err) {
      console.error("Error adding address:", err);
      setMessage({ type: "error", text: "Error adding address" });
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `http://localhost:9090/api/user/addresses/${editingAddress.addressId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(addressForm),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Address updated successfully",
        });
        setEditingAddress(null);
        setAddressForm({
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
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update address",
        });
      }
    } catch (err) {
      console.error("Error updating address:", err);
      setMessage({ type: "error", text: "Error updating address" });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to remove this address?"))
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

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Address removed successfully",
        });
        fetchAddresses();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to remove address",
        });
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      setMessage({ type: "error", text: "Error removing address" });
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await fetch(
        `http://localhost:9090/api/user/addresses/${addressId}/default`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Default address updated",
        });
        fetchAddresses();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to set default address",
        });
      }
    } catch (err) {
      console.error("Error setting default address:", err);
      setMessage({ type: "error", text: "Error updating default address" });
    }
  };

  const startEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setAddressForm({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
      isDefault: false,
    });
  };

  if (loading) {
    return (
      <div className="loading-addresses">
        <div className="fashion-spinner small"></div>
        <p>Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="addresses-section">
      {message.text && (
        <div className={`address-message ${message.type}`}>{message.text}</div>
      )}

      {/* Add/Edit Address Form */}
      {showAddForm && (
        <div className="address-form-card">
          <h3>{editingAddress ? "Edit Address" : "Add New Address"}</h3>
          <form
            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
          >
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  placeholder="10-digit phone number"
                  maxLength="10"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Address Line *</label>
                <textarea
                  value={addressForm.addressLine}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      addressLine: e.target.value,
                    })
                  }
                  placeholder="House no., Building, Street, Area"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="form-group">
                <label>PIN Code *</label>
                <input
                  type="text"
                  value={addressForm.pinCode}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      pinCode: e.target.value.replace(/\D/g, "").slice(0, 6),
                    })
                  }
                  placeholder="6-digit PIN code"
                  maxLength="6"
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                />
                <label htmlFor="isDefault">Set as default address</label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-outline"
                onClick={cancelForm}
              >
                Cancel
              </button>
              <button type="submit" className="btn-luxury">
                {editingAddress ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      <div className="addresses-list">
        {addresses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <h3>No Addresses Saved</h3>
            <p>Add your shipping addresses for faster checkout.</p>
            {!showAddForm && (
              <button
                className="btn-luxury"
                onClick={() => setShowAddForm(true)}
              >
                ADD NEW ADDRESS
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="addresses-header">
              <h4>Your Addresses ({addresses.length})</h4>
              {!showAddForm && (
                <button
                  className="btn-primary"
                  onClick={() => setShowAddForm(true)}
                >
                  + Add New Address
                </button>
              )}
            </div>

            <div className="address-grid">
              {addresses.map((address) => (
                <div
                  key={address.addressId}
                  className={`address-card ${address.isDefault ? "default" : ""}`}
                >
                  {address.isDefault && (
                    <span className="default-badge">DEFAULT</span>
                  )}

                  <div className="address-content">
                    <h5>{address.fullName}</h5>
                    <p>{address.addressLine}</p>
                    <p>
                      {address.city}, {address.state} - {address.pinCode}
                    </p>
                    <p>{address.country}</p>
                    <p className="phone">📞 {address.phone}</p>
                  </div>

                  <div className="address-actions">
                    {!address.isDefault && (
                      <button
                        className="set-default-btn"
                        onClick={() => handleSetDefault(address.addressId)}
                      >
                        Set as Default
                      </button>
                    )}

                    <button
                      className="edit-btn"
                      onClick={() => startEditAddress(address)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteAddress(address.addressId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressesSection;

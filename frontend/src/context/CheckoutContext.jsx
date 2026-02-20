import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { createPaymentOrder, verifyPayment } from "../api/paymentService";
import {
  addUserAddress,
  deleteUserAddress,
  getUserAddresses,
} from "../api/addressService";
import { checkoutOrder } from "../api/orderService";
import { useCart } from "./CartContext";

const CheckoutContext = createContext(null);

const INITIAL_ADDRESS = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pinCode: "",
  country: "India",
  isDefault: false,
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const getAddressId = (address) => address?.addressId || address?.id;

export const CheckoutProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState(INITIAL_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { items, subtotal, shipping, total } = useCart();
  const navigate = useNavigate();

  const summary = useMemo(
    () => ({
      subtotal,
      shipping,
      total,
    }),
    [subtotal, shipping, total],
  );

  const selectedAddressObj = useMemo(
    () =>
      addresses.find((addr) => {
        const id = getAddressId(addr);
        return id === selectedAddress;
      }) || null,
    [addresses, selectedAddress],
  );

  const clearMessage = () => setMessage({ type: "", text: "" });

  const fetchAddresses = async () => {
    try {
      const data = await getUserAddresses();
      if (!data.success) {
        setMessage({
          type: "error",
          text: data.error || "Failed to load addresses",
        });
        return;
      }

      const addressesData = data.addresses || [];
      setAddresses(addressesData);

      if (addressesData.length > 0 && !selectedAddress) {
        const defaultAddress = addressesData.find(
          (addr) => addr.isDefault || addr.default,
        );
        const firstAddress = defaultAddress || addressesData[0];
        setSelectedAddress(getAddressId(firstAddress));
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setMessage({ type: "error", text: "Failed to load addresses" });
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const validateAddress = () => {
    if (!newAddress.fullName.trim()) return "Please enter full name";
    if (!newAddress.phone.match(/^\d{10}$/)) {
      return "Please enter valid 10-digit phone number";
    }
    if (!newAddress.addressLine.trim()) return "Please enter address";
    if (!newAddress.city.trim()) return "Please enter city";
    if (!newAddress.state.trim()) return "Please enter state";
    if (!newAddress.pinCode.match(/^\d{6}$/)) {
      return "Please enter valid 6-digit PIN code";
    }
    return null;
  };

  const handleAddAddress = async () => {
    const validationError = validateAddress();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    try {
      setLoading(true);
      const data = await addUserAddress(newAddress);

      if (!data.success) {
        setMessage({
          type: "error",
          text: data.error || data.message || "Failed to add address",
        });
        return;
      }

      setMessage({
        type: "success",
        text: data.message || "Address added successfully",
      });
      setNewAddress(INITIAL_ADDRESS);
      await fetchAddresses();
      setTimeout(clearMessage, 3000);
    } catch (err) {
      console.error("Error adding address:", err);
      setMessage({
        type: "error",
        text: err.message || "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorpayPayment = async (internalOrderId) => {
    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      setLoading(false);
      setMessage({
        type: "error",
        text: "Unable to load payment gateway. Please try again.",
      });
      return;
    }

    try {
      const paymentOrder = await createPaymentOrder(internalOrderId);

      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency || "INR",
        name: "AthixWear",
        description: `Order #${paymentOrder.internalOrderId}`,
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: selectedAddressObj?.fullName || "",
          contact: selectedAddressObj?.phone || "",
        },
        theme: {
          color: "#111111",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setMessage({
              type: "error",
              text: "Payment cancelled. You can retry your payment.",
            });
          },
        },
        handler: async (razorpayResponse) => {
          try {
            const verifyResult = await verifyPayment({
              internalOrderId: paymentOrder.internalOrderId,
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
            });

            if (verifyResult.verified) {
              setMessage({
                type: "success",
                text: verifyResult.message || "Payment verified successfully",
              });
              setTimeout(() => {
                navigate(`/order-confirmation/${paymentOrder.internalOrderId}`);
              }, 800);
            } else {
              setMessage({
                type: "error",
                text: verifyResult.message || "Payment verification failed",
              });
            }
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            setMessage({
              type: "error",
              text:
                verifyError.message ||
                "Payment verification failed. Please contact support.",
            });
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setLoading(false);
        setMessage({
          type: "error",
          text:
            response?.error?.description ||
            "Payment failed. Please retry your payment.",
        });
      });

      razorpay.open();
      setLoading(false);
    } catch (paymentError) {
      console.error("Payment initialization error:", paymentError);
      setLoading(false);
      setMessage({
        type: "error",
        text: paymentError.message || "Failed to initialize payment",
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setMessage({ type: "error", text: "Please select a delivery address" });
      return;
    }

    if (!items || items.length === 0) {
      setMessage({ type: "error", text: "Your cart is empty" });
      return;
    }

    try {
      setLoading(true);
      const data = await checkoutOrder({
        addressId: selectedAddress,
        paymentMethod,
      });

      if (!data.orderId) {
        setMessage({
          type: "error",
          text: data.error || data.message || "Failed to place order",
        });
        return;
      }

      if (paymentMethod === "COD") {
        setMessage({
          type: "success",
          text: data.message || "Order placed successfully!",
        });

        setTimeout(() => {
          navigate(`/order-confirmation/${data.orderId}`);
        }, 1000);
        return;
      }

      await initiateRazorpayPayment(data.orderId);
    } catch (err) {
      console.error("Error placing order:", err);
      setMessage({
        type: "error",
        text: err.message || "Network error. Please try again.",
      });
    } finally {
      if (paymentMethod === "COD") {
        setLoading(false);
      }
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const data = await deleteUserAddress(addressId);
      if (!data.success) {
        setMessage({
          type: "error",
          text: data.error || "Failed to delete address",
        });
        return;
      }

      setMessage({
        type: "success",
        text: data.message || "Address deleted successfully",
      });

      await fetchAddresses();

      if (selectedAddress === addressId) {
        setSelectedAddress((prevSelected) => {
          if (prevSelected !== addressId) {
            return prevSelected;
          }

          const remaining = addresses.filter((a) => getAddressId(a) !== addressId);
          return remaining.length > 0 ? getAddressId(remaining[0]) : null;
        });
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to delete address",
      });
    }
  };

  const value = {
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
    setMessage,
    clearMessage,
    items,
    summary,
    handleAddAddress,
    handleDeleteAddress,
    handlePlaceOrder,
  };

  return (
    <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used inside CheckoutProvider");
  }
  return context;
};

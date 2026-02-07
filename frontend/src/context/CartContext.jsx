import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../services/cartService";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const FREE_SHIPPING_MIN = 1000;
  const SHIPPING_FEE = 50;

  const [cart, setCart] = useState({
    items: [],
    itemCount: 0,
    totalAmount: 0,
    loading: true,
  });

  const calculateTotals = (items = []) => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.totalPrice || 0),
      0,
    );

    const shipping =
      subtotal >= FREE_SHIPPING_MIN || items.length === 0 ? 0 : SHIPPING_FEE;

    const total = subtotal + shipping;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      shipping,
      total,
      itemCount,
    };
  };

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
        itemCount: 0,
        totalAmount: 0,
        loading: false,
      });
      return;
    }

    try {
      const data = await getCart();

      if (data.success) {
        const totals = calculateTotals(data.items);
        setCart({
          items: data.items,
          ...totals,
          loading: false,
        });
      } else {
        setCart((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      setCart((prev) => ({ ...prev, loading: false }));
    }
  }, [isAuthenticated]);

  const addItem = async (productId, quantity = 1) => {
    await addToCart({ productId, quantity });
    await refreshCart();
  };

  const updateItem = async (itemId, quantity) => {
    try {
      setUpdatingItemId(itemId);
      await updateCartItemQuantity({ itemId, quantity });
      await refreshCart();
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdatingItemId(itemId);
      await removeCartItem(itemId);
      await refreshCart();
    } finally {
      setUpdatingItemId(null);
    }
  };

  const clearAll = async () => {
    await clearCart();
    await refreshCart();
  };

  const {
    items = [],
    itemCount = 0,
    subtotal = 0,
    shipping = 0,
    total = 0,
    loading = false,
  } = cart;

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    const handleCartUpdated = () => {
      refreshCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        total,
        loading,
        updatingItemId,
        addItem,
        updateItem,
        removeItem,
        clearAll,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};

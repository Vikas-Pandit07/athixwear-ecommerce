import { createContext, useCallback, useContext, useEffect, useState } from "react";
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

  const [cart, setCart] = useState({
    items: [],
    itemCount: 0,
    totalAmount: 0,
    loading: true,
  });

  const calculateTotals = (items = []) => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = items.reduce(
      (sum, i) => sum + Number(i.totalPrice || 0),
      0,
    );
    return { itemCount, totalAmount };
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
    await updateCartItemQuantity({ itemId, quantity });
    await refreshCart();
  };

  const removeItem = async (itemId) => {
    await removeCartItem(itemId);
    await refreshCart();
  };

  const clearAll = async () => {
    await clearCart();
    await refreshCart();
  };

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
        ...cart,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clearAll,
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
}

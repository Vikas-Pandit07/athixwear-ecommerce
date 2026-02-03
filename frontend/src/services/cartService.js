import { apiRequest } from "./appClient";

// get full cart summary
export const getCart = async () => {
  return await apiRequest("/api/cart");
};

// add items to cart
export const addToCart = async ({ productId, quantity }) => {
  return await apiRequest("/api/cart/items", {
    method: "POST",
    body: { productId, quantity },
  });
};

// update cart item quantity
export const updateCartQuantity = async ({ itemId, quantity }) => {
  return await apiRequest(`/api/cart/items/${itemId}`, {
    method: "PUT",
    body: { quantity },
  });
};

// remove item
export const removeCartItem = async (itemId) => {
  return await apiRequest(`/api/cart/items/${itemId}`, {
    method: "DELETE",
  });
};

// clear entire cart
export const clearCart = async () => {
  return await apiRequest("/api/cart/", {
    method: "DELETE",
  });
};

// cart badge count
export const getCartCount = async () => {
  return await apiRequest("/api/cart/count");
};

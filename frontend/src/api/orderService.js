import { apiRequest } from "./apiClient";

export const checkoutOrder = async ({ addressId, paymentMethod }) => {
  return await apiRequest("/api/orders/checkout", {
    method: "POST",
    body: { addressId, paymentMethod },
  });
};

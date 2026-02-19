import { apiRequest } from "./apiClient";

export const createPaymentOrder = async (internalOrderId) => {
  return await apiRequest("/api/payments/create-order", {
    method: "POST",
    body: { orderId: internalOrderId },
  });
};

export const verifyPayment = async (verifyPayload) => {
  return await apiRequest("/api/payments/verify", {
    method: "POST",
    body: verifyPayload,
  });
};

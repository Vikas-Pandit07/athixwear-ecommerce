import { apiRequest } from "./apiClient";

export const getUserAddresses = async () => {
  return await apiRequest("/api/user/addresses");
};

export const addUserAddress = async (payload) => {
  return await apiRequest("/api/user/addresses", {
    method: "POST",
    body: payload,
  });
};

export const deleteUserAddress = async (addressId) => {
  return await apiRequest(`/api/user/addresses/${addressId}`, {
    method: "DELETE",
  });
};

import { apiRequest } from "./apiClient";

// get all products by category
export const getAllProducts = async ({ category } = {}) => {
  let url = "/api/products";

  if (category && category !== "All") {
    url += `?category=${encodeURIComponent(category)}`;
  }

  return await apiRequest(url, {
    method: "GET",
  });
};

// get product by ID
export const getProductById = async (productId) => {
  return await apiRequest(`/api/products/${productId}`, {
    method: "GET",
  });
};

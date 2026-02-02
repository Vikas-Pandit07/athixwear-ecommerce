import { apiRequest } from "./appClient";
import { forgotPassword } from "./authService";

// Login User
export const loginUser = async (loginData) => {
  // loginData = {usernameOrEmail, password}

  return await apiRequest("/api/auth/login", {
    method: "POST",
    body: loginData,
  });
};

// Register User
export const registerUser = async (registerdata) => {
  // registerData = {username, email, password}

  return await apiRequest("/api/auth/register", {
    method: "POST",
    body: registerdata,
  });
};

// Logout User
export const logoutUser = async () => {
  return await apiRequest("/api/auth/logout", {
    method: "POST",
  });
};

// Verify authentication JWT cookie based
export const verifyAuth = async () => {
  return await apiRequest("/api/auth/verify");
};

// Forgot Password
export const forgotPassword = async (email) => {
  // email = string

  return await apiRequest("/api/auth/forgot-password", {
    method: "POST",
    body: email,
  });
};

// Reset Password
export const resetPassword = async (resetData) => {
  // resetData = {newToken, newPassword, confirmPassword}

  return await apiRequest("/api/auth/reset-password", {
    method: "POST",
    body: resetData,
  });
};

import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import ResetPassword from "../pages/authentication/ResetPassword";
import Dashboard from "../pages/Dashboard";
import ProductsPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import CheckoutPage from "../pages/CheckoutPage";
import OrderConfirmation from "../pages/OrderConfirmation";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import AdminCategories from "../pages/AdminCategories";
import AdminDashboard from "../pages/AdminDashboard";
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/products" element={<ProductsPage />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin"
      element={
        <ProtectedRoute requireAdmin={true}>
          <Navigate to="/admin/dashboard" replace />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />

    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/order-confirmation/:orderId"
      element={
        <ProtectedRoute>
          <OrderConfirmation />
        </ProtectedRoute>
      }
    />

    <Route
      path="/product/:productId"
      element={
        <ProtectedRoute>
          <ProductDetailsPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/categories"
      element={
        <ProtectedRoute requireAdmin={true}>
          <AdminCategories />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;

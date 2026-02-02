import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import ProductsPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import CheckoutPage from "../pages/CheckoutPage";
import OrderConfirmation from "./../pages/OrderConfirmation";
import ProductDetails from "../pages/ProductDetailsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import AdminCategories from "../pages/AdminCategories";

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
        <ProtectedRoute>
          <AdminCategories/>
        </ProtectedRoute>
      }
      />
  </Routes>
);

export default AppRoutes;

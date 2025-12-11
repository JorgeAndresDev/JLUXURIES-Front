import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../routes/ProtectedRoute";
import RoleBasedRoute from "../routes/RoleBasedRoute";
import MainLayout from '../layouts/MainLayout';

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Cart from "../pages/cart/Cart";
import Profile from '../pages/user/Profile';
import AdminProducts from "../pages/admin/products/AdminProducts";

import CreateProductPage from "../pages/admin/products/CreateProductPage";
import EditProductPage from "../pages/admin/products/EditProductPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";

import AdminClients from "../pages/admin/clients/AdminClients";
import CreateClientPage from "../pages/admin/clients/CreateClientPage";
import EditClientPage from "../pages/admin/clients/EditClientPage";
import ClientDetailPage from "../pages/admin/clients/ClientDetailPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AuditLogs from "../pages/admin/audit/AuditLogs";
import ProductsPage from "../pages/products/ProductsPage";
import UserAuditLogs from "../pages/admin/audit/UserAuditLogs";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes - No Layout (Login/Register) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes - Protected by Role */}
          <Route element={<RoleBasedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/create-product" element={<CreateProductPage />} />
            <Route path="/admin/edit-product/:id" element={<EditProductPage />} />
            <Route path="/admin/product/:id" element={<ProductDetailPage />} />

            {/* Admin Clients Routes */}
            <Route path="/admin/clients" element={<AdminClients />} />
            <Route path="/admin/create-client" element={<CreateClientPage />} />
            <Route path="/admin/edit-client/:id" element={<EditClientPage />} />
            <Route path="/admin/client/:id" element={<ClientDetailPage />} />

            {/* Admin Audit Logs Route */}
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/audit-logs/user/:userId" element={<UserAuditLogs />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;

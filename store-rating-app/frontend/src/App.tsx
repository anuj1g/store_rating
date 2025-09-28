import { Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { ROUTES } from './config/app';
import Layout from './layouts/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import type { UserRole } from './types';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const StoresPage = lazy(() => import('./pages/stores/StoresPage'));
const StoreDetailPage = lazy(() => import('./pages/stores/StoreDetailPage'));
const CreateStorePage = lazy(() => import('./pages/stores/CreateStorePage'));
const EditStorePage = lazy(() => import('./pages/stores/EditStorePage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminStoresPage = lazy(() => import('./pages/admin/AdminStoresPage'));
const OwnerDashboardPage = lazy(() => import('./pages/owner/OwnerDashboardPage'));
const OwnerStoresPage = lazy(() => import('./pages/owner/OwnerStoresPage'));
const OwnerReviewsPage = lazy(() => import('./pages/owner/OwnerReviewsPage'));
const NotFoundPage = lazy(() => import('./pages/error/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/error/UnauthorizedPage'));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      }
    >
      <Routes>
          {/* Public Routes (restricted for authenticated users) */}
          <Route element={<PublicRoute restricted />}> 
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={`${ROUTES.RESET_PASSWORD}/:token`} element={<ResetPasswordPage />} />
          </Route>

          {/* Protected + Layout */}
          <Route element={<Layout />}>
            {/* Common User Routes */}
            <Route element={<ProtectedRoute allowedRoles={["user" as UserRole, "owner" as UserRole, "admin" as UserRole]} />}>
              <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.STORES.LIST} element={<StoresPage />} />
              <Route path={ROUTES.STORES.DETAIL()} element={<StoreDetailPage />} />
            </Route>

            {/* Store Owner Routes */}
            <Route element={<ProtectedRoute allowedRoles={["owner" as UserRole, "admin" as UserRole]} />}>
              <Route path={ROUTES.STORES.CREATE} element={<CreateStorePage />} />
              <Route path={ROUTES.STORES.EDIT()} element={<EditStorePage />} />
              <Route path={ROUTES.OWNER.DASHBOARD} element={<OwnerDashboardPage />} />
              <Route path={ROUTES.OWNER.STORES} element={<OwnerStoresPage />} />
              <Route path={ROUTES.OWNER.REVIEWS} element={<OwnerReviewsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin" as UserRole]} />}>
              <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboardPage />} />
              <Route path={ROUTES.ADMIN.USERS} element={<AdminUsersPage />} />
              <Route path={ROUTES.ADMIN.STORES} element={<AdminStoresPage />} />
            </Route>

            {/* Error Pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
      </Routes>
    </Suspense>
  );
}

export default App;

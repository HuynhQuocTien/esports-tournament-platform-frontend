// frontend/src/routers/AdminRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layouts/admin/AdminLayout";
import {
  AdminTournamentsPage,
  AdminTeamsPage,
  AdminRankingPage,
  AdminUsersPage,
  AdminPermissionsPage,
  AdminAnalyticsPage,
  AdminSettingsPage,
} from "../pages/admin";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { useAuth } from "@/hooks/useAuth";
import { Spin } from "antd";

export const AdminRouter = () => {
  const { user } = useAuth();
  
  // Nếu đang loading hoặc chưa xác định user
  if (user === undefined) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <Routes>
      <Route element={
        isAdmin 
          ? <AdminLayout />
          : <Navigate to="/" replace />
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="tournaments" element={<AdminTournamentsPage />} />
        <Route path="teams" element={<AdminTeamsPage />} />
        <Route path="ranking" element={<AdminRankingPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="permissions" element={<AdminPermissionsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};
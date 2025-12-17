import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layouts/admin/AdminLayout";
import {
  AdminRankingPage,
  AdminUsersPage,
  AdminNotificationsPage,
} from "../pages/admin";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { useAuth } from "@/hooks/useAuth";
import { Spin } from "antd";

export const AdminRouter = () => {
  const { user } = useAuth();
  
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
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="ranking" element={<AdminRankingPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
};
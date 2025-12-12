// frontend/src/routers/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRouter } from "./PublicRouter";
import { AdminRouter } from "./AdminRouter";
import LoginPage from "@/pages/auth/LoginPage";
import { useAuth } from "@/hooks/useAuth";
import { Spin } from "antd";

export const AppRouter = () => {
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

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/*" element={
        user?.role !== 'ADMIN' 
          ? <PublicRouter /> 
          : <Navigate to="/admin" replace />
      } />
      
      <Route path="/admin/*" element={<AdminRouter />} />
    </Routes>
  );
};
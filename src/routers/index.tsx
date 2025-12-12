// frontend/src/routers/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRouter } from "./PublicRouter";
import { AdminRouter } from "./AdminRouter";
import LoginPage from "@/pages/auth/LoginPage";
import { useAuth } from "@/hooks/useAuth";

export const AppRouter = () => {
  const { user } = useAuth();

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
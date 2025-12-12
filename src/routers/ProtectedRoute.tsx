import React, { type FC, type ReactElement, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import api from "@/services/api";

interface ProtectedRouteProps {
  children: ReactElement;
  requiredRole?: string[];
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = [] 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Kiểm tra token bằng cách gọi API lấy thông tin user
        const response = await api.get("/auth/me");
        const user = response.data.data;
        
        setIsAuthenticated(true);
        
        // Kiểm tra role nếu có yêu cầu
        if (requiredRole.length > 0) {
          const userRoles = user.roles || [];
          const hasRequiredRole = requiredRole.some(role => 
            userRoles.includes(role)
          );
          setIsAuthorized(hasRequiredRole);
        } else {
          setIsAuthorized(true);
        }
        
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_info");
        setIsAuthenticated(false);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole.length > 0 && !isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};
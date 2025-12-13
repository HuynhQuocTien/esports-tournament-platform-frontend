import React, { type FC, type ReactElement, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import api from "@/services/api";

interface ProtectedRouteProps {
  children: ReactElement;
  requiredRole?: string[];
  allowedRoles?: string[];
  excludedRoles?: string[];
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = [],
  allowedRoles = [],
  excludedRoles = []
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
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
        const response = await api.get("/auth/me");
        const user = response.data.data;
        const roles = user.roles || [user.role].filter(Boolean);
        
        setIsAuthenticated(true);
        setUserRole(user.role);
        
        if (requiredRole.length > 0) {
          const hasRequiredRole = requiredRole.some(role => 
            roles.includes(role)
          );
          setIsAuthorized(hasRequiredRole);
        } 
        else if (allowedRoles.length > 0) {
          const isAllowed = allowedRoles.some(role => roles.includes(role));
          setIsAuthorized(isAllowed);
        }
        else if (excludedRoles.length > 0) {
          const isExcluded = excludedRoles.some(role => roles.includes(role));
          setIsAuthorized(!isExcluded);
        }
        else {
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
  }, [requiredRole, allowedRoles, excludedRoles]);

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

  if (!isAuthorized) {
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
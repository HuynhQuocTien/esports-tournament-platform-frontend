import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface ProtectedLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  requireAuth?: boolean;
  authMessage?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const ProtectedLink: React.FC<ProtectedLinkProps> = ({
  to,
  children,
  className,
  style,
  requireAuth = true,
  authMessage,
  onClick,
}) => {
  const { isAuthenticated, requireAuth: requireLogin } = useAuthGuard();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick(e);
      return;
    }

    if (requireAuth && !isAuthenticated()) {
      requireLogin(() => {
        navigate(to);
      }, authMessage);
    } else {
      navigate(to);
    }
  };

  if (!requireAuth || isAuthenticated()) {
    return (
      <Link to={to} className={className} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={to}
      className={className}
      style={{ ...style, cursor: "pointer" }}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};
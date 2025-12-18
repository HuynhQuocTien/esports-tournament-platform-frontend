// frontend/src/components/common/ProtectedButton.tsx
import React from "react";
import { Button, type ButtonProps } from "antd";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface ProtectedButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => void;
  requireAuth?: boolean;
  authMessage?: string;
}

export const ProtectedButton: React.FC<ProtectedButtonProps> = ({
  onClick,
  requireAuth = true,
  authMessage = "Bạn cần đăng nhập để thực hiện hành động này",
  children,
  ...buttonProps
}) => {
  const { isAuthenticated, requireAuth: requireLogin } = useAuthGuard();

  const handleClick = () => {
    if (requireAuth && !isAuthenticated()) {
      requireLogin(() => {
        onClick();
      }, authMessage);
    } else {
      onClick();
    }
  };

  return (
    <Button {...buttonProps} onClick={handleClick}>
      {children}
    </Button>
  );
};
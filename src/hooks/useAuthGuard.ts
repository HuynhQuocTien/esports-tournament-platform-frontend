import { useState } from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

interface UseAuthGuardProps {
  redirectTo?: string;
}

export const useAuthGuard = ({ redirectTo = "/login" }: UseAuthGuardProps = {}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [actionCallback, setActionCallback] = useState<(() => void) | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    return !!token;
  };

  const requireAuth = (action: () => void, customMessage?: string) => {
    if (isAuthenticated()) {
      action();
    } else {
      setActionCallback(() => action);
      showLoginModal(customMessage);
    }
  };

  const showLoginModal = (customMessage?: string) => {
    Modal.confirm({
      title: "Yêu cầu đăng nhập",
      content: customMessage || "Bạn cần đăng nhập để thực hiện hành động này",
      okText: "Đăng nhập",
      cancelText: "Hủy",
      okType: "primary",
      centered: true,
      onOk: () => {
        const currentPath = window.location.pathname;
        localStorage.setItem("redirect_url", currentPath);
        navigate(redirectTo);
      },
      onCancel: () => {
        setActionCallback(null);
      },
    });
  };

  const handleContinueAfterLogin = () => {
    if (actionCallback && isAuthenticated()) {
      actionCallback();
      setActionCallback(null);
    }
  };

  return {
    isAuthenticated,
    requireAuth,
    handleContinueAfterLogin,
  };
};
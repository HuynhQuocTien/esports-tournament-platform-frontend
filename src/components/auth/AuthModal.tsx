import React, { useEffect, useState } from "react";
import { Modal, Card, Typography } from "antd";
import type { AuthStep } from "../../common/types/common";
import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
  SetupPasswordForm,
  VerifyOtpForm,
} from "./forms";

const { Title } = Typography;

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
  initialStep?: AuthStep;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  onLoginSuccess,
  initialStep = "login",
}) => {
  const [step, setStep] = useState<AuthStep>(initialStep);

  useEffect(() => {
    if (open) {
      setStep(initialStep);
    }
  }, [open, initialStep]);

  const getStepTitle = () => {
    const titles = {
      login: "Đăng nhập",
      register: "Đăng ký tài khoản",
      forgotPassword: "Quên mật khẩu",
      verifyOtp: "Xác minh OTP",
      setupPassword: "Đặt mật khẩu mới",
    };
    return titles[step];
  };

  const renderForm = () => {
    switch (step) {
      case "login":
        return (
          <LoginForm
            onSwitch={setStep}
            onClose={onClose}
            onLoginSuccess={onLoginSuccess}
          />
        );
      case "register":
        return <RegisterForm onSwitch={setStep} onClose={onClose} />;
      case "forgotPassword":
        return <ForgotPasswordForm onSwitch={setStep} />;
      case "verifyOtp":
        return <VerifyOtpForm onSwitch={setStep} />;
      case "setupPassword":
        return <SetupPasswordForm onSwitch={setStep} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      styles={{
        body: { padding: 0 },
      }}
      getContainer={false}
    >
      <Card
        bordered={false}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          borderRadius: 16,
        }}
        bodyStyle={{ padding: 32 }}
      >
        {/* Header with Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <img
              src="/logo-removebg.png"
              alt="ESports Arena Logo"
              style={{
                width: 48,
                height: 48,
                objectFit: "contain",
                marginRight: 12,
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Title
                level={2}
                style={{
                  color: "#722ed1",
                  fontWeight: "bold",
                  fontSize: 24,
                  letterSpacing: 0.5,
                  margin: 0,
                  background:
                    "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ESports Arena
              </Title>
            </div>
          </div>

          <Title level={3} style={{ margin: 0, color: "#1a1a1a" }}>
            {getStepTitle()}
          </Title>
          <p style={{ color: "#666", margin: "8px 0 0 0" }}>
            {step === "login" && "Chào mừng trở lại!"}
            {step === "register" && "Tham gia cộng đồng Esports"}
            {step === "forgotPassword" && "Khôi phục mật khẩu của bạn"}
            {step === "verifyOtp" && "Nhập mã xác minh từ email"}
            {step === "setupPassword" && "Tạo mật khẩu mới cho tài khoản"}
          </p>
        </div>

        {renderForm()}
      </Card>
    </Modal>
  );
};

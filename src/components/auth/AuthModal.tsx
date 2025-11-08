// frontend/src/components/auth/AuthModal.tsx
import React, { useState } from "react";
import { Modal } from "antd";
import type { AuthStep } from "../../common/types";
import { LoginForm } from "./forms/LoginForm";
import { RegisterForm } from "./forms/RegisterForm";
import ForgotPasswordForm from "./forms/ForgotPasswordForm";
import { VerifyOtpForm } from "./forms/VerifyOtpForm";
import { SetupPasswordForm } from "./forms/SetupPasswordForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<AuthStep>("login");

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
      getContainer={false}
    >
      {renderForm()}
    </Modal>
  );
};

export default AuthModal;

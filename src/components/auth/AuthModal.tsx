import React, { useState } from "react";
import { Modal } from "antd";
import type { AuthStep } from "../../types";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { VerifyOtpForm } from "./VerifyOtpForm";
import { SetupPasswordForm } from "./SetupPasswordForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState<AuthStep>("login");

  const renderForm = () => {
    switch (step) {
      case "login":
        return <LoginForm onSwitch={setStep} onClose={onClose} />;
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
      destroyOnClose
      centered
    >
      {renderForm()}
    </Modal>
  );
};

export default AuthModal;

import React, { useEffect, useState } from "react";
import { Card, Typography, Divider, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AuthStep } from "../../common/types";
import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
  SetupPasswordForm,
  VerifyOtpForm,
} from "../../components/auth/forms";
import type { LoginResponse } from "../../common/interfaces/auth";
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import type { JwtPayload } from "@/common/interfaces/payload/jwt-payload";
import { jwtDecode } from "jwt-decode";
import { handleOAuthCallback } from "@/services/authService";

const { Title } = Typography;

interface LoginPageProps {
  initialStep?: AuthStep;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialStep = "login",
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<AuthStep>(initialStep);
  const { user, refetchUser } = useAuth();
  useEffect(() => {
    const checkOAuthCallback = async () => {
      const code = searchParams.get("code");
      if (code && !user) {
        try {
          await handleOAuthCallback();
          await refetchUser();
          message.success("Đăng nhập thành công!");
          navigate("/", { replace: true });
        } catch (error) {
          console.error("OAuth callback error:", error);
        }
      }
    };

    checkOAuthCallback();
  }, [searchParams, user, navigate, refetchUser]);

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") navigate("/admin", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    const stepParam = searchParams.get("step") as AuthStep;
    if (stepParam) {
      setStep(stepParam);
    }
  }, [searchParams]);

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

  const handleLoginSuccess = (response: LoginResponse) => {
    const { access_token } = response;
    const decoded = jwtDecode<JwtPayload>(access_token);
    const role = decoded.role;
    message.success("Đăng nhập thành công!");

    if (role === "ADMIN") navigate("/admin", { replace: true });
    else navigate("/", { replace: true });
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const redirectUri = encodeURIComponent(`${window.location.origin}/login`);
    let authUrl = `${baseUrl}/auth/${provider}`;
    
    if (provider === 'google') {
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;
    } else if (provider === 'github') {
      authUrl = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
    }
    
    window.location.href = authUrl;
  };

  const renderForm = () => {
    switch (step) {
      case "login":
        return (
          <LoginForm
            onSwitch={setStep}
            onClose={handleClose}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case "register":
        return <RegisterForm onSwitch={setStep} onClose={handleClose} />;
      case "forgotPassword":
        return <ForgotPasswordForm onSwitch={setStep} onClose={handleClose} />;
      case "verifyOtp":
        return <VerifyOtpForm onSwitch={setStep} onClose={handleClose} />;
      case "setupPassword":
        return <SetupPasswordForm onSwitch={setStep} onClose={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
        bodyStyle={{ padding: 48 }}
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

        {/* Social Login Buttons - Only show on login step */}
        {step === "login" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <button
                onClick={() => handleSocialLogin("google")}
                style={{
                  width: "100%",
                  height: 48,
                  border: "1px solid #d9d9d9",
                  borderRadius: 8,
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  marginBottom: 12,
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#722ed1";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(114, 46, 209, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#d9d9d9";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <GoogleOutlined style={{ color: "#db4437", fontSize: 16 }} />
                Đăng nhập với Google
              </button>

              <button
                onClick={() => handleSocialLogin("github")}
                style={{
                  width: "100%",
                  height: 48,
                  border: "1px solid #d9d9d9",
                  borderRadius: 8,
                  background: "#000",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#333";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#000";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <GithubOutlined style={{ color: "#fff", fontSize: 16 }} />
                Đăng nhập với GitHub
              </button>
            </div>

            <Divider style={{ margin: "20px 0", color: "#d9d9d9" }}>
              <span
                style={{
                  background: "#f8f9fa",
                  padding: "0 16px",
                  color: "#666",
                }}
              >
                Hoặc
              </span>
            </Divider>
          </>
        )}

        {renderForm()}
      </Card>
    </div>
  );
};

export default LoginPage;

import React, { useRef, useState } from "react";
import { Button, Form, Input, Typography, message, Divider } from "antd";
import { login } from "../../../services/authService";
import type { AxiosError } from "axios";
import type { AuthStep } from "../../../common/types";
import type {
  LoginRequest,
  LoginResponse,
} from "../../../common/interfaces/auth";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
  onLoginSuccess: (token: LoginResponse) => void;
}

export const LoginForm: React.FC<Props> = ({
  onSwitch,
  onClose,
  onLoginSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<LoginRequest>();

   const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const onFinish = async (values: LoginRequest) => {
    try {
      setLoading(true);
      const response: LoginResponse = await login(values);
      const token = response.access_token;

      if (!token) throw new Error("Không nhận được token từ máy chủ!");

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      message.success("Đăng nhập thành công!");
      onLoginSuccess(response);
      handleClose();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || "Đăng nhập thất bại!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#722ed1" }} />}
            placeholder="Email"
            style={{ borderRadius: 8, height: 48 }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#722ed1" }} />}
            placeholder="Mật khẩu"
            style={{ borderRadius: 8, height: 48 }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{
              height: 48,
              borderRadius: 8,
              background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
              border: "none",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Text
          style={{
            color: "#722ed1",
            cursor: "pointer",
            fontWeight: 500,
          }}
          onClick={() => onSwitch("forgotPassword")}
        >
          Quên mật khẩu?
        </Text>
      </div>

      <Divider style={{ margin: "20px 0", color: "#d9d9d9" }}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Hoặc
        </Text>
      </Divider>

      <div style={{ textAlign: "center" }}>
        <Text style={{ color: "#666", marginRight: 8 }}>
          Chưa có tài khoản?
        </Text>
        <Text
          style={{
            color: "#722ed1",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => onSwitch("register")}
        >
          Đăng ký ngay
        </Text>
      </div>
    </div>
  );
};

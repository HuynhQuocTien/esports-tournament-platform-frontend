import React, { useState } from "react";
import { Button, Form, Input, Typography, message, Divider } from "antd";
import { register } from "../../../services/authService";
import type { AxiosError } from "axios";
import type { AuthStep } from "../../../common/types";
import type { RegisterRequest } from "../../../common/interfaces/auth";
import { MailOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterRequest) => {
    try {
      setLoading(true);
      await register(values);
      message.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để nhận OTP.",
      );
      onSwitch("verifyOtp");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || "Đăng ký thất bại!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form layout="vertical" onFinish={onFinish} size="large">
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
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#722ed1" }} />}
            placeholder="Tên hiển thị"
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
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: "20px 0", color: "#d9d9d9" }}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Hoặc
        </Text>
      </Divider>

      <div style={{ textAlign: "center" }}>
        <Text style={{ color: "#666", marginRight: 8 }}>Đã có tài khoản?</Text>
        <Text
          style={{
            color: "#722ed1",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => onSwitch("login")}
        >
          Đăng nhập ngay
        </Text>
      </div>
    </div>
  );
};

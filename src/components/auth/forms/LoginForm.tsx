import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import type { AuthStep, Login } from "../../../common/types";
import { login } from "../../../services/auth";
import type { AxiosError } from "axios";

const { Title, Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const LoginForm: React.FC<Props> = ({
  onSwitch,
  onClose,
  onLoginSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Login) => {
    try {
      setLoading(true);
      const response = await login(values);
      const token = response.access_token;

      if (!token) throw new Error("Không nhận được token từ máy chủ!");
      message.success("Đăng nhập thành công!");
      onLoginSuccess(token);
      onClose();
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
      <Title level={3}>Đăng nhập</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <Text type="secondary" onClick={() => onSwitch("forgotPassword")}>
        Quên mật khẩu?
      </Text>
      <br />
      <Text>
        Chưa có tài khoản?{" "}
        <a onClick={() => onSwitch("register")}>Đăng ký ngay</a>
      </Text>
    </div>
  );
};

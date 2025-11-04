import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import type { AuthStep, Register } from "../../../types";
import { register } from "../../../services/auth";
import type { AxiosError } from "axios";

const { Title, Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Register) => {
    try {
      setLoading(true);
      await register(values);
      message.success("Đăng ký thành công! Vui lòng kiểm tra email để nhận OTP.");
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
      <Title level={3}>Đăng ký</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          name="username"
          label="Tên hiển thị"
          rules={[{ required: true }]}
        >
          <Input placeholder="Nhập tên hiển thị" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <Text>
        Đã có tài khoản? <a onClick={() => onSwitch("login")}>Đăng nhập</a>
      </Text>
    </div>
  );
};

import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import type { AuthStep, Forgot } from "../../../common/types";
import { forgotPassword } from "../../../services/auth";
import type { AxiosError } from "axios";

const { Title, Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
}

const ForgotPasswordForm: React.FC<Props> = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Forgot) => {
    try {
      setLoading(true);
      await forgotPassword(values);
      message.success("Đã gửi mã OTP qua email!");
      onSwitch("verifyOtp");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || "Gửi OTP thất bại!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={3}>Quên mật khẩu</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Gửi OTP
          </Button>
        </Form.Item>
      </Form>

      <Text>
        Quay lại <a onClick={() => onSwitch("login")}>Đăng nhập</a>
      </Text>
    </div>
  );
};

export default ForgotPasswordForm;

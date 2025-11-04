import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import type { AuthStep } from "../../../types";
import { verifyOTP } from "../../../services/auth";

const { Title } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
}

export const VerifyOtpForm: React.FC<Props> = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await verifyOTP(values.email, values.otp);
      message.success("Xác minh OTP thành công!");
      onSwitch("setupPassword");
    } catch (error: any) {
      message.error(error.response?.data?.message || "OTP không hợp lệ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={3}>Xác minh OTP</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="otp" label="Mã OTP" rules={[{ required: true }]}>
          <Input placeholder="Nhập OTP" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Xác minh
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

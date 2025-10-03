import React from "react";
import { Button, Form, Input, Typography } from "antd";
import type { AuthStep } from "../../types";

const { Title } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
}

export  const VerifyOtpForm: React.FC<Props> = ({ onSwitch }) => {
  const onFinish = (values: any) => {
    console.log("Verify OTP:", values);
    onSwitch("setupPassword");
  };

  return (
    <div>
      <Title level={3}>Xác minh OTP</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="otp" label="Mã OTP" rules={[{ required: true }]}>
          <Input placeholder="Nhập OTP" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Xác minh
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

import React from "react";
import { Button, Form, Input, Typography } from "antd";
import type { AuthStep } from "../../types";

const { Title, Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
}

const ForgotPasswordForm: React.FC<Props> = ({ onSwitch }) => {
  const onFinish = (values: any) => {
    console.log("Forgot password:", values);
    onSwitch("verifyOtp");
  };

  return (
    <div>
      <Title level={3}>Quên mật khẩu</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Gửi OTP
          </Button>
        </Form.Item>
      </Form>

      <Text>
        Quay lại{" "}
        <a onClick={() => onSwitch("login")}>Đăng nhập</a>
      </Text>
    </div>
  );
};

export default ForgotPasswordForm;

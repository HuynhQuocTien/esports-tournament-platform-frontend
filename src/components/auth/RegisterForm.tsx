import React from "react";
import { Button, Form, Input, Typography } from "antd";
import type { AuthStep } from "../../types";

const { Title, Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onSwitch, onClose }) => {
  const onFinish = (values: any) => {
    console.log("Register:", values);
    onSwitch("verifyOtp");
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
          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <Text>
        Đã có tài khoản?{" "}
        <a onClick={() => onSwitch("login")}>Đăng nhập</a>
      </Text>
    </div>
  );
};

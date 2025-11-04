import React from "react";
import { Button, Form, Input, Typography } from "antd";
import type { AuthStep } from "../../../types";
import { login } from "../../../api/auth";

const { Title, Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const LoginForm: React.FC<Props> = ({ onSwitch, onClose }) => {
  const onFinish = (values: any) => {
    console.log("Login:", values);
    onClose();
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
          <Button type="primary" htmlType="submit" block>
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

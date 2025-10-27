import React from "react";
import { Button, Form, Input, Typography } from "antd";
import type { AuthStep } from "../../../types";

const { Title } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const SetupPasswordForm: React.FC<Props> = ({ onClose }) => {
  const onFinish = (values: any) => {
    console.log("Setup password:", values);
    onClose();
  };

  return (
    <div>
      <Title level={3}>Đặt mật khẩu mới</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="password"
          label="Mật khẩu mới"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={["password"]}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu không khớp!");
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

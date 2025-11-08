import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import type { AuthStep } from "../../../common/types";
import { resetPassword } from "../../../services/authService";
const { Title } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const SetupPasswordForm: React.FC<Props> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await resetPassword(values.email, values.otp, values.password);
      message.success("Đặt mật khẩu mới thành công!");
      onClose();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Lỗi khi đặt mật khẩu!");
    } finally {
      setLoading(false);
    }
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
          <Button type="primary" htmlType="submit" block loading={loading}>
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

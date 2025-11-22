import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import type { ForgotRequest } from "../../../common/interfaces/auth";
import { forgotPassword } from "../../../services/authService";
import type { AxiosError } from "axios";
import type { AuthStep } from "../../../common/types";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const ForgotPasswordForm: React.FC<Props> = ({ onSwitch, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const onFinish = async (values: ForgotRequest) => {
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
      <div style={{ marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => onSwitch("login")}
          style={{ padding: 0, marginBottom: 16 }}
        >
          Quay lại
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#722ed1" }} />}
            placeholder="Nhập email của bạn"
            style={{ borderRadius: 8, height: 48 }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{
              height: 48,
              borderRadius: 8,
              background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
              border: "none",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Gửi mã OTP
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center" }}>
        <Text style={{ color: "#666" }}>
          Chúng tôi sẽ gửi mã xác minh đến email của bạn
        </Text>
      </div>
    </div>
  );
};

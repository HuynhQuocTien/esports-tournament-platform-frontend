import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { sendOtp } from "../../../services/authService";
import type { AxiosError } from "axios";
import type { AuthStep } from "../../../common/types";
import { MailOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const ForgotPasswordForm: React.FC<Props> = ({ onSwitch, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string }) => {
    try {
      setLoading(true);
      await sendOtp(values.email);
      message.success("Đã gửi OTP đến email của bạn!");
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
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#722ed1" }} />}
            placeholder="Email"
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
            Gửi OTP
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center" }}>
        <Text
          style={{
            color: "#722ed1",
            cursor: "pointer",
            fontWeight: 500,
          }}
          onClick={() => onSwitch("login")}
        >
          Quay lại đăng nhập
        </Text>
      </div>
    </div>
  );
};
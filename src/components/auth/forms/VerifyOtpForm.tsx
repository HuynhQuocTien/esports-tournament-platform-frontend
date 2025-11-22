import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { verifyOTP } from "../../../services/authService";
import type { AuthStep } from "../../../common/types";
import { KeyOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const VerifyOtpForm: React.FC<Props> = ({ onSwitch , onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };
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
      <div style={{ marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => onSwitch("forgotPassword")}
          style={{ padding: 0, marginBottom: 16 }}
        >
          Quay lại
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          name="otp"
          rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
        >
          <Input
            prefix={<KeyOutlined style={{ color: "#722ed1" }} />}
            placeholder="Nhập mã OTP 6 chữ số"
            style={{ borderRadius: 8, height: 48 }}
            maxLength={6}
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
            Xác minh OTP
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center" }}>
        <Text style={{ color: "#666" }}>
          Mã OTP đã được gửi đến email của bạn
        </Text>
      </div>
    </div>
  );
};

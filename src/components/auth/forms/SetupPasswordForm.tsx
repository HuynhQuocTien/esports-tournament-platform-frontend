import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { resetPassword } from "../../../services/authService";
import type { AuthStep } from "../../../common/types";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const SetupPasswordForm: React.FC<Props> = ({ onSwitch, onClose }) => {
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
      <div style={{ marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => onSwitch("verifyOtp")}
          style={{ padding: 0, marginBottom: 16 }}
        >
          Quay lại
        </Button>
      </div>

      <Form layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#722ed1" }} />}
            placeholder="Mật khẩu mới"
            style={{ borderRadius: 8, height: 48 }}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#722ed1" }} />}
            placeholder="Xác nhận mật khẩu"
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
            Đặt mật khẩu mới
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

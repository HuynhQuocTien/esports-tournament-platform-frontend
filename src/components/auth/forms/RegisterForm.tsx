import React, { useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  message,
  Divider,
  Select,
} from "antd";
import { register } from "../../../services/authService";
import type { AxiosError } from "axios";
import type { AuthStep } from "../../../common/types";
import type { RegisterRequest } from "../../../common/interfaces/auth";
import {
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface Props {
  onSwitch: (step: AuthStep) => void;
  onClose: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onSwitch, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const emailInputRef = useRef<any>(null);

   const handleClose = () => {
    form.resetFields();
    onClose();
  };
  const onFinish = async (values: RegisterRequest & { confirmPassword?: string }) => {
    try {
      setLoading(true);
      const { confirmPassword, ...payload } = values;
       const registerData: RegisterRequest = {
        email: payload.email,
        fullname: payload.fullname,
        password: payload.password,
        role: payload.role,
      };
      await register(payload);
      message.success("Đăng ký thành công!");
      onSwitch("login");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || "Đăng ký thất bại!";

      if (errorMessage.toLowerCase().includes("email")) {
        form.setFields([
          {
            name: "email",
            errors: [errorMessage],
          },
        ]);

        emailInputRef.current?.focus?.();
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        {/* Email */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input
            ref={emailInputRef}
            prefix={<MailOutlined style={{ color: "#722ed1" }} />}
            placeholder="Email"
            style={{ borderRadius: 8, height: 48 }}
          />
        </Form.Item>

        {/* Fullname */}
        <Form.Item
          name="fullname"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input
            prefix={<IdcardOutlined style={{ color: "#722ed1" }} />}
            placeholder="Họ và tên"
            style={{ borderRadius: 8, height: 48 }}
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải tối thiểu 6 ký tự!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#722ed1" }} />}
            placeholder="Mật khẩu"
            style={{ borderRadius: 8, height: 48 }}
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu nhập lại không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#722ed1" }} />}
            placeholder="Nhập lại mật khẩu"
            style={{ borderRadius: 8, height: 48 }}
          />
        </Form.Item>

        {/* User Type */}
        <Form.Item
          name="userType"
          rules={[{ required: true, message: "Vui lòng chọn loại tài khoản!" }]}
        >
          <Select
            placeholder="Chọn loại tài khoản"
            style={{ height: 48, borderRadius: 8 }}
            options={[
              { value: "TEAM_MANAGER", label: "Team Manager" },
              { value: "ORGANIZER", label: "Organizer" },
            ]}
          />
        </Form.Item>

        {/* Submit */}
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
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: "20px 0", color: "#d9d9d9" }}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Hoặc
        </Text>
      </Divider>

      <div style={{ textAlign: "center" }}>
        <Text style={{ color: "#666", marginRight: 8 }}>Đã có tài khoản?</Text>
        <Text
          style={{
            color: "#722ed1",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => onSwitch("login")}
        >
          Đăng nhập ngay
        </Text>
      </div>
    </div>
  );
};

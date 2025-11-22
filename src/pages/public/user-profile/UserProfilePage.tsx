import React, { use, useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Typography,
  Space,
  Avatar,
  Row,
  Col,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CameraOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  getProfile,
  uploadAvatar,
} from "@/services/authService";
import type { IProfile } from "@/common/interfaces/users";
import type { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import type { UserType } from "@/common/types";
import { URL_PUBLIC_IMG } from "@/services/api";

const { Title, Text } = Typography;

export const UserProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      let finalAvatarUrl = userInfo?.avatar;

      if (avatarFile) {
        try {
          message.loading({
            content: "Đang tải ảnh lên...",
            key: "avatarUpload",
            duration: 0,
          });
          const result = await uploadAvatar(avatarFile);
          finalAvatarUrl = result.avatarUrl;
          message.success({
            content: "Tải ảnh lên thành công!",
            key: "avatarUpload",
          });
          console.log("Avatar uploaded:", finalAvatarUrl);
        } catch (error) {
          console.error("Avatar upload error:", error);
          message.error({
            content: "Tải ảnh lên thất bại!",
            key: "avatarUpload",
          });
          return;
        }
      }

      const updateData: any = {
        fullname: values.fullname,
        email: values.email,
        phone: values.phone,
      };

      if (finalAvatarUrl && finalAvatarUrl !== userInfo?.avatar) {
        updateData.avatarUrl = finalAvatarUrl;
      }
      if (values.password) {
        updateData.password = values.password;
        updateData.oldPassword = values.oldPassword;
      }

      const freshUserData : IProfile = await getProfile();
      if (freshUserData) {
        const updatedProfile = {
          id: freshUserData.id,
          fullname: freshUserData.fullname ?? "",
          email: freshUserData.email,
          phone: freshUserData.phone ?? "",
          userType: freshUserData.userType,
          avatarUrl: freshUserData.avatar ?? "",
        };

        setUserInfo(updatedProfile);
        form.setFieldsValue(updatedProfile);

        if (freshUserData.avatar) {
          setAvatarUrl(freshUserData.avatar);
        }
      }

      setAvatarFile(null);

      // Cleanup blob URL nếu có
      if (avatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarUrl);
      }

      message.success({
        content: "Cập nhật thông tin thành công!",
        key: "profileUpdate",
      });
    } catch (err: any) {
      console.error(err);
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info: UploadChangeParam<UploadFile<any>>) => {
    console.log("Upload info:", info);

    const { file } = info;

    if (file.status === "uploading") {
      return;
    }

    if (file.status === "error") {
      message.error("Tải ảnh lên thất bại");
      return;
    }

    const selectedFile = file as unknown as File;
    console.log("Selected file (direct):", selectedFile);

    if (!selectedFile) {
      console.warn("No file found in upload info");
      message.error("Không thể đọc file ảnh!");
      return;
    }

    if (!selectedFile.type?.startsWith("image/")) {
      message.error("Vui lòng chọn file ảnh!");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      message.error("Kích thước ảnh không được vượt quá 5MB!");
      return;
    }

    setAvatarFile(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);
    setAvatarUrl(previewUrl);
  };

  const [userInfo, setUserInfo] = useState<IProfile>();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getProfile();
        if (!data) throw new Error("No profile data");

        const allowedUserTypes : UserType[] = ["ADMIN", "TEAM_MANAGER", "ORGANIZER"];
        const userType = allowedUserTypes.includes(data.userType as UserType)
          ? (data.userType as IProfile["userType"])
          : undefined;

        const profile : IProfile = {
          id: data.id,
          fullname: data.fullname ?? "",
          email: data.email,
          phone: data.phone ?? "",
          userType,
          avatar: data.avatar ?? "",
        };

        setUserInfo(profile);

        form.setFieldsValue(profile);

        if (profile.avatar) {
          setAvatarUrl(profile.avatar);
        }
      } catch (err) {
        message.error("Không thể tải thông tin người dùng");
      }
    };

    fetchMe();
  }, []);

  const beforeUpload = (file: RcFile) => {
    return false;
  };
  const getUserAvatar = () => {
    if (avatarUrl) return <Avatar size={120} src={ URL_PUBLIC_IMG +avatarUrl} />;
    
    const initial = (userInfo?.fullname?.charAt(0) ?? "U").toUpperCase();
    return (
      <Avatar
        size={120}
        style={{
          background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
          fontWeight: 600,
          fontSize: 48,
          lineHeight: "120px",
        }}
      >
        {initial}
      </Avatar>
    );
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Hồ sơ cá nhân
      </Title>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: "center", borderRadius: 12 }}>
            <div style={{ marginBottom: 16 }}>
              {/* <Avatar size={120} src={avatarUrl} icon={<UserOutlined />} /> */}
              {getUserAvatar()}
            </div>
            <Upload
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleAvatarChange}
              accept="image/*"
            >
              <Button icon={<CameraOutlined />}>
                {avatarFile ? "Đã chọn ảnh" : "Đổi ảnh đại diện"}
              </Button>
            </Upload>
            <Divider />
            <Text type="secondary">Chức năng đổi ảnh đại diện</Text>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Thông tin cá nhân</span>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                fullname: userInfo?.fullname ?? "",
                email: userInfo?.email ?? "",
                phone: userInfo?.phone ?? "",
                userType: userInfo?.userType ?? "",
                isActive:
                  typeof userInfo?.isActive === "boolean"
                    ? userInfo!.isActive
                    : true,
              }}
              onFinish={onFinish}
            >
              {/* Họ tên */}
              <Form.Item
                name="fullname"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
              </Form.Item>

              {/* Email */}
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>

              {/* Số điện thoại */}
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>

              {/* UserType (Enum) */}
              <Form.Item name="userType" label="Loại tài khoản">
                <select
                  style={{ width: "100%", padding: 8, borderRadius: 6 }}
                  disabled
                >
                  <option value="TEAM_MANAGER">Team Manager</option>
                  <option value="ORGANIZER">Organizer</option>
                </select>
              </Form.Item>

              {/* Mật khẩu mới (không bắt buộc) */}
              <Form.Item
                name="oldPassword"
                label="Mật khẩu hiện tại"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_: any, value: string) {
                      const newPwd = getFieldValue("password");
                      // Nếu không đổi mật khẩu thì không bắt nhập mật khẩu hiện tại
                      if (!newPwd) return Promise.resolve();
                      if (value) return Promise.resolve();
                      return Promise.reject(
                        new Error("Vui lòng nhập mật khẩu hiện tại!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu hiện tại" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu mới"
                rules={[
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Để trống nếu không muốn thay đổi" />
              </Form.Item>

              {/* Xác nhận mật khẩu */}
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_: any, value: string) {
                      const pwd = getFieldValue("password");
                      // nếu không nhập password thì không bắt xác nhận
                      if (!pwd && !value) {
                        return Promise.resolve();
                      }
                      if (pwd && value === pwd) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  block
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

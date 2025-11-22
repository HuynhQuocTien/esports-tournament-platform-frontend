import React, { useEffect, useState } from "react";
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
  updateProfile,
  uploadAvatar,
} from "@/services/authService";
import type { IProfile } from "@/common/interfaces/users";
import type { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import type { UserType } from "@/common/types";
import { URL_PUBLIC_IMG } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import type { ApiProfile } from "@/common/interfaces/auth";

const { Title, Text } = Typography;

export const UserProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { user, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState<IProfile>();

  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getProfile();
        if (!data) throw new Error("No profile data");

        const allowedUserTypes: UserType[] = [
          "ADMIN",
          "TEAM_MANAGER",
          "ORGANIZER",
        ];
        const userType = allowedUserTypes.includes(data.userType as UserType)
          ? (data.userType as IProfile["userType"])
          : undefined;

        const profile: IProfile = {
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
  }, [form]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      console.log("Form values:", values);
      message.loading({
        content: "Đang xử lý...",
        key: "profileUpdate",
        duration: 0,
      });

      let finalAvatarUrl = userInfo?.avatar;

      if (avatarFile) {
        try {
          const result = await uploadAvatar(avatarFile);
          finalAvatarUrl = result.avatarUrl;
          console.log("✅ New avatar URL from server:", finalAvatarUrl);
        } catch (error) {
          console.error("Avatar upload error:", error);
          message.error({
            content: "Tải ảnh lên thất bại!",
            key: "uploadStatus",
          });
          setLoading(false);
          return;
        }
      }

      const updateData: ApiProfile = {
        name: values.fullname,
        email: values.email,
        phone: values.phone,
        password: values.password || "",
      };

      if (finalAvatarUrl && finalAvatarUrl !== userInfo?.avatar) {
        updateData.avatarUrl = finalAvatarUrl;
      }
      if (values.password) {
        updateData.password = values.password;
      }

      const freshUserData: IProfile = await updateProfile(updateData);
      console.log("✅ Fresh user data from server:", freshUserData);

      if (freshUserData) {
        const updatedProfile = {
          id: freshUserData.id,
          fullname: freshUserData.fullname ?? "",
          email: freshUserData.email,
          phone: freshUserData.phone ?? "",
          userType: freshUserData.userType,
          avatar: freshUserData.avatar ?? "",
        };

        setUserInfo(updatedProfile);
        form.setFieldsValue(updatedProfile);

        if (freshUserData.avatar) {
          setAvatarUrl(freshUserData.avatar);
        }

        console.log("💾 Saving avatar to localStorage:", freshUserData.avatar);
        localStorage.setItem("user_avatar", freshUserData.avatar || "");
        localStorage.setItem("user_fullname", freshUserData.fullname || "");

        if (user) {
          const updatedUser = {
            ...user,
            avatar: freshUserData.avatar ?? "",
            fullname: freshUserData.fullname ?? "",
            email: freshUserData.email ?? "",
          };

          setUser(updatedUser);
        }

        window.dispatchEvent(
          new CustomEvent("userProfileUpdated", {
            detail: {
              avatar: freshUserData.avatar,
              fullname: freshUserData.fullname,
            },
          })
        );

        console.log("🔔 Dispatched userProfileUpdated event");
      }

      setAvatarFile(null);

      if (avatarUrl && avatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarUrl);
      }

      message.success({
        content: "Cập nhật thông tin thành công!",
        key: "profileUpdate",
      });
    } catch (err: any) {
      console.error("Update error:", err);
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const realFile = info.file as RcFile;

    if (!realFile) {
      message.error("Không thể đọc file!");
      return;
    }

    if (!realFile.type.startsWith("image/")) {
      message.error("Vui lòng chọn file ảnh!");
      return;
    }

    if (realFile.size > 5 * 1024 * 1024) {
      message.error("Ảnh không được lớn hơn 5MB!");
      return;
    }

    setAvatarFile(realFile);

    const preview = URL.createObjectURL(realFile);
    setAvatarUrl(preview);
  };

  const beforeUpload = (file: RcFile) => {
    return false;
  };

  const getUserAvatar = () => {
    if (avatarUrl) {
      const isBlob = avatarUrl.startsWith("blob:");
      return (
        <Avatar
          size={120}
          src={isBlob ? avatarUrl : URL_PUBLIC_IMG + avatarUrl}
        />
      );
    }

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
            <div style={{ marginBottom: 16 }}>{getUserAvatar()}</div>
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
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="fullname"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
              </Form.Item>

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

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>

              <Form.Item name="userType" label="Loại tài khoản">
                <select
                  style={{ width: "100%", padding: 8, borderRadius: 6 }}
                  disabled
                >
                  <option value="TEAM_MANAGER">Team Manager</option>
                  <option value="ORGANIZER">Organizer</option>
                </select>
              </Form.Item>

              <Form.Item
                name="oldPassword"
                label="Mật khẩu hiện tại"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_: any, value: string) {
                      const newPwd = getFieldValue("password");
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

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_: any, value: string) {
                      const pwd = getFieldValue("password");
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

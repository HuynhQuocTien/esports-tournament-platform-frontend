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
  Switch,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  CameraOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { getProfile } from "@/services/authService";

const { Title, Text } = Typography;

export const UserProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://picsum.photos/seed/avatar/200/200"
  );

  const onFinish = async (values: any) => {
    setLoading(true);
    // Giả lập gọi API cập nhật thông tin người dùng

    setTimeout(() => {
      setLoading(false);
      message.success("Cập nhật thông tin thành công!");
    }, 2000);
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === "done") {
      // Giả lập upload thành công
      const url = URL.createObjectURL(info.file.originFileObj);
      setAvatarUrl(url);
      message.success("Tải lên ảnh đại diện thành công!");
    }
  };

  const [userInfo, setUserInfo] = useState({
    fullname: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    userType: "TEAM_MANAGER",
    isActive: true,
    bio: "Game thủ chuyên nghiệp với 5 năm kinh nghiệm.",
    avatarUrl: avatarUrl,
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getProfile();
        if (!data) throw new Error("No profile data");

        const fetched = {
          fullname: data.fullname ?? data.name ?? userInfo.fullname,
          email: data.email ?? userInfo.email,
          phone: data.phone ?? userInfo.phone,
          userType: data.userType ?? userInfo.userType,
          isActive:
            typeof data.isActive === "boolean" ? data.isActive : userInfo.isActive,
          bio: data.bio ?? userInfo.bio,
        };

        setUserInfo((prev) => ({ ...prev, ...fetched }));
        form.setFieldsValue(fetched);

        if (data.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
        }
      } catch (err) {
        console.error(err);
        message.error("Không thể tải thông tin người dùng.");
      }
    };

    fetchMe();
  }, [form]);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Hồ sơ cá nhân
      </Title>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: "center", borderRadius: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <Avatar size={120} src={avatarUrl} icon={<UserOutlined />} />
            </div>
            <Upload
              showUploadList={false}
              onChange={handleAvatarChange}
              beforeUpload={(file) => {
                const isJpgOrPng =
                  file.type === "image/jpeg" || file.type === "image/png";
                if (!isJpgOrPng) {
                  message.error("Chỉ chấp nhận file JPG/PNG!");
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error("Ảnh phải nhỏ hơn 2MB!");
                }
                return isJpgOrPng && isLt2M;
              }}
            >
              <Button icon={<CameraOutlined />}>Đổi ảnh đại diện</Button>
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
                fullname: userInfo.fullname,
                email: userInfo.email,
                phone: userInfo.phone,
                userType: userInfo.userType,
                isActive: userInfo.isActive,
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
              <Form.Item
                name="userType"
                label="Loại tài khoản"
                rules={[
                  { required: true, message: "Vui lòng chọn loại tài khoản!" },
                ]}
              >
                <select style={{ width: "100%", padding: 8, borderRadius: 6 }}>
                  <option value="TEAM_MANAGER">Team Manager</option>
                  <option value="ORGANIZER">Organizer</option>
                </select>
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

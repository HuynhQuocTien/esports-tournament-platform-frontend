import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Typography,
  Row,
  Col,
  Select,
  Divider,
  Space,
  Upload,
  message,
  Tabs,
  Alert,
} from "antd";
import {
  SaveOutlined,
  UploadOutlined,
  SecurityScanOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  BellOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const AdminSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success("Cập nhật cài đặt thành công!");
    }, 2000);
  };

  const tabItems = [
    {
      key: "general",
      label: (
        <span>
          <GlobalOutlined />
          Cài đặt chung
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Card title="Thông tin hệ thống">
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Tên hệ thống" name="systemName">
                    <Input placeholder="ESports Arena" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Phiên bản" name="version">
                    <Input placeholder="v2.1.0" disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Email liên hệ" name="contactEmail">
                    <Input placeholder="contact@esports.vn" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input placeholder="+84 123 456 789" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Mô tả hệ thống" name="description">
                    <TextArea
                      rows={4}
                      placeholder="Mô tả về hệ thống quản lý giải đấu Esports..."
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card title="Cài đặt hiển thị">
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Ngôn ngữ" name="language">
                    <Select defaultValue="vi">
                      <Option value="vi">Tiếng Việt</Option>
                      <Option value="en">English</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Múi giờ" name="timezone">
                    <Select defaultValue="+7">
                      <Option value="+7">GMT+7 (Vietnam)</Option>
                      <Option value="+0">GMT+0 (UTC)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Định dạng ngày tháng" name="dateFormat">
                    <Select defaultValue="dd/MM/yyyy">
                      <Option value="dd/MM/yyyy">DD/MM/YYYY</Option>
                      <Option value="MM/dd/yyyy">MM/DD/YYYY</Option>
                      <Option value="yyyy-MM-dd">YYYY-MM-DD</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Space>
      ),
    },
    {
      key: "notifications",
      label: (
        <span>
          <BellOutlined />
          Thông báo
        </span>
      ),
      children: (
        <Card title="Cài đặt thông báo">
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Thông báo email</Text>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Gửi thông báo qua email cho người dùng
                  </Text>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Thông báo đẩy</Text>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Hiển thị thông báo đẩy trên trình duyệt
                  </Text>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Thông báo SMS</Text>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Gửi thông báo qua SMS (có phí)
                  </Text>
                </div>
              </div>
              <Switch />
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Form layout="vertical">
              <Form.Item label="Email thông báo" name="notificationEmail">
                <Input placeholder="notifications@esports.vn" />
              </Form.Item>
              <Form.Item label="Mẫu thông báo" name="notificationTemplate">
                <TextArea
                  rows={4}
                  placeholder="Nhập mẫu thông báo mặc định..."
                />
              </Form.Item>
            </Form>
          </Space>
        </Card>
      ),
    },
    {
      key: "security",
      label: (
        <span>
          <SecurityScanOutlined />
          Bảo mật
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Card title="Cài đặt bảo mật">
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Text strong>Xác thực 2 yếu tố</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Yêu cầu xác thực 2 yếu tố cho tài khoản admin
                    </Text>
                  </div>
                </div>
                <Switch />
              </div>

              <Divider style={{ margin: "16px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Text strong>Giới hạn đăng nhập</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Khóa tài khoản sau 5 lần đăng nhập thất bại
                    </Text>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Divider style={{ margin: "16px 0" }} />

              <Form layout="vertical">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Thời gian hết hạn session (phút)"
                      name="sessionTimeout"
                    >
                      <Input type="number" defaultValue="30" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Độ dài mật khẩu tối thiểu"
                      name="minPasswordLength"
                    >
                      <Input type="number" defaultValue="8" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Space>
          </Card>

          <Card title="Quyền truy cập API">
            <Alert
              message="Cảnh báo bảo mật"
              description="Đảm bảo các khóa API được bảo mật và không chia sẻ công khai"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Form layout="vertical">
              <Form.Item label="Khóa API công khai" name="publicApiKey">
                <Input.Password placeholder="Nhập khóa API công khai" />
              </Form.Item>
              <Form.Item label="Khóa API bí mật" name="secretApiKey">
                <Input.Password placeholder="Nhập khóa API bí mật" />
              </Form.Item>
            </Form>
          </Card>
        </Space>
      ),
    },
    {
      key: "backup",
      label: (
        <span>
          <DatabaseOutlined />
          Sao lưu & Phục hồi
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Card title="Sao lưu dữ liệu">
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Text strong>Sao lưu tự động</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tự động sao lưu dữ liệu hàng ngày
                    </Text>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Divider style={{ margin: "16px 0" }} />

              <Form layout="vertical">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Tần suất sao lưu" name="backupFrequency">
                      <Select defaultValue="daily">
                        <Option value="daily">Hàng ngày</Option>
                        <Option value="weekly">Hàng tuần</Option>
                        <Option value="monthly">Hàng tháng</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Giữ lại (ngày)" name="retentionDays">
                      <Input type="number" defaultValue="30" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>

              <Space>
                <Button type="primary" icon={<UploadOutlined />}>
                  Sao lưu ngay
                </Button>
                <Button>Tải bản sao lưu</Button>
              </Space>
            </Space>
          </Card>

          <Card title="Phục hồi dữ liệu">
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Alert
                message="Cảnh báo quan trọng"
                description="Phục hồi dữ liệu sẽ ghi đè lên dữ liệu hiện tại. Hãy đảm bảo đã sao lưu trước khi thực hiện."
                type="error"
                showIcon
              />

              <Upload>
                <Button icon={<UploadOutlined />}>Chọn file phục hồi</Button>
              </Upload>

              <Button type="primary" danger>
                Khôi phục dữ liệu
              </Button>
            </Space>
          </Card>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title
          level={2}
          style={{
            margin: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ⚙️ Cài đặt hệ thống
        </Title>
        <Text type="secondary">Quản lý cấu hình và tùy chỉnh hệ thống</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          systemName: "ESports Arena",
          version: "v2.1.0",
          contactEmail: "contact@esports.vn",
          phone: "+84 123 456 789",
          language: "vi",
          timezone: "+7",
          dateFormat: "dd/MM/yyyy",
        }}
      >
        <Tabs
          items={tabItems}
          tabPosition="left"
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        />

        <div style={{ marginTop: 24, textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
            loading={loading}
          >
            Lưu cài đặt
          </Button>
        </div>
      </Form>
    </div>
  );
};

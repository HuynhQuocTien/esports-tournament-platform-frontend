import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Alert,
  Space,
  Steps,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  LoginOutlined,
  EyeOutlined,
  LockOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

export const TournamentRegistrationPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('redirect_url', `/tournaments/${id}/register`);
    navigate('/login');
  };

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: 32 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/tournaments/${id}`)}
          style={{ marginBottom: 16 }}
        >
          Quay lại giải đấu
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          Xem Trước Trang Đăng Ký
        </Title>
        <Text type="secondary">
          Đăng nhập để xem toàn bộ form đăng ký và tham gia giải đấu
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              marginBottom: 24,
            }}
          >
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <LockOutlined style={{ fontSize: 64, color: "#faad14", marginBottom: 24 }} />
              <Title level={3} style={{ marginBottom: 16 }}>
                Nội dung bị khóa
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 32 }}>
                Vui lòng đăng nhập để xem toàn bộ form đăng ký và tham gia giải đấu
              </Paragraph>

              {/* Steps Preview */}
              <Card style={{ marginBottom: 32 }}>
                <Steps current={0} style={{ marginBottom: 24 }}>
                  <Step title="Kiểm tra điều kiện" description="Xác nhận thông tin" />
                  <Step title="Chọn loại đăng ký" description="Đội hoặc cá nhân" />
                  <Step title="Thông tin đăng ký" description="Nhập thông tin chi tiết" />
                  <Step title="Xác nhận đăng ký" description="Hoàn tất đăng ký" />
                </Steps>
                
                <Divider />
                
                <Alert
                  message="Form đăng ký đầy đủ bao gồm:"
                  description={
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      <li>Thông tin đội/Thông tin cá nhân</li>
                      <li>Danh sách thành viên (nếu đăng ký đội)</li>
                      <li>Thông tin liên hệ</li>
                      <li>Thông tin game và rank</li>
                      <li>Đồng ý điều khoản tham gia</li>
                    </ul>
                  }
                  type="info"
                  showIcon
                />
              </Card>

              <Space>
                <Button
                  type="primary"
                  size="large"
                  icon={<LoginOutlined />}
                  onClick={handleLogin}
                >
                  Đăng nhập để tiếp tục
                </Button>
                <Button
                  size="large"
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/tournaments/${id}`)}
                >
                  Xem lại thông tin giải đấu
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              position: "sticky",
              top: 24,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={3} style={{ marginBottom: 8 }}>
                Tại sao cần đăng nhập?
              </Title>
            </div>

            <Divider />

            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <Alert
                message="Bảo mật thông tin"
                description="Đăng nhập giúp bảo vệ thông tin cá nhân và quản lý đăng ký của bạn"
                type="info"
                showIcon
              />
              
              <Alert
                message="Theo dõi đăng ký"
                description="Bạn có thể theo dõi trạng thái đăng ký và nhận thông báo"
                type="info"
                showIcon
              />
              
              <Alert
                message="Lịch sử tham gia"
                description="Xem lại các giải đấu bạn đã tham gia và thành tích"
                type="info"
                showIcon
              />
            </Space>

            <Divider />

            <Alert
              message="Lưu ý"
              description="Chỉ mất 1 phút để đăng nhập hoặc tạo tài khoản mới"
              type="warning"
              showIcon
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
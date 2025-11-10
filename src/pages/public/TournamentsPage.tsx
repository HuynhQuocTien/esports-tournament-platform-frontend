import React, { useMemo } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Space,
  ConfigProvider
} from "antd";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export const TournamentsPage: React.FC = () => {
  const mockTournaments = useMemo(
    () => [
      {
        id: uuidv4(),
        name: "Esports Cup 2025",
        description: "Giải đấu lớn nhất năm dành cho cộng đồng.",
        game: "Valorant",
        startDate: "20/12/2025",
        teams: "16/32",
        imageUrl: `https://picsum.photos/seed/${uuidv4()}/400/200`,
      },
      {
        id: uuidv4(),
        name: "Champion League",
        description: "Nơi quy tụ các đội tuyển chuyên nghiệp hàng đầu.",
        game: "League of Legends",
        startDate: "15/01/2026",
        teams: "8/8",
        imageUrl: `https://picsum.photos/seed/${uuidv4()}/400/200`,
      },
      {
        id: uuidv4(),
        name: "Community Clash",
        description: "Giải đấu giao hữu cho các streamer và fan.",
        game: "CS:GO 2",
        startDate: "01/02/2026",
        teams: "32/64",
        imageUrl: `https://picsum.photos/seed/${uuidv4()}/400/200`,
      },
    ],
    []
  );

  const THEME_PRIMARY_COLOR = "#722ed1";
  const CARD_BACKGROUND_COLOR = "#f0f5ff";
  const PAGE_BACKGROUND_COLOR = "#f5f7fa";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_PRIMARY_COLOR,
        },
      }}
    >
      <div
        style={{
          padding: 32,
          background: PAGE_BACKGROUND_COLOR,
          minHeight: "100vh",
        }}
      >
        <Title level={2} style={{ color: "#1a1a1a", marginBottom: 24 }}>
          Danh sách giải đấu
        </Title>
        <Row gutter={[24, 24]}>
          {mockTournaments.map((t) => (
            <Col xs={24} sm={12} md={8} key={t.id}>
              <Card
                hoverable
                style={{
                  background: CARD_BACKGROUND_COLOR,
                  
                  borderRadius: 10,
                  border: "1px solid #d6e4ff", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                }}
                cover={
                  <img
                    alt={t.name}
                    src={t.imageUrl}
                    style={{
                      height: 180,
                      objectFit: "cover",
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                  />
                }
              >
                <Card.Meta
                  title={<Title level={4}>{t.name}</Title>}
                  description={<Text type="secondary">{t.description}</Text>}
                />

                <div style={{ marginTop: 20, marginBottom: 20 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Space>
                      <TrophyOutlined style={{ color: "#faad14" }} />
                      <Text strong>{t.game}</Text>
                    </Space>
                    <Space>
                      <CalendarOutlined style={{ color: "#1890ff" }} />
                      <Text type="secondary">Ngày bắt đầu: {t.startDate}</Text>
                    </Space>
                    <Space>
                      <TeamOutlined style={{ color: "#52c41a" }} />
                      <Text type="secondary">Số đội: {t.teams}</Text>
                    </Space>
                  </Space>
                </div>

                <Link to={`/tournaments/${t.id}`}>
                  <Button type="primary" block icon={<CheckCircleOutlined />}>
                    Xem chi tiết
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </ConfigProvider>
  );
};
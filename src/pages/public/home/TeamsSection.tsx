import React from "react";
import { Card, Col, Row, Typography, Avatar, Button, Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  TeamOutlined,
  TrophyOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const teams = [
  {
    id: 1,
    name: "Team Alpha",
    logo: `https://picsum.photos/seed/${uuidv4()}/200/200`,
    country: "Việt Nam",
    wins: 45,
    losses: 12,
    rating: "S+",
  },
  {
    id: 2,
    name: "Team Beta",
    logo: `https://picsum.photos/seed/${uuidv4()}/200/200`,
    country: "Thái Lan",
    wins: 38,
    losses: 18,
    rating: "S",
  },
  {
    id: 3,
    name: "Team Gamma",
    logo: `https://picsum.photos/seed/${uuidv4()}/200/200`,
    country: "Hàn Quốc",
    wins: 52,
    losses: 8,
    rating: "S+",
  },
  {
    id: 4,
    name: "Team Delta",
    logo: `https://picsum.photos/seed/${uuidv4()}/200/200`,
    country: "Trung Quốc",
    wins: 41,
    losses: 15,
    rating: "S",
  },
];

const getRatingColor = (rating: string) => {
  switch (rating) {
    case "S+":
      return "#ff4d4f";
    case "S":
      return "#faad14";
    case "A":
      return "#52c41a";
    default:
      return "#1890ff";
  }
};

export const TeamsSection: React.FC = () => {
  return (
    <section
      style={{
        marginBottom: 60,
        background: "var(--ant-color-bg-container)",
        border: "1px solid var(--ant-color-border-secondary)",
        padding: 32,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ color: "#1a1a1a", margin: 0 }}>
            ĐỘI TUYỂN HÀNG ĐẦU
          </Title>
          <Text style={{ color: "#666666", fontSize: "16px" }}>
            Những đội tuyển esports nổi bật tham gia giải đấu
          </Text>
        </div>
        <Link to="/teams">
          <Button
            type="link"
            style={{
              color: "#722ed1",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Xem tất cả →
          </Button>
        </Link>
      </div>

      <Row gutter={[24, 24]}>
        {teams.map((t) => (
          <Col xs={24} sm={12} lg={6} key={t.id}>
            <Card
              bordered={false}
              style={{
                borderRadius: "16px",
                background: "white",
                border: "1px solid #e8e8e8",
                textAlign: "center",
                padding: "24px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                height: "100%",
              }}
              bodyStyle={{ padding: 0 }}
              hoverable
            >
              <div style={{ padding: "20px" }}>
                <Avatar
                  size={80}
                  src={t.logo}
                  style={{
                    marginBottom: "16px",
                    border: `3px solid ${getRatingColor(t.rating)}`,
                  }}
                />

                <Title
                  level={4}
                  style={{ color: "#1a1a1a", marginBottom: "8px" }}
                >
                  {t.name}
                </Title>

                <Space style={{ marginBottom: "16px" }}>
                  <GlobalOutlined style={{ color: "#1890ff" }} />
                  <Text style={{ color: "#666666" }}>{t.country}</Text>
                </Space>

                <Tag
                  color={getRatingColor(t.rating)}
                  style={{
                    marginBottom: "16px",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {t.rating} Rating
                </Tag>
              </div>

              <div
                style={{
                  background: "#fafafa",
                  borderTop: "1px solid #e8e8e8",
                  padding: "16px 20px",
                  borderBottomLeftRadius: "16px",
                  borderBottomRightRadius: "16px",
                }}
              >
                <Space
                  size={16}
                  style={{ width: "100%", justifyContent: "space-around" }}
                >
                  <div style={{ textAlign: "center" }}>
                    <TrophyOutlined
                      style={{
                        color: "#52c41a",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    />
                    <Text
                      style={{
                        color: "#52c41a",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {t.wins}
                    </Text>
                    <Text
                      style={{
                        color: "#999999",
                        fontSize: "11px",
                        display: "block",
                      }}
                    >
                      Thắng
                    </Text>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <TeamOutlined
                      style={{
                        color: "#ff4d4f",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    />
                    <Text
                      style={{
                        color: "#ff4d4f",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {t.losses}
                    </Text>
                    <Text
                      style={{
                        color: "#999999",
                        fontSize: "11px",
                        display: "block",
                      }}
                    >
                      Thua
                    </Text>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

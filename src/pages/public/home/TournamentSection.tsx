import React from "react";
import { Row, Col, Card, Typography, Tag, Button, Space } from "antd";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  EyeOutlined,
  TeamOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const tournaments = [
  {
    id: 1,
    status: "Đang diễn ra",
    img: `https://picsum.photos/seed/${uuidv4()}/600/400`,
    title: "VALORANT CHAMPIONS",
    date: "15-17 Thg 3",
    place: "Saigon Exhibition Center",
    desc: "Vietnam National Championship",
    prize: "500M VNĐ",
    teams: 32,
    city: "Hồ Chí Minh",
    game: "Valorant",
  },
  {
    id: 2,
    status: "Sắp diễn ra",
    img: `https://picsum.photos/seed/${uuidv4()}/600/400`,
    title: "LEAGUE OF LEGENDS",
    date: "22-24 Thg 3",
    place: "National Convention Center",
    desc: "Spring Split Finals",
    prize: "300M VNĐ",
    teams: 16,
    city: "Hà Nội",
    game: "League of Legends",
  },
  {
    id: 3,
    status: "Đăng ký mở",
    img: `https://picsum.photos/seed/${uuidv4()}/600/400`,
    title: "COUNTER-STRIKE 2",
    date: "5-7 Thg 4",
    place: "Ariyana Convention Center",
    desc: "Asian Championship",
    prize: "200M VNĐ",
    teams: 24,
    city: "Đà Nẵng",
    game: "CS2",
  },
];

const getStatusTag = (status: string) => {
  if (status === "Đang diễn ra")
    return (
      <Tag
        color="red"
        style={{ margin: 0, padding: "4px 8px", fontWeight: 600 }}
      >
        🔥 Đang diễn ra
      </Tag>
    );
  if (status === "Sắp diễn ra")
    return (
      <Tag
        color="orange"
        style={{ margin: 0, padding: "4px 8px", fontWeight: 600 }}
      >
        ⏰ Sắp diễn ra
      </Tag>
    );
  if (status === "Đăng ký mở")
    return (
      <Tag
        color="green"
        style={{ margin: 0, padding: "4px 8px", fontWeight: 600 }}
      >
        🎯 Đăng ký mở
      </Tag>
    );
  return <Tag>{status}</Tag>;
};

export const TournamentSection: React.FC = () => {
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
            GIẢI ĐẤU NỔI BẬT
          </Title>
          <Text style={{ color: "#666666", fontSize: "16px" }}>
            Các giải đấu esports hàng đầu với tổng giải thưởng khủng
          </Text>
        </div>
        <Link to="/tournaments">
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
        {tournaments.map((t) => (
          <Col xs={24} md={8} key={t.id}>
            <Card
              cover={
                <div style={{ position: "relative" }}>
                  <img
                    alt={t.title}
                    src={t.img}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                    }}
                  >
                    {getStatusTag(t.status)}
                  </div>
                </div>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                background: "white",
                border: "1px solid #e8e8e8",
                overflow: "hidden",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                height: "100%",
              }}
              bodyStyle={{ padding: "20px" }}
              hoverable
            >
              <Title
                level={4}
                style={{ color: "#1a1a1a", marginBottom: "8px" }}
              >
                {t.title}
              </Title>
              <Text
                style={{
                  color: "#666666",
                  display: "block",
                  marginBottom: "16px",
                }}
              >
                {t.desc}
              </Text>

              <Space
                direction="vertical"
                style={{ width: "100%", marginBottom: "20px" }}
                size={8}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Space>
                    <DollarOutlined style={{ color: "#faad14" }} />
                    <Text style={{ color: "#faad14", fontWeight: 600 }}>
                      🏆 {t.prize}
                    </Text>
                  </Space>
                  <Space>
                    <TeamOutlined style={{ color: "#1890ff" }} />
                    <Text style={{ color: "#666666" }}>{t.teams} đội</Text>
                  </Space>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Space>
                    <EnvironmentOutlined style={{ color: "#52c41a" }} />
                    <Text style={{ color: "#666666" }}>{t.city}</Text>
                  </Space>
                  <Text style={{ color: "#999999", fontSize: "12px" }}>
                    {t.date}
                  </Text>
                </div>
              </Space>

              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1px solid #d9d9d9",
                    color: "#666666",
                  }}
                >
                  Xem kết quả
                </Button>
                <Button
                  type="primary"
                  style={{
                    flex: 1,
                    background: "#722ed1",
                    border: "none",
                  }}
                  icon={<EyeOutlined />}
                >
                  Chi tiết
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <Button
          type="primary"
          size="large"
          style={{
            height: "48px",
            padding: "0 40px",
            fontSize: "16px",
            fontWeight: 600,
            background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(114, 46, 209, 0.3)",
          }}
        >
          Đăng ký tham gia giải đấu
        </Button>
      </div>
    </section>
  );
};

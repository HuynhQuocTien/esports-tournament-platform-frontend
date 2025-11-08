import React from "react";
import { Row, Col, Card, Typography, Tag, Button } from "antd";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const { Title, Text } = Typography;

const tournaments = [
  {
    id: 1,
    status: "Đang diễn ra",
    img: `https://picsum.photos/seed/${uuidv4()}/400/200`,
    title: "VALORANT CHAMPIONS",
    date: "15-17 Thg 3",
    place: "Saigon Exhibition Center",
    desc: "Vietnam National Championship",
    prize: "500M VNĐ",
    teams: 32,
    city: "Hồ Chí Minh",
  },
  {
    id: 2,
    status: "Sắp diễn ra",
    img: `https://picsum.photos/seed/${uuidv4()}/400/200`,
    title: "LEAGUE OF LEGENDS",
    date: "22-24 Thg 3",
    place: "National Convention Center",
    desc: "Spring Split Finals",
    prize: "300M VNĐ",
    teams: 16,
    city: "Hà Nội",
  },
  {
    id: 3,
    status: "Đăng ký mở",
    img: `https://picsum.photos/seed/${uuidv4()}/400/200`,
    title: "COUNTER-STRIKE 2",
    date: "5-7 Thg 4",
    place: "Ariyana Convention Center",
    desc: "Asian Championship",
    prize: "200M VNĐ",
    teams: 24,
    city: "Đà Nẵng",
  },
];


const getStatusTag = (status: string) => {
  if (status === "Đang diễn ra")
    return <Tag color="error">Đang diễn ra</Tag>;
  if (status === "Sắp diễn ra")
    return <Tag color="warning">Sắp diễn ra</Tag>;
  if (status === "Đăng ký mở")
    return <Tag color="success">Đăng ký mở</Tag>;
  return <Tag>{status}</Tag>;
};

export const TournamentSection: React.FC = () => {
  return (
    <section
      style={{
        marginBottom: 80,
        background: "var(--ant-color-bg-container)",
        border: "1px solid var(--ant-color-border-secondary)",
        padding: 24,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>GIẢI ĐẤU 2025</Title>
        <Link to="/tournaments">
          <Button type="link">Xem tất cả →</Button>
        </Link>
      </div>
      <Text type="secondary">
        Các giải đấu esports hàng đầu với tổng giải thưởng khủng
      </Text>

      <Row gutter={24} style={{ marginTop: 24 }}>
        {tournaments.map((t) => (
          <Col span={8} key={t.id}>
            <Card
              cover={<img alt={t.title} src={t.img} />}
              bordered={false}
              style={{
                borderRadius: 12,
                border: "1px solid #f0f0f0",
              }}
            >
              {getStatusTag(t.status)}
              <Title level={4}>{t.title}</Title>
              <Text type="secondary">{t.desc}</Text>
              <div style={{ marginTop: 16 }}>
                <Text
                  style={{
                    color: "var(--ant-color-warning)",
                    marginRight: 16,
                    fontWeight: 600,
                  }}
                >
                  🏆 {t.prize}
                </Text>
                <Text type="secondary">
                  {t.teams} đội • {t.city}
                </Text>
              </div>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button>Xem kết quả</Button>
                <Button type="primary">Chi tiết</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button type="primary" size="large">
          Đăng ký tham gia giải đấu
        </Button>
      </div>
    </section>
  );
};
import React from "react";
import { Row, Col, Card, Typography, Tag, Button } from "antd";

const { Title, Text } = Typography;

const tournaments = [
  {
    id: 1,
    status: "Đang diễn ra",
    img: "/img/valorant.jpg",
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
    img: "/img/lol.jpg",
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
    img: "/img/cs2.jpg",
    title: "COUNTER-STRIKE 2",
    date: "5-7 Thg 4",
    place: "Ariyana Convention Center",
    desc: "Asian Championship",
    prize: "200M VNĐ",
    teams: 24,
    city: "Đà Nẵng",
  },
];

const TournamentSection: React.FC = () => {
  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2} style={{ color: "#fff" }}>GIẢI ĐẤU 2025</Title>
        <a style={{ color: "#fff" }}>Xem tất cả →</a>
      </div>
      <Text style={{ color: "#aaa" }}>Các giải đấu esports hàng đầu với tổng giải thưởng khủng</Text>

      <Row gutter={24} style={{ marginTop: 24 }}>
        {tournaments.map((t) => (
          <Col span={8} key={t.id}>
            <Card
              cover={<img alt={t.title} src={t.img} />}
              bordered={false}
              style={{ background: "#111", color: "#fff", borderRadius: 12 }}
            >
              <Tag color="red">{t.status}</Tag>
              <Title level={4} style={{ color: "#fff" }}>{t.title}</Title>
              <Text style={{ color: "#bbb" }}>{t.desc}</Text>
              <div style={{ marginTop: 16 }}>
                <Text style={{ color: "#f5222d", marginRight: 16 }}>{t.prize}</Text>
                <Text>{t.teams} đội • {t.city}</Text>
              </div>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
                <Button>Xem kết quả</Button>
                <Button type="primary">Chi tiết</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button type="primary" size="large">Đăng ký tham gia giải đấu</Button>
      </div>
    </section>
  );
};

export default TournamentSection;

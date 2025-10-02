import React from "react";
import { Card, Col, Row, Typography, Avatar } from "antd";

const { Title, Text } = Typography;

const teams = [
  { id: 1, name: "Team Alpha", logo: "/img/team1.png", country: "Việt Nam" },
  { id: 2, name: "Team Beta", logo: "/img/team2.png", country: "Thái Lan" },
  { id: 3, name: "Team Gamma", logo: "/img/team3.png", country: "Hàn Quốc" },
  { id: 4, name: "Team Delta", logo: "/img/team4.png", country: "Trung Quốc" },
];

const TeamsSection: React.FC = () => {
  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2} style={{ color: "#fff" }}>CÁC ĐỘI TUYỂN</Title>
        <a style={{ color: "#fff" }}>Xem tất cả →</a>
      </div>
      <Text style={{ color: "#aaa" }}>Những đội tuyển esports nổi bật tham gia giải đấu</Text>

      <Row gutter={24} style={{ marginTop: 24 }}>
        {teams.map((t) => (
          <Col span={6} key={t.id}>
            <Card
              bordered={false}
              style={{ background: "#111", borderRadius: 12, textAlign: "center" }}
            >
              <Avatar size={80} src={t.logo} />
              <Title level={4} style={{ color: "#fff", marginTop: 12 }}>{t.name}</Title>
              <Text style={{ color: "#bbb" }}>{t.country}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default TeamsSection;

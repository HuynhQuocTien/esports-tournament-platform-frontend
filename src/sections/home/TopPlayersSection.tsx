import React from "react";
import { Card, Col, Row, Typography, Avatar } from "antd";

const { Title, Text } = Typography;

const players = [
  { id: 1, name: "Nguyễn Văn A", team: "Team Alpha", avatar: "/img/player1.jpg", kda: "12.5", role: "Mid" },
  { id: 2, name: "Trần Văn B", team: "Team Beta", avatar: "/img/player2.jpg", kda: "10.2", role: "ADC" },
  { id: 3, name: "Lê Văn C", team: "Team Gamma", avatar: "/img/player3.jpg", kda: "9.8", role: "Top" },
];

export const TopPlayersSection: React.FC = () => {
  return (
    <section style={{ marginBottom: 80 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2} style={{ color: "#fff" }}>TOP PLAYERS</Title>
        <a style={{ color: "#fff" }}>Xem tất cả →</a>
      </div>
      <Text style={{ color: "#aaa" }}>Những tuyển thủ xuất sắc nhất mùa giải</Text>

      <Row gutter={24} style={{ marginTop: 24 }}>
        {players.map((p) => (
          <Col span={8} key={p.id}>
            <Card
              bordered={false}
              style={{ background: "#111", borderRadius: 12, textAlign: "center" }}
            >
              <Avatar size={100} src={p.avatar} />
              <Title level={4} style={{ color: "#fff", marginTop: 12 }}>{p.name}</Title>
              <Text style={{ color: "#bbb" }}>{p.team}</Text>
              <div style={{ marginTop: 8, color: "#f5222d" }}>KDA: {p.kda}</div>
              <Text style={{ color: "#fff" }}>Role: {p.role}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};
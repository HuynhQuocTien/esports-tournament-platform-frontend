import React from "react";
import { Card, Col, Row, Typography, Avatar, Button } from "antd";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
const { Title, Text } = Typography;

const players = [
  { id: 1, name: "Nguyễn Văn A", team: "Team Alpha", avatar: `https://picsum.photos/seed/${uuidv4()}/400/200`, kda: "12.5", role: "Mid" },
  { id: 2, name: "Trần Văn B", team: "Team Beta", avatar: `https://picsum.photos/seed/${uuidv4()}/400/200`, kda: "10.2", role: "ADC" },
  { id: 3, name: "Lê Văn C", team: "Team Gamma", avatar: `https://picsum.photos/seed/${uuidv4()}/400/200`, kda: "9.8", role: "Top" },
];

export const TopPlayersSection: React.FC = () => {
  return (
    <section
      style={{
        marginBottom: 80,
        // Thêm nền xanh nhạt và viền cho <section>
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
        <Title level={2}>TOP PLAYERS</Title>
        <Link to="/players">
          <Button type="link">Xem tất cả →</Button>
        </Link>
      </div>
      <Text type="secondary">Những tuyển thủ xuất sắc nhất mùa giải</Text>

      <Row gutter={24} style={{ marginTop: 24 }}>
        {players.map((p) => (
          <Col span={8} key={p.id}>
            {/* Card này sẽ có nền TRẮNG */}
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                textAlign: "center",
                border: "1px solid #f0f0f0",
                // Bỏ background: #111
              }}
            >
              <Avatar size={100} src={p.avatar} />
              <Title level={4} style={{ marginTop: 12 }}>
                {p.name}
              </Title>
              <Text type="secondary">{p.team}</Text>
              {/* Đổi màu KDA sang Vàng (Warning) */}
              <div
                style={{
                  marginTop: 8,
                  color: "var(--ant-color-warning)",
                  fontWeight: 600,
                }}
              >
                KDA: {p.kda}
              </div>
              {/* Bỏ style 'color' */}
              <Text>Role: {p.role}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};
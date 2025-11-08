import React from "react";
import { Card, Col, Row, Typography, Avatar, Button } from "antd";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const { Title, Text } = Typography;

const teams = [
  { id: 1, name: "Team Alpha", logo: `https://picsum.photos/seed/${uuidv4()}/400/200`, country: "Việt Nam" },
  { id: 2, name: "Team Beta", logo: `https://picsum.photos/seed/${uuidv4()}/400/200`, country: "Thái Lan" },
  { id: 3, name: "Team Gamma", logo: `https://picsum.photos/seed/${uuidv4()}/400/200`, country: "Hàn Quốc" },
  { id: 4, name: "Team Delta", logo: `https://picsum.photos/seed/${uuidv4()}/400/200`, country: "Trung Quốc" },
];

export const TeamsSection: React.FC = () => {
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
        <Title level={2}>CÁC ĐỘI TUYỂN</Title>
        <Link to="/teams">
          <Button type="link">Xem tất cả →</Button>
        </Link>
      </div>
      <Text type="secondary">
        Những đội tuyển esports nổi bật tham gia giải đấu
      </Text>

      <Row gutter={24} style={{ marginTop: 24 }}>
        {teams.map((t) => (
          <Col span={6} key={t.id}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                textAlign: "center",
                border: "1px solid #f0f0f0",
              }}
            >
              <Avatar size={80} src={t.logo} />
              <Title level={4} style={{ marginTop: 12 }}>
                {t.name}
              </Title>
              <Text type="secondary">{t.country}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};
import React from "react";
import { Row, Col, Card, Typography } from "antd";
import {
  TeamOutlined,
  TrophyOutlined,
  FireOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const stats = [
  {
    number: "500+",
    text: "Đội tham gia",
    icon: <TeamOutlined style={{ fontSize: "2rem", color: "#1890ff" }} />,
    color: "#1890ff",
  },
  {
    number: "1B VNĐ",
    text: "Tổng giải thưởng",
    icon: <TrophyOutlined style={{ fontSize: "2rem", color: "#faad14" }} />,
    color: "#faad14",
  },
  {
    number: "15",
    text: "Game Title",
    icon: <FireOutlined style={{ fontSize: "2rem", color: "#ff4d4f" }} />,
    color: "#ff4d4f",
  },
  {
    number: "30",
    text: "Ngày thi đấu",
    icon: <CalendarOutlined style={{ fontSize: "2rem", color: "#52c41a" }} />,
    color: "#52c41a",
  },
];

export const StatsSection: React.FC = () => {
  return (
    <Row gutter={[24, 24]} justify="center" style={{ margin: "60px 0" }}>
      {stats.map((s, i) => (
        <Col xs={12} md={6} key={i}>
          <Card
            bordered={false}
            style={{
              borderRadius: "16px",
              background: "white",
              border: "1px solid #e6f7ff",
              textAlign: "center",
              padding: "24px 16px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              height: "100%",
            }}
            bodyStyle={{ padding: 0 }}
            hoverable
          >
            <div style={{ marginBottom: "16px" }}>{s.icon}</div>
            <Title
              level={1}
              style={{
                color: s.color,
                margin: "8px 0",
                fontSize: "2.2rem",
                fontWeight: 700,
              }}
            >
              {s.number}
            </Title>
            <Text
              style={{
                color: "#666666",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {s.text}
            </Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

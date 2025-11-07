import React from "react";
import { Row, Col, Card, Typography } from "antd";

const { Title, Text } = Typography;

const stats = [
  { number: "500+", text: "Đội tham gia" },
  { number: "1B VNĐ", text: "Tổng giải thưởng" },
  { number: "15", text: "Game Title" },
  { number: "30", text: "Ngày thi đấu" },
];

export const StatsSection: React.FC = () => {
  return (
    <Row
      gutter={16}
      justify="center"
      style={{ margin: "50px 0", textAlign: "center" }}
    >
      {stats.map((s, i) => (
        <Col xs={12} md={6} key={i}>
          {/* Card này tự động nhận colorBgContainer và colorBorderSecondary */}
          <Card
            bordered={false}
            style={{
              borderRadius: 10,
              border: "1px solid var(--ant-color-border-secondary)",
              // Bỏ tất cả style 'background' và 'color' cứng
            }}
          >
            {/* Đổi màu số liệu sang màu Tím (primary) */}
            <Title level={2} style={{ color: "var(--ant-color-primary)" }}>
              {s.number}
            </Title>
            {/* Chữ này tự động có màu xám */}
            <Text type="secondary">{s.text}</Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
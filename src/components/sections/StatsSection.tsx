import React from "react";
import { Row, Col, Card } from "antd";

const stats = [
  { number: "500+", text: "Đội tham gia" },
  { number: "1B VNĐ", text: "Tổng giải thưởng" },
  { number: "15", text: "Game Title" },
  { number: "30", text: "Ngày thi đấu" },
];

const StatsSection: React.FC = () => {
  return (
    <Row gutter={16} justify="center" style={{ margin: "50px 0", textAlign: "center" }}>
      {stats.map((s, i) => (
        <Col xs={12} md={6} key={i}>
          <Card bordered={false} style={{ background: "#111", color: "#fff" }}>
            <h2 style={{ color: "#f0f" }}>{s.number}</h2>
            <p style={{ color: "#aaa" }}>{s.text}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsSection;

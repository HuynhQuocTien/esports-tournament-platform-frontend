import React from "react";
import { Card, Row, Col } from "antd";

const Tournament: React.FC = () => {
  const tournaments = [
    { title: "ESports Summer Cup 2025", desc: "Giải đấu mùa hè đầy kịch tính" },
    { title: "Winter Championship 2025", desc: "Cạnh tranh khốc liệt cuối năm" },
    { title: "Spring Arena 2025", desc: "Khởi đầu mùa giải mới" },
  ];

  return (
    <div style={{ padding: "40px 80px", background: "#f9f9f9" }}>
      <h2 style={{ marginBottom: 24 }}>🏆 Giải đấu nổi bật</h2>
      <Row gutter={16}>
        {tournaments.map((t, i) => (
          <Col span={8} key={i}>
            <Card title={t.title} bordered={false} hoverable>
              {t.desc}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Tournament;

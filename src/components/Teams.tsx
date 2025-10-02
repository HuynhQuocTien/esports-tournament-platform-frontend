import React from "react";
import { Card, Row, Col } from "antd";

const Teams: React.FC = () => {
  const teams = ["Team A", "Team B", "Team C", "Team D", "Team E", "Team F"];

  return (
    <div style={{ padding: "40px 80px", background: "#f9f9f9" }}>
      <h2 style={{ marginBottom: 24 }}>🏅 Các Đội Tham Gia</h2>
      <Row gutter={[16, 16]}>
        {teams.map((team, i) => (
          <Col span={8} key={i}>
            <Card hoverable>{team}</Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Teams;

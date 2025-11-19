import React from "react";
import { Card, Col, Row, Typography, Avatar, Button, Space, Rate } from "antd";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { CrownOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const players = [
  { 
    id: 1, 
    name: "Nguyễn Văn A", 
    team: "Team Alpha", 
    avatar: `https://picsum.photos/seed/${uuidv4()}/200/200`, 
    kda: "12.5", 
    role: "Mid",
    rating: 4.9,
    rank: 1
  },
  { 
    id: 2, 
    name: "Trần Văn B", 
    team: "Team Beta", 
    avatar: `https://picsum.photos/seed/${uuidv4()}/200/200`, 
    kda: "10.2", 
    role: "ADC",
    rating: 4.7,
    rank: 2
  },
  { 
    id: 3, 
    name: "Lê Văn C", 
    team: "Team Gamma", 
    avatar: `https://picsum.photos/seed/${uuidv4()}/200/200`, 
    kda: "9.8", 
    role: "Top",
    rating: 4.5,
    rank: 3
  },
];

export const TopPlayersSection: React.FC = () => {
  return (
    <section style={{ marginBottom: 60, background: "var(--ant-color-bg-container)", border: "1px solid var(--ant-color-border-secondary)", padding: 32, borderRadius: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ color: "#1a1a1a", margin: 0 }}>
            TOP PLAYERS
          </Title>
          <Text style={{ color: "#666666", fontSize: "16px" }}>
            Những tuyển thủ xuất sắc nhất mùa giải
          </Text>
        </div>
        <Link to="/players">
          <Button 
            type="link" 
            style={{ 
              color: "#722ed1", 
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Xem tất cả →
          </Button>
        </Link>
      </div>

      <Row gutter={[24, 24]}>
        {players.map((p) => (
          <Col xs={24} md={8} key={p.id}>
            <Card
              bordered={false}
              style={{
                borderRadius: "16px",
                background: "white",
                border: "1px solid #e8e8e8",
                textAlign: "center",
                padding: "24px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                position: "relative",
                overflow: "hidden",
                height: "100%",
              }}
              hoverable
            >
              {/* Rank Badge */}
              {p.rank === 1 && (
                <div style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "linear-gradient(135deg, #faad14 0%, #fadb14 100%)",
                  color: "#000",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}>
                  <CrownOutlined /> #1
                </div>
              )}
              
              <Avatar 
                size={80} 
                src={p.avatar} 
                style={{ 
                  marginBottom: "16px",
                  border: `3px solid ${p.rank === 1 ? "#faad14" : p.rank === 2 ? "#d9d9d9" : "#ff7a45"}`,
                }} 
              />
              
              <Title level={4} style={{ color: "#1a1a1a", marginBottom: "8px" }}>
                {p.name}
              </Title>
              
              <Text style={{ color: "#666666", display: "block", marginBottom: "8px" }}>
                {p.team}
              </Text>
              
              <div style={{ marginBottom: "12px" }}>
                <Rate 
                  disabled 
                  defaultValue={p.rating} 
                  style={{ fontSize: "14px" }} 
                />
                <Text style={{ color: "#999999", marginLeft: "8px", fontSize: "12px" }}>
                  {p.rating}
                </Text>
              </div>
              
              <Space size={16} style={{ marginBottom: "16px" }}>
                <div style={{ textAlign: "center" }}>
                  <Text style={{ color: "#ff4d4f", fontWeight: 600, fontSize: "16px", display: "block" }}>
                    {p.kda}
                  </Text>
                  <Text style={{ color: "#999999", fontSize: "12px" }}>KDA</Text>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Text style={{ color: "#52c41a", fontWeight: 600, fontSize: "16px", display: "block" }}>
                    {p.role}
                  </Text>
                  <Text style={{ color: "#999999", fontSize: "12px" }}>Role</Text>
                </div>
              </Space>
              
              <Button 
                type="dashed" 
                style={{ 
                  width: "100%",
                  borderColor: "#d9d9d9",
                  color: "#666666"
                }}
              >
                Xem Profile
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};
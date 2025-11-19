import React from "react";
import { Card, List, Avatar, Typography, Row, Col, Tag, Statistic } from "antd";
import { 
  TeamOutlined, 
  UserOutlined, 
  TrophyOutlined,
  CrownOutlined,
  StarOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const mockTeams = [
  {
    id: "team-1",
    name: "Team Phoenix",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=teamA",
    members: ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5"],
    wins: 12,
    losses: 3,
    rating: 1850,
    status: "active"
  },
  {
    id: "team-2",
    name: "Dragon Warriors",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=teamB",
    members: ["Player 6", "Player 7", "Player 8", "Player 9", "Player 10"],
    wins: 8,
    losses: 7,
    rating: 1620,
    status: "active"
  },
  {
    id: "team-3",
    name: "Thunder Storm",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=teamC",
    members: ["Player 11", "Player 12", "Player 13", "Player 14", "Player 15"],
    wins: 15,
    losses: 2,
    rating: 1950,
    status: "champion"
  },
  {
    id: "team-4",
    name: "Shadow Hunters",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=teamD",
    members: ["Player 16", "Player 17", "Player 18", "Player 19", "Player 20"],
    wins: 5,
    losses: 10,
    rating: 1450,
    status: "active"
  },
];

const PAGE_BACKGROUND_COLOR = "#f8fafc";
const CARD_BACKGROUND_COLOR = "#ffffff";
const PRIMARY_COLOR = "#1890ff";
const SUCCESS_COLOR = "#52c41a";
const WARNING_COLOR = "#faad14";

export const TeamsPage: React.FC = () => {
  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: "blue", text: "Đang thi đấu" },
      champion: { color: "gold", text: "Vô địch" },
      inactive: { color: "default", text: "Không hoạt động" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 1800) return "#ff4d4f";
    if (rating >= 1600) return "#faad14";
    if (rating >= 1400) return "#52c41a";
    return "#1890ff";
  };

  return (
    <div
      style={{
        padding: 24,
        background: PAGE_BACKGROUND_COLOR,
        minHeight: "100vh",
      }}
    >
      {/* Header Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số đội"
              value={mockTeams.length}
              prefix={<TeamOutlined style={{ color: PRIMARY_COLOR }} />}
              valueStyle={{ color: PRIMARY_COLOR }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số tuyển thủ"
              value={mockTeams.reduce((acc, team) => acc + team.members.length, 0)}
              prefix={<UserOutlined style={{ color: SUCCESS_COLOR }} />}
              valueStyle={{ color: SUCCESS_COLOR }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đội vô địch"
              value={mockTeams.filter(team => team.status === "champion").length}
              prefix={<CrownOutlined style={{ color: WARNING_COLOR }} />}
              valueStyle={{ color: WARNING_COLOR }}
            />
          </Card>
        </Col>
      </Row>

      {/* Teams Grid */}
      <Card
        style={{
          background: CARD_BACKGROUND_COLOR,
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ paddingBottom: 24 }}>
          <Title level={2} style={{ margin: 0, display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                width: 48,
                height: 48,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TeamOutlined style={{ fontSize: 24, color: "white" }} />
            </div>
            Đội Thi Đấu
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Danh sách các đội tham gia giải đấu
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {mockTeams.map((team) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={team.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  border: team.status === "champion" ? `2px solid ${WARNING_COLOR}` : "1px solid #f0f0f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  background: team.status === "champion" ? "#fffbe6" : "white",
                }}
                bodyStyle={{ padding: 20 }}
              >
                {/* Team Header */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 12 }}>
                  <Avatar 
                    src={team.logo} 
                    size={50}
                    style={{ 
                      border: `2px solid ${getRatingColor(team.rating)}`,
                      boxShadow: `0 2px 8px ${getRatingColor(team.rating)}40`
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Text strong style={{ fontSize: 16 }}>
                        {team.name}
                      </Text>
                      {team.status === "champion" && <CrownOutlined style={{ color: WARNING_COLOR }} />}
                    </div>
                    {getStatusTag(team.status)}
                  </div>
                </div>

                {/* Team Stats */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ textAlign: "center" }}>
                    <Text strong style={{ color: SUCCESS_COLOR, fontSize: 18 }}>
                      {team.wins}
                    </Text>
                    <div style={{ fontSize: 12, color: "#8c8c8c" }}>Thắng</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Text strong style={{ color: "#ff4d4f", fontSize: 18 }}>
                      {team.losses}
                    </Text>
                    <div style={{ fontSize: 12, color: "#8c8c8c" }}>Thua</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Text strong style={{ color: getRatingColor(team.rating), fontSize: 18 }}>
                      {team.rating}
                    </Text>
                    <div style={{ fontSize: 12, color: "#8c8c8c" }}>Điểm</div>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <Text strong style={{ marginBottom: 8, display: "block" }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Thành viên
                  </Text>
                  <div style={{ maxHeight: 120, overflowY: "auto" }}>
                    {team.members.map((member, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "4px 8px",
                          marginBottom: 4,
                          background: "#fafafa",
                          borderRadius: 6,
                          fontSize: 12,
                        }}
                      >
                        {member}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};
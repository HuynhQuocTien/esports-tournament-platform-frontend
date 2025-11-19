import React, { useMemo } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Statistic,
  Badge
} from "antd";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
  EyeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export const TournamentsPage: React.FC = () => {
  const mockTournaments = useMemo(
    () => [
      {
        id: uuidv4(),
        name: "Esports Championship 2025",
        description: "Giải đấu lớn nhất năm với sự tham gia của các đội tuyển hàng đầu. Cơ hội tranh tài và giành giải thưởng hấp dẫn.",
        game: "Valorant",
        startDate: "20/12/2025",
        endDate: "15/01/2026",
        teams: "16/32",
        prizePool: "$50,000",
        status: "upcoming",
        imageUrl: `https://picsum.photos/seed/${uuidv4()}/600/300`,
        organizer: "ESL Asia",
        registered: false
      },
      {
        id: uuidv4(),
        name: "Champion League Pro",
        description: "Giải đấu chuyên nghiệp dành cho các đội tuyển LMHT. Thể hiện kỹ năng và chiến thuật đỉnh cao.",
        game: "League of Legends",
        startDate: "15/01/2026",
        endDate: "28/02/2026",
        teams: "8/8",
        prizePool: "$30,000",
        status: "registration",
        imageUrl: `https://picsum.photos/seed/${uuidv4()}/600/300`,
        organizer: "Riot Games",
        registered: true
      },
      {
        id: uuidv4(),
        name: "Community Clash Monthly",
        description: "Giải đấu giao hữu hàng tháng dành cho cộng đồng. Cơ hội giao lưu và học hỏi từ các streamer nổi tiếng.",
        game: "CS:GO 2",
        startDate: "01/02/2026",
        endDate: "28/02/2026",
        teams: "32/64",
        prizePool: "$10,000",
        status: "ongoing",
        imageUrl: `https://picsum.photos/seed/${uuidv4()}/600/300`,
        organizer: "Community",
        registered: false
      },
      {
        id: uuidv4(),
        name: "Winter Invitational 2025",
        description: "Giải đấu mùa đông với format thi đấu độc đáo. Nhiều bất ngờ và kịch tính đang chờ đợi.",
        game: "Dota 2",
        startDate: "10/11/2025",
        endDate: "20/12/2025",
        teams: "12/12",
        prizePool: "$25,000",
        status: "completed",
        imageUrl: `https://picsum.photos/seed/${uuidv4()}/600/300`,
        organizer: "Valve",
        registered: false
      },
    ],
    []
  );

  const getStatusConfig = (status: string) => {
    const config = {
      upcoming: { color: "blue", text: "Sắp diễn ra", icon: <ClockCircleOutlined /> },
      registration: { color: "green", text: "Đang đăng ký", icon: <CheckCircleOutlined /> },
      ongoing: { color: "orange", text: "Đang diễn ra", icon: <PlayCircleOutlined /> },
      completed: { color: "default", text: "Đã kết thúc", icon: <TrophyOutlined /> }
    };
    return config[status as keyof typeof config] || config.upcoming;
  };

  const getStatusTag = (status: string) => {
    const config = getStatusConfig(status);
    return (
      <Tag color={config.color} icon={config.icon} style={{ margin: 0 }}>
        {config.text}
      </Tag>
    );
  };

  return (
    <div
      style={{
        padding: 24,
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Title level={1} style={{ 
          color: "#1a1a1a", 
          marginBottom: 8,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Giải Đấu Esports
        </Title>
        <Text type="secondary" style={{ fontSize: 18 }}>
          Khám phá các giải đấu hàng đầu và tham gia ngay hôm nay
        </Text>
      </div>

      {/* Stats Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng số giải đấu"
              value={mockTournaments.length}
              prefix={<TrophyOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang diễn ra"
              value={mockTournaments.filter(t => t.status === "ongoing").length}
              prefix={<PlayCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Sắp diễn ra"
              value={mockTournaments.filter(t => t.status === "upcoming").length}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng giải thưởng"
              value={mockTournaments.reduce((acc, t) => acc + parseInt(t.prizePool.replace(/[$,]/g, '')), 0)}
              prefix={<DollarOutlined style={{ color: "#ff4d4f" }} />}
              formatter={value => `$${value.toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Tournaments Grid */}
      <Row gutter={[24, 24]}>
        {mockTournaments.map((tournament) => (
          <Col xs={24} sm={12} xl={6} key={tournament.id}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                transition: "all 0.3s ease",
                background: "white",
                height: "100%",
                display: "flex",
                flexDirection: "column"
              }}
              bodyStyle={{ 
                padding: 0,
                flex: 1,
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Tournament Image */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  alt={tournament.name}
                  src={tournament.imageUrl}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                  }}
                />
                <div style={{ 
                  position: "absolute", 
                  top: 12, 
                  right: 12 
                }}>
                  {getStatusTag(tournament.status)}
                </div>
              </div>

              {/* Tournament Content */}
              <div style={{ 
                padding: 20, 
                flex: 1, 
                display: "flex", 
                flexDirection: "column" 
              }}>
                {/* Tournament Title and Status */}
                <div style={{ marginBottom: 12 }}>
                  <Title level={4} style={{ 
                    margin: 0, 
                    marginBottom: 8,
                    lineHeight: 1.3,
                    minHeight: 44,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {tournament.name}
                  </Title>
                </div>
                
                {/* Description */}
                <Paragraph 
                  type="secondary" 
                  style={{ 
                    margin: 0,
                    marginBottom: 16,
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.5,
                    minHeight: 72
                  }}
                >
                  {tournament.description}
                </Paragraph>

                {/* Tournament Info - Fixed height section */}
                <div style={{ marginBottom: 20 }}>
                  <Space direction="vertical" style={{ width: "100%" }} size={12}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Space>
                        <TrophyOutlined style={{ color: "#faad14" }} />
                        <Text strong style={{ fontSize: 14 }}>{tournament.game}</Text>
                      </Space>
                      <Text type="secondary" style={{ fontSize: 12 }}>{tournament.organizer}</Text>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Space>
                        <CalendarOutlined style={{ color: "#1890ff" }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>Bắt đầu: {tournament.startDate}</Text>
                      </Space>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Space>
                        <TeamOutlined style={{ color: "#52c41a" }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>{tournament.teams} đội</Text>
                      </Space>
                      <Space>
                        <DollarOutlined style={{ color: "#ff4d4f" }} />
                        <Text strong style={{ fontSize: 14, color: "#ff4d4f" }}>{tournament.prizePool}</Text>
                      </Space>
                    </div>
                  </Space>
                </div>

                {/* Action Button */}
                <div style={{ marginTop: "auto" }}>
                  <Link to={`/tournaments/${tournament.id}`}>
                    <Button 
                      type="primary" 
                      block 
                      icon={<EyeOutlined />}
                      size="large"
                      style={{
                        borderRadius: 8,
                        height: 40,
                        fontSize: 14,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none"
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
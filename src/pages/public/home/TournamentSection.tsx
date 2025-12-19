import React from "react";
import { Row, Col, Card, Typography, Tag, Button, Space, Spin, Alert, Progress } from "antd";
import { Link } from "react-router-dom";
import {
  EyeOutlined,
  TeamOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FireOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useFeaturedTournaments } from "@/hooks/useFeaturedTournament";

const { Title, Text } = Typography;

interface Tournament {
  id: string;
  name: string;
  description: string;
  game: string;
  type: string;
  format: string;
  status: string;
  logoUrl?: string;
  bannerUrl?: string;
  registrationStart?: string;
  registrationEnd?: string;
  tournamentStart?: string;
  tournamentEnd?: string;
  maxTeams: number;
  registrationFee: number;
  prizePool: number;
  city?: string;
  approvedTeamsCount: number;
  registrationProgress: number;
  registrationStatus: string;
  timeStatus?: {
    label: string;
    color: string;
    icon: string;
  };
  organizer?: {
    id: string;
    username: string;
    email: string;
  };
}

const getStatusTag = (tournament: Tournament) => {
  const status = tournament.registrationStatus || tournament.status;
  
  if (status === "Đang diễn ra" || tournament.status === "LIVE") {
    return (
      <Tag
        color="red"
        style={{ margin: 0, padding: "4px 8px", fontWeight: 600 }}
      >
        🔥 Đang diễn ra
      </Tag>
    );
  }
  if (status === "Sắp diễn ra" || tournament.status === "UPCOMING") {
    return (
      <Tag
        color="orange"
        style={{ margin: 0, padding: "4px 8px", fontWeight: 600 }}
      >
        ⏰ Sắp diễn ra
      </Tag>
    );
  }
  if (status === "Đăng ký mở" || tournament.status === "REGISTRATION_OPEN") {
    return (
      <Tag
        color="green"
        style={{ margin: 0, padding: "4px 8px", fontWeight: 600 }}
      >
        🎯 Đăng ký mở
      </Tag>
    );
  }
  if (status === "Đã kết thúc" || tournament.status === "COMPLETED") {
    return (
      <Tag
        color="gray"
        style={{ margin: 0, padding: "4px 8px", fontWeight: 600 }}
      >
        ✅ Đã kết thúc
      </Tag>
    );
  }
  return <Tag>{status}</Tag>;
};

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)}M VNĐ`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K VNĐ`;
  }
  return `${amount} VNĐ`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Chưa xác định";
  
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getGameIcon = (game: string): string => {
  const icons: Record<string, string> = {
    "CS2": "🔫",
    "Valorant": "💥",
    "League of Legends": "⚔️",
    "Dota 2": "🛡️",
    "PUBG": "🎯",
    "Mobile Legends": "📱",
    "Arena of Valor": "🏹",
    "FIFA": "⚽",
    "Call of Duty": "🎖️",
    "Overwatch": "⚡",
  };
  return icons[game] || "🎮";
};

export const TournamentSection: React.FC = () => {
  const {
      tournaments,
      loading,
      error,
      refetch,
    } = useFeaturedTournaments();

  const getMockTournaments = (): Tournament[] => [
    {
      id: "1",
      name: "VALORANT CHAMPIONS",
      description: "Vietnam National Championship",
      game: "Valorant",
      type: "SINGLE_ELIMINATION",
      format: "BRACKET",
      status: "LIVE",
      bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      registrationStart: "2024-03-01",
      registrationEnd: "2024-03-14",
      tournamentStart: "2024-03-15",
      tournamentEnd: "2024-03-17",
      maxTeams: 32,
      registrationFee: 100000,
      prizePool: 500000000,
      city: "Hồ Chí Minh",
      approvedTeamsCount: 28,
      registrationProgress: 87.5,
      registrationStatus: "Đang diễn ra",
    },
    {
      id: "2",
      name: "LEAGUE OF LEGENDS",
      description: "Spring Split Finals",
      game: "League of Legends",
      type: "DOUBLE_ELIMINATION",
      format: "BRACKET",
      status: "UPCOMING",
      bannerUrl: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      registrationStart: "2024-03-01",
      registrationEnd: "2024-03-20",
      tournamentStart: "2024-03-22",
      tournamentEnd: "2024-03-24",
      maxTeams: 16,
      registrationFee: 150000,
      prizePool: 300000000,
      city: "Hà Nội",
      approvedTeamsCount: 12,
      registrationProgress: 75,
      registrationStatus: "Sắp diễn ra",
    },
    {
      id: "3",
      name: "COUNTER-STRIKE 2",
      description: "Asian Championship",
      game: "CS2",
      type: "SINGLE_ELIMINATION",
      format: "BRACKET",
      status: "REGISTRATION_OPEN",
      bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      registrationStart: "2024-03-01",
      registrationEnd: "2024-04-04",
      tournamentStart: "2024-04-05",
      tournamentEnd: "2024-04-07",
      maxTeams: 24,
      registrationFee: 80000,
      prizePool: 200000000,
      city: "Đà Nẵng",
      approvedTeamsCount: 18,
      registrationProgress: 75,
      registrationStatus: "Đăng ký mở",
    },
  ];

  if (loading) {
    return (
      <section
        style={{
          marginBottom: 60,
          background: "var(--ant-color-bg-container)",
          border: "1px solid var(--ant-color-border-secondary)",
          padding: 32,
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        <Spin size="large" />
        <Text style={{ display: "block", marginTop: 16, color: "#666" }}>
          Đang tải giải đấu...
        </Text>
      </section>
    );
  }

  if (error && tournaments.length === 0) {
    return (
      <section
        style={{
          marginBottom: 60,
          background: "var(--ant-color-bg-container)",
          border: "1px solid var(--ant-color-border-secondary)",
          padding: 32,
          borderRadius: 16,
        }}
      >
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
        {/* <Button type="primary" onClick={fetchTournaments}>
          Thử lại
        </Button> */}
      </section>
    );
  }

  return (
    <section
      style={{
        marginBottom: 60,
        background: "var(--ant-color-bg-container)",
        border: "1px solid var(--ant-color-border-secondary)",
        padding: 32,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ color: "#1a1a1a", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <FireOutlined style={{ color: "#ff4d4f" }} />
            GIẢI ĐẤU NỔI BẬT
          </Title>
          <Text style={{ color: "#666666", fontSize: "16px" }}>
            Các giải đấu esports hàng đầu
          </Text>
        </div>
        <Link to="/tournaments">
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

      {error && (
        <Alert
          message="Thông báo"
          description={`${error} (Đang hiển thị dữ liệu mẫu)`}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[24, 24]}>
        {tournaments.map((tournament) => (
          <Col xs={24} md={8} key={tournament.id}>
            <Card
              cover={
                <div style={{ position: "relative" }}>
                  <img
                    alt={tournament.name}
                    src={tournament.bannerUrl || `https://picsum.photos/seed/${tournament.id}/600/400`}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${tournament.id}/600/400`;
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                    }}
                  >
                    {getStatusTag(tournament)}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {getGameIcon(tournament.game)} {tournament.game}
                  </div>
                </div>
              }
              bordered={false}
              style={{
                borderRadius: "12px",
                background: "white",
                border: "1px solid #e8e8e8",
                overflow: "hidden",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                height: "100%",
              }}
              bodyStyle={{ padding: "20px" }}
              hoverable
            >
              <Title
                level={4}
                style={{ color: "#1a1a1a", marginBottom: "8px" }}
              >
                {tournament.name}
              </Title>
              <Text
                style={{
                  color: "#666666",
                  display: "block",
                  marginBottom: "16px",
                  minHeight: "40px",
                }}
              >
                {tournament.description}
              </Text>

              <Space
                direction="vertical"
                style={{ width: "100%", marginBottom: "20px" }}
                size={8}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Space>
                    <TrophyOutlined style={{ color: "#faad14" }} />
                    <Text style={{ color: "#faad14", fontWeight: 600 }}>
                      🏆 {formatCurrency(tournament.prizePool)}
                    </Text>
                  </Space>
                  <Space>
                    <TeamOutlined style={{ color: "#1890ff" }} />
                    <Text style={{ color: "#666666" }}>
                      {tournament.approvedTeamsCount}/{tournament.maxTeams} đội
                    </Text>
                  </Space>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Space>
                    <EnvironmentOutlined style={{ color: "#52c41a" }} />
                    <Text style={{ color: "#666666" }}>
                      {tournament.city || "Toàn quốc"}
                    </Text>
                  </Space>
                  <Space>
                    <CalendarOutlined style={{ color: "#722ed1" }} />
                    <Text style={{ color: "#666666", fontSize: "12px" }}>
                      {formatDate(tournament.tournamentStart)}
                    </Text>
                  </Space>
                </div>
                
                {/* Registration Progress */}
                <div style={{ marginTop: 8 }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    marginBottom: 4,
                    fontSize: "12px",
                    color: "#666",
                  }}>
                    <Space size={4}>
                      <UserOutlined style={{ fontSize: "10px" }} />
                      <Text>Tiến độ đăng ký</Text>
                    </Space>
                    <Text>
                      {Math.round(tournament.registrationProgress)}%
                    </Text>
                  </div>
                  <Progress
                    percent={tournament.registrationProgress}
                    size="small"
                    strokeColor={
                      tournament.registrationProgress >= 100 
                        ? "#ff4d4f" 
                        : "#52c41a"
                    }
                    showInfo={false}
                  />
                </div>
                
                {/* Registration Fee */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#666",
                }}>
                  <Space size={4}>
                    <DollarOutlined style={{ fontSize: "10px" }} />
                    <Text>Phí đăng ký:</Text>
                  </Space>
                  <Text style={{ fontWeight: 500 }}>
                    {formatCurrency(tournament.registrationFee)}
                  </Text>
                </div>
              </Space>

              <div style={{ display: "flex", gap: "8px" }}>
                <Link to={`/tournaments/${tournament.id}/results`}>
                  <Button
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "1px solid #d9d9d9",
                      color: "#666666",
                    }}
                  >
                    Xem kết quả
                  </Button>
                </Link>
                <Link to={`/tournaments/${tournament.id}`}>
                  <Button
                    type="primary"
                    style={{
                      flex: 1,
                      background: "#722ed1",
                      border: "none",
                    }}
                    icon={<EyeOutlined />}
                  >
                    Chi tiết
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <Link to="/tournaments/create">
          <Button
            type="primary"
            size="large"
            style={{
              height: "48px",
              padding: "0 40px",
              fontSize: "16px",
              fontWeight: 600,
              background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(114, 46, 209, 0.3)",
            }}
          >
            Đăng ký tham gia giải đấu
          </Button>
        </Link>
        <div style={{ marginTop: "16px" }}>
          <Text type="secondary">
            Đang có {tournaments.length} giải đấu nổi bật
          </Text>
        </div>
      </div>
    </section>
  );
};
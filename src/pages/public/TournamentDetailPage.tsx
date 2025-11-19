import React from "react";
import { useParams } from "react-router-dom";
import { 
  Card, 
  List, 
  Typography, 
  Row, 
  Col, 
  Tag, 
  Progress, 
  Timeline,
  Statistic,
  Divider 
} from "antd";
import { 
  CalendarOutlined, 
  TeamOutlined, 
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const mockTournamentDetails = [
  {
    id: "1",
    name: "Esports Championship 2025",
    description: "Giải đấu Esports lớn nhất năm với sự tham gia của 16 đội hàng đầu đến từ khắp khu vực. Giải đấu mang đến những trận cầu mãn nhãn và kịch tính nhất.",
    game: "Valorant",
    status: "ongoing",
    startDate: "2025-10-01",
    endDate: "2025-12-15",
    prizePool: "$50,000",
    teams: "16/16",
    organizer: "ESL Asia",
    schedule: [
      { 
        match: "Team Phoenix vs Dragon Warriors", 
        time: "2025-10-05 18:00", 
        stage: "Bán kết",
        status: "completed",
        score: "2-1"
      },
      { 
        match: "Thunder Storm vs Shadow Hunters", 
        time: "2025-10-06 20:00", 
        stage: "Bán kết",
        status: "upcoming",
        score: null
      },
      { 
        match: "Chung kết", 
        time: "2025-10-12 19:00", 
        stage: "Chung kết",
        status: "upcoming",
        score: null
      },
    ],
    participants: [
      "Team Phoenix", "Dragon Warriors", "Thunder Storm", "Shadow Hunters",
      "Ice Breakers", "Fire Starters", "Wind Riders", "Earth Shakers"
    ]
  },
];

const PAGE_BACKGROUND_COLOR = "#f8fafc";
const CARD_BACKGROUND_COLOR = "#ffffff";

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tournament = mockTournamentDetails.find((t) => t.id === id);

  if (!tournament) {
    return (
      <div style={{ padding: 32, background: PAGE_BACKGROUND_COLOR, minHeight: "100vh" }}>
        <Card>
          <Title level={3}>Không tìm thấy giải đấu</Title>
        </Card>
      </div>
    );
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      ongoing: { color: "blue", text: "Đang diễn ra" },
      upcoming: { color: "green", text: "Sắp diễn ra" },
      completed: { color: "default", text: "Đã kết thúc" }
    };
    
    return <Tag color={statusConfig[status as keyof typeof statusConfig]?.color}>
      {statusConfig[status as keyof typeof statusConfig]?.text}
    </Tag>;
  };

  const getMatchStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "ongoing": return <PlayCircleOutlined style={{ color: "#1890ff" }} />;
      default: return <ClockCircleOutlined style={{ color: "#faad14" }} />;
    }
  };

  return (
    <div
      style={{
        padding: 24,
        background: PAGE_BACKGROUND_COLOR,
        minHeight: "100vh",
      }}
    >
      {/* Tournament Header */}
      <Card
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 16,
          border: "none",
          color: "white",
          marginBottom: 24,
        }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <TrophyOutlined style={{ fontSize: 32 }} />
              <div>
                <Title level={2} style={{ color: "white", margin: 0 }}>
                  {tournament.name}
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
                  {tournament.game} • {getStatusTag(tournament.status)}
                </Text>
              </div>
            </div>
            <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, marginBottom: 0 }}>
              {tournament.description}
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Statistic
                  title="Tổng giải thưởng"
                  value={tournament.prizePool}
                  valueStyle={{ color: "white" }}
                  prefix={<TrophyOutlined />}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Số đội"
                  value={tournament.teams}
                  valueStyle={{ color: "white" }}
                  prefix={<TeamOutlined />}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Schedule Timeline */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              background: CARD_BACKGROUND_COLOR,
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CalendarOutlined style={{ color: "#1890ff" }} />
                <Text strong style={{ fontSize: 18 }}>
                  Lịch Thi Đấu
                </Text>
              </div>
            }
          >
            <Timeline>
              {tournament.schedule.map((match, index) => (
                <Timeline.Item
                  key={index}
                  dot={getMatchStatusIcon(match.status)}
                  color={
                    match.status === "completed" ? "#52c41a" :
                    match.status === "ongoing" ? "#1890ff" : "#faad14"
                  }
                >
                  <div style={{ padding: "8px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <Text strong style={{ fontSize: 14 }}>
                        {match.match}
                      </Text>
                      {match.score && (
                        <Tag color="green" style={{ margin: 0 }}>
                          {match.score}
                        </Tag>
                      )}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                      {match.stage}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {match.time}
                    </Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        {/* Participants */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              background: CARD_BACKGROUND_COLOR,
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TeamOutlined style={{ color: "#52c41a" }} />
                <Text strong style={{ fontSize: 18 }}>
                  Đội Tham Gia ({tournament.participants.length})
                </Text>
              </div>
            }
          >
            <Row gutter={[8, 8]}>
              {tournament.participants.map((participant, index) => (
                <Col xs={12} sm={8} key={index}>
                  <div
                    style={{
                      padding: "8px 12px",
                      background: "#fafafa",
                      borderRadius: 8,
                      textAlign: "center",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>{participant}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Tournament Progress */}
      <Card
        style={{
          background: CARD_BACKGROUND_COLOR,
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginTop: 24,
        }}
        title="Tiến độ giải đấu"
      >
        <div style={{ padding: "0 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <Text>Vòng bảng</Text>
            <Text>75%</Text>
          </div>
          <Progress percent={75} strokeColor="#52c41a" />
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, marginTop: 16 }}>
            <Text>Vòng loại trực tiếp</Text>
            <Text>50%</Text>
          </div>
          <Progress percent={50} strokeColor="#1890ff" />
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, marginTop: 16 }}>
            <Text>Chung kết</Text>
            <Text>0%</Text>
          </div>
          <Progress percent={0} strokeColor="#faad14" />
        </div>
      </Card>
    </div>
  );
};
import React, { useState } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Timeline,
  Tag,
  Button,
  Select,
  Divider,
  Badge,
  Space,
  List,
  Avatar,
} from "antd";
import {
  CalendarOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  TeamOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const PAGE_BACKGROUND_COLOR = "#f5f7fa";
const CARD_BACKGROUND_COLOR = "#e6f7ff";
const CARD_BORDER_COLOR = "#bae0ff";

const mockMatches = [
  {
    id: 1,
    date: "2024-12-15",
    time: "18:00",
    teamA: "Team Alpha",
    teamB: "Team Beta",
    logoA: "https://picsum.photos/seed/team1/60/60",
    logoB: "https://picsum.photos/seed/team2/60/60",
    tournament: "VALORANT CHAMPIONS",
    stage: "Bán kết",
    status: "upcoming",
    scoreA: null,
    scoreB: null,
    venue: "Saigon Exhibition Center",
    stream: "https://twitch.tv/esports",
  },
  {
    id: 2,
    date: "2024-12-15",
    time: "20:30",
    teamA: "Team Gamma",
    teamB: "Team Delta",
    logoA: "https://picsum.photos/seed/team3/60/60",
    logoB: "https://picsum.photos/seed/team4/60/60",
    tournament: "VALORANT CHAMPIONS",
    stage: "Bán kết",
    status: "upcoming",
    scoreA: null,
    scoreB: null,
    venue: "Saigon Exhibition Center",
    stream: "https://twitch.tv/esports",
  },
  {
    id: 3,
    date: "2024-12-14",
    time: "19:00",
    teamA: "Team Epsilon",
    teamB: "Team Zeta",
    logoA: "https://picsum.photos/seed/team5/60/60",
    logoB: "https://picsum.photos/seed/team6/60/60",
    tournament: "LEAGUE OF LEGENDS",
    stage: "Tứ kết",
    status: "completed",
    scoreA: 2,
    scoreB: 1,
    venue: "National Convention Center",
    stream: "https://twitch.tv/esports",
  },
  {
    id: 4,
    date: "2024-12-13",
    time: "17:00",
    teamA: "Team Eta",
    teamB: "Team Theta",
    logoA: "https://picsum.photos/seed/team7/60/60",
    logoB: "https://picsum.photos/seed/team8/60/60",
    tournament: "COUNTER-STRIKE 2",
    stage: "Vòng bảng",
    status: "completed",
    scoreA: 16,
    scoreB: 12,
    venue: "Ariyana Convention Center",
    stream: "https://twitch.tv/esports",
  },
  {
    id: 5,
    date: "2024-12-16",
    time: "15:00",
    teamA: "Team Iota",
    teamB: "Team Kappa",
    logoA: "https://picsum.photos/seed/team9/60/60",
    logoB: "https://picsum.photos/seed/team10/60/60",
    tournament: "DOTA 2",
    stage: "Vòng bảng",
    status: "upcoming",
    scoreA: null,
    scoreB: null,
    venue: "Hanoi Arena",
    stream: "https://twitch.tv/esports",
  },
  {
    id: 6,
    date: "2024-12-16",
    time: "21:00",
    teamA: "Team Lambda",
    teamB: "Team Mu",
    logoA: "https://picsum.photos/seed/team11/60/60",
    logoB: "https://picsum.photos/seed/team12/60/60",
    tournament: "VALORANT CHAMPIONS",
    stage: "Chung kết",
    status: "upcoming",
    scoreA: null,
    scoreB: null,
    venue: "Saigon Exhibition Center",
    stream: "https://twitch.tv/esports",
  },
];

const groupMatchesByDate = (matches: any[]) => {
  return matches.reduce((groups, match) => {
    const date = match.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {});
};

const getStatusTag = (status: string, scoreA?: number, scoreB?: number) => {
  if (status === "completed") {
    return <Tag color="green">Đã kết thúc</Tag>;
  }
  if (status === "live") {
    return <Tag color="red">🔴 Đang trực tiếp</Tag>;
  }
  return <Tag color="blue">Sắp diễn ra</Tag>;
};

const getStageTag = (stage: string) => {
  const stageColors: { [key: string]: string } = {
    "Vòng bảng": "blue",
    "Tứ kết": "orange",
    "Bán kết": "purple",
    "Chung kết": "red",
  };
  return <Tag color={stageColors[stage]}>{stage}</Tag>;
};

export const SchedulePage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredMatches = mockMatches.filter((match) => {
    const gameMatch =
      selectedGame === "all" || match.tournament.includes(selectedGame);
    const statusMatch =
      selectedStatus === "all" || match.status === selectedStatus;
    return gameMatch && statusMatch;
  });

  const groupedMatches = groupMatchesByDate(filteredMatches);

  // Get unique tournaments for filter
  const tournaments = [
    ...new Set(mockMatches.map((match) => match.tournament)),
  ];

  return (
    <div
      style={{
        padding: "24px",
        background: PAGE_BACKGROUND_COLOR,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title
          level={1}
          style={{
            color: "#1a1a1a",
            marginBottom: 8,
            background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          LỊCH THI ĐẤU
        </Title>
        <Text type="secondary" style={{ fontSize: 18 }}>
          Theo dõi lịch trình các trận đấu và không bỏ lỡ trận đấu yêu thích
        </Text>
      </div>

      {/* Filters */}
      <Card
        style={{
          background: CARD_BACKGROUND_COLOR,
          border: `1px solid ${CARD_BORDER_COLOR}`,
          borderRadius: 12,
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                <FilterOutlined /> Lọc theo game
              </Text>
              <Select
                value={selectedGame}
                onChange={setSelectedGame}
                style={{ width: "100%" }}
                size="large"
              >
                <Option value="all">Tất cả game</Option>
                {tournaments.map((tournament) => (
                  <Option key={tournament} value={tournament}>
                    {tournament}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                <ClockCircleOutlined /> Trạng thái
              </Text>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: "100%" }}
                size="large"
              >
                <Option value="all">Tất cả</Option>
                <Option value="upcoming">Sắp diễn ra</Option>
                <Option value="completed">Đã kết thúc</Option>
                <Option value="live">Đang trực tiếp</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Tổng số trận
              </Text>
              <Title level={3} style={{ color: "#722ed1", margin: 0 }}>
                {filteredMatches.length}
              </Title>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Schedule Timeline */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {Object.entries(groupedMatches).map(
            ([date, matches]: [string, any]) => (
              <Card
                key={date}
                style={{
                  background: "white",
                  border: `1px solid ${CARD_BORDER_COLOR}`,
                  borderRadius: 12,
                  marginBottom: 24,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                title={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <CalendarOutlined style={{ color: "#722ed1" }} />
                    <Text strong style={{ fontSize: 18 }}>
                      {new Date(date).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                    <Badge
                      count={matches.length}
                      style={{ backgroundColor: "#722ed1" }}
                    />
                  </div>
                }
              >
                <Timeline
                  mode="left"
                  items={matches.map((match: any) => ({
                    dot: (
                      <ClockCircleOutlined
                        style={{
                          fontSize: "16px",
                          color:
                            match.status === "completed"
                              ? "#52c41a"
                              : match.status === "live"
                                ? "#ff4d4f"
                                : "#1890ff",
                        }}
                      />
                    ),
                    color:
                      match.status === "completed"
                        ? "green"
                        : match.status === "live"
                          ? "red"
                          : "blue",
                    children: (
                      <Card
                        style={{
                          marginLeft: 16,
                          border: `1px solid ${
                            match.status === "completed"
                              ? "#d9f7be"
                              : match.status === "live"
                                ? "#ffccc7"
                                : "#e6f7ff"
                          }`,
                          background:
                            match.status === "completed"
                              ? "#f6ffed"
                              : match.status === "live"
                                ? "#fff2e8"
                                : "#f0f8ff",
                        }}
                        bodyStyle={{ padding: 16 }}
                      >
                        <Row gutter={[16, 16]} align="middle">
                          <Col xs={24} sm={8}>
                            <div style={{ textAlign: "center" }}>
                              <Avatar size={50} src={match.logoA} />
                              <Text
                                strong
                                style={{ display: "block", marginTop: 8 }}
                              >
                                {match.teamA}
                              </Text>
                              {match.scoreA !== null && (
                                <Text
                                  strong
                                  style={{ fontSize: 18, color: "#ff4d4f" }}
                                >
                                  {match.scoreA}
                                </Text>
                              )}
                            </div>
                          </Col>

                          <Col xs={24} sm={8}>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ marginBottom: 8 }}>
                                {getStatusTag(
                                  match.status,
                                  match.scoreA,
                                  match.scoreB,
                                )}
                              </div>
                              <Text
                                strong
                                style={{ fontSize: 20, color: "#722ed1" }}
                              >
                                VS
                              </Text>
                              <div style={{ marginTop: 8 }}>
                                <Text type="secondary">
                                  <ClockCircleOutlined /> {match.time}
                                </Text>
                              </div>
                              <div>{getStageTag(match.stage)}</div>
                            </div>
                          </Col>

                          <Col xs={24} sm={8}>
                            <div style={{ textAlign: "center" }}>
                              <Avatar size={50} src={match.logoB} />
                              <Text
                                strong
                                style={{ display: "block", marginTop: 8 }}
                              >
                                {match.teamB}
                              </Text>
                              {match.scoreB !== null && (
                                <Text
                                  strong
                                  style={{ fontSize: 18, color: "#ff4d4f" }}
                                >
                                  {match.scoreB}
                                </Text>
                              )}
                            </div>
                          </Col>
                        </Row>

                        <Divider style={{ margin: "12px 0" }} />

                        <Row justify="space-between" align="middle">
                          <Col>
                            <Space>
                              <TrophyOutlined style={{ color: "#faad14" }} />
                              <Text strong>{match.tournament}</Text>
                            </Space>
                          </Col>
                          <Col>
                            <Space>
                              <TeamOutlined style={{ color: "#1890ff" }} />
                              <Text type="secondary">{match.venue}</Text>
                            </Space>
                          </Col>
                          <Col>
                            <Button
                              type="primary"
                              size="small"
                              icon={<PlayCircleOutlined />}
                              disabled={match.status === "upcoming"}
                            >
                              {match.status === "completed"
                                ? "Xem lại"
                                : match.status === "live"
                                  ? "Xem trực tiếp"
                                  : "Theo dõi"}
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    ),
                  }))}
                />
              </Card>
            ),
          )}
        </Col>

        {/* Sidebar - Upcoming Highlights */}
        <Col xs={24} lg={8}>
          <Card
            style={{
              background: CARD_BACKGROUND_COLOR,
              border: `1px solid ${CARD_BORDER_COLOR}`,
              borderRadius: 12,
              marginBottom: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            title={
              <Text strong style={{ fontSize: 16 }}>
                ⚡ Trận đấu sắp diễn ra
              </Text>
            }
          >
            <List
              dataSource={mockMatches
                .filter((match) => match.status === "upcoming")
                .slice(0, 3)}
              renderItem={(match) => (
                <List.Item>
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <Text strong>
                        {match.teamA} vs {match.teamB}
                      </Text>
                      <Tag color="blue">{match.time}</Tag>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {match.tournament}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {match.date}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <Card
            style={{
              background: CARD_BACKGROUND_COLOR,
              border: `1px solid ${CARD_BORDER_COLOR}`,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            title={
              <Text strong style={{ fontSize: 16 }}>
                🏆 Giải đấu đang diễn ra
              </Text>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              {tournaments.map((tournament) => (
                <div
                  key={tournament}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: "white",
                    borderRadius: 8,
                    border: "1px solid #e8e8e8",
                  }}
                >
                  <Text strong>{tournament}</Text>
                  <Badge count="Live" style={{ backgroundColor: "#ff4d4f" }} />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Call to Action */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Paragraph style={{ fontSize: 16, color: "#666" }}>
          Đừng bỏ lỡ bất kỳ trận đấu nào! Đặt lịch nhắc nhở ngay bây giờ.
        </Paragraph>
        <Space size="large">
          <Button type="primary" size="large">
            📅 Thêm vào lịch
          </Button>
          <Button size="large">🔔 Bật thông báo</Button>
        </Space>
      </div>
    </div>
  );
};

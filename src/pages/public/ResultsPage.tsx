import React from "react";
import {
  Card,
  List,
  Typography,
  Tag,
  Row,
  Col,
  Timeline,
  Progress,
} from "antd";
import {
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const mockResults = [
  {
    match: "Đội A vs Đội B",
    winner: "Đội A",
    score: "2 - 1",
    date: "2024-01-15",
    status: "completed",
    highlight: true,
  },
  {
    match: "Đội C vs Đội D",
    winner: "Đội D",
    score: "0 - 2",
    date: "2024-01-14",
    status: "completed",
    highlight: false,
  },
  {
    match: "Đội E vs Đội F",
    winner: "Đội E",
    score: "2 - 0",
    date: "2024-01-13",
    status: "completed",
    highlight: true,
  },
  {
    match: "Đội G vs Đội H",
    winner: "Hòa",
    score: "1 - 1",
    date: "2024-01-12",
    status: "completed",
    highlight: false,
  },
];

const upcomingMatches = [
  { match: "Đội A vs Đội C", date: "2024-01-18", time: "19:00" },
  { match: "Đội B vs Đội D", date: "2024-01-19", time: "20:30" },
  { match: "Đội E vs Đội G", date: "2024-01-20", time: "18:00" },
];

const PAGE_BACKGROUND_COLOR = "#f8fafc";
const CARD_BACKGROUND_COLOR = "#ffffff";
const PRIMARY_COLOR = "#1890ff";
const SUCCESS_COLOR = "#52c41a";
const WARNING_COLOR = "#faad14";

export const ResultsPage: React.FC = () => {
  const getStatusIcon = (status: string, winner: string) => {
    if (status === "completed") {
      return winner === "Hòa" ? (
        <CloseCircleOutlined style={{ color: WARNING_COLOR }} />
      ) : (
        <CheckCircleOutlined style={{ color: SUCCESS_COLOR }} />
      );
    }
    return <CalendarOutlined style={{ color: PRIMARY_COLOR }} />;
  };

  const getStatusColor = (status: string, winner: string) => {
    if (status === "completed") {
      return winner === "Hòa" ? WARNING_COLOR : SUCCESS_COLOR;
    }
    return PRIMARY_COLOR;
  };

  return (
    <div
      style={{
        padding: 24,
        background: PAGE_BACKGROUND_COLOR,
        minHeight: "100vh",
      }}
    >
      <Row gutter={[24, 24]}>
        {/* Kết quả gần đây */}
        <Col xs={24} lg={16}>
          <Card
            style={{
              background: CARD_BACKGROUND_COLOR,
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              height: "100%",
            }}
          >
            <div style={{ paddingBottom: 16 }}>
              <Title
                level={2}
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FireOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
                Kết Quả Gần Đây
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Các trận đấu mới nhất và kết quả
              </Text>
            </div>

            <List
              dataSource={mockResults}
              renderItem={(item, index) => (
                <List.Item
                  style={{
                    padding: "20px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    background: item.highlight ? "#f6ffed" : "transparent",
                    borderRadius: 8,
                    marginBottom: 8,
                    border: item.highlight
                      ? `1px solid ${SUCCESS_COLOR}20`
                      : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${getStatusColor(item.status, item.winner)} 0%, ${getStatusColor(item.status, item.winner)}80 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {getStatusIcon(item.status, item.winner)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <Text strong style={{ fontSize: 16 }}>
                          {item.match}
                        </Text>
                        <Tag
                          color={getStatusColor(item.status, item.winner)}
                          style={{ fontSize: 12, fontWeight: "bold" }}
                        >
                          {item.date}
                        </Tag>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <TrophyOutlined style={{ color: WARNING_COLOR }} />
                          <Text
                            strong
                            style={{
                              color: getStatusColor(item.status, item.winner),
                            }}
                          >
                            {item.winner === "Hòa"
                              ? "Trận hòa"
                              : `🏆 ${item.winner}`}
                          </Text>
                        </div>
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                            color: "white",
                            padding: "4px 12px",
                            borderRadius: 12,
                            fontWeight: "bold",
                            fontSize: 14,
                          }}
                        >
                          {item.score}
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Lịch thi đấu sắp tới */}
        <Col xs={24} lg={8}>
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
                <CalendarOutlined style={{ color: PRIMARY_COLOR }} />
                <Text strong style={{ fontSize: 18 }}>
                  Sắp Diễn Ra
                </Text>
              </div>
            }
          >
            <Timeline>
              {upcomingMatches.map((match, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: PRIMARY_COLOR,
                      }}
                    />
                  }
                >
                  <div>
                    <Text strong style={{ display: "block" }}>
                      {match.match}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {match.date} • {match.time}
                    </Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

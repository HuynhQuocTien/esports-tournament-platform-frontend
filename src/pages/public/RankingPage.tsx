import React from "react";
import {
  Card,
  Table,
  Typography,
  Tag,
  Progress,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  TrophyOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  CrownOutlined,
  FireOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const mockRanking = [
  {
    key: "1",
    team: "Đội A",
    wins: 5,
    losses: 1,
    draws: 0,
    points: 15,
    form: ["W", "W", "L", "W", "W"],
  },
  {
    key: "2",
    team: "Đội B",
    wins: 4,
    losses: 2,
    draws: 0,
    points: 12,
    form: ["W", "L", "W", "W", "L"],
  },
  {
    key: "3",
    team: "Đội C",
    wins: 3,
    losses: 3,
    draws: 0,
    points: 9,
    form: ["L", "W", "W", "L", "L"],
  },
  {
    key: "4",
    team: "Đội D",
    wins: 2,
    losses: 4,
    draws: 0,
    points: 6,
    form: ["L", "L", "W", "L", "W"],
  },
  {
    key: "5",
    team: "Đội E",
    wins: 1,
    losses: 5,
    draws: 0,
    points: 3,
    form: ["L", "L", "L", "W", "L"],
  },
];

const PAGE_BACKGROUND_COLOR = "#f8fafc";
const CARD_BACKGROUND_COLOR = "#ffffff";
const PRIMARY_COLOR = "#1890ff";
const SUCCESS_COLOR = "#52c41a";
const WARNING_COLOR = "#faad14";

export const RankingPage: React.FC = () => {
  const columns = [
    {
      title: "Vị trí",
      dataIndex: "key",
      key: "position",
      render: (key: string, record: any, index: number) => (
        <div style={{ textAlign: "center" }}>
          {index === 0 ? (
            <CrownOutlined style={{ fontSize: 20, color: WARNING_COLOR }} />
          ) : (
            <Text strong style={{ fontSize: 16 }}>
              {key}
            </Text>
          )}
        </div>
      ),
      width: 80,
    },
    {
      title: "Đội",
      dataIndex: "team",
      key: "team",
      render: (team: string, record: any, index: number) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: index === 0 ? WARNING_COLOR : PRIMARY_COLOR,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {team.charAt(team.length - 1)}
          </div>
          <Text strong style={{ fontSize: 16 }}>
            {team}
          </Text>
        </div>
      ),
    },
    {
      title: "Thắng",
      dataIndex: "wins",
      key: "wins",
      render: (wins: number) => (
        <Tag color={SUCCESS_COLOR} style={{ fontSize: 14, padding: "4px 8px" }}>
          {wins}
        </Tag>
      ),
      align: "center" as const,
    },
    {
      title: "Thua",
      dataIndex: "losses",
      key: "losses",
      render: (losses: number) => (
        <Tag color="#ff4d4f" style={{ fontSize: 14, padding: "4px 8px" }}>
          {losses}
        </Tag>
      ),
      align: "center" as const,
    },
    {
      title: "Phong độ",
      dataIndex: "form",
      key: "form",
      render: (form: string[]) => (
        <div style={{ display: "flex", gap: 4 }}>
          {form.map((result, index) => (
            <div
              key={index}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background:
                  result === "W"
                    ? SUCCESS_COLOR
                    : result === "L"
                      ? "#ff4d4f"
                      : "#faad14",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {result}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Điểm",
      dataIndex: "points",
      key: "points",
      render: (points: number) => (
        <div
          style={{
            background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
            color: "white",
            padding: "8px 16px",
            borderRadius: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {points}
        </div>
      ),
      align: "center" as const,
    },
  ];

  const topTeam = mockRanking[0];

  return (
    <div
      style={{
        padding: 24,
        background: PAGE_BACKGROUND_COLOR,
        minHeight: "100vh",
      }}
    >
      {/* Header với thống kê */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đội dẫn đầu"
              value={topTeam.team}
              prefix={<TrophyOutlined style={{ color: WARNING_COLOR }} />}
              valueStyle={{ color: WARNING_COLOR, fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Số điểm cao nhất"
              value={topTeam.points}
              prefix={<RiseOutlined style={{ color: SUCCESS_COLOR }} />}
              valueStyle={{ color: SUCCESS_COLOR }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số đội"
              value={mockRanking.length}
              prefix={<TeamOutlined style={{ color: PRIMARY_COLOR }} />}
              valueStyle={{ color: PRIMARY_COLOR }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng xếp hạng chính */}
      <Card
        style={{
          background: CARD_BACKGROUND_COLOR,
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px 0 24px 0" }}>
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
                background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                width: 48,
                height: 48,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrophyOutlined style={{ fontSize: 24, color: "white" }} />
            </div>
            Bảng Xếp Hạng
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Cập nhật lần cuối: Hôm nay, 14:30
          </Text>
        </div>

        <Table
          dataSource={mockRanking}
          columns={columns}
          pagination={false}
          rowKey="key"
          rowClassName={(record, index) =>
            index === 0 ? "first-place-row" : index < 3 ? "top-three-row" : ""
          }
        />
      </Card>
    </div>
  );
};

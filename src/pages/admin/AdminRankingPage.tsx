import React from "react";
import { Table, Card, Typography, Tag, Progress, Avatar, Space } from "antd";
import {
  CrownOutlined,
  TrophyOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export const AdminRankingPage: React.FC = () => {
  const ranking = [
    {
      rank: 1,
      team: "Team Phoenix",
      points: 1500,
      change: "up",
      wins: 12,
      losses: 2,
      avatar: "https://picsum.photos/seed/team1/40/40",
    },
    {
      rank: 2,
      team: "Team Alpha",
      points: 1450,
      change: "down",
      wins: 11,
      losses: 3,
      avatar: "https://picsum.photos/seed/team2/40/40",
    },
    {
      rank: 3,
      team: "Team Storm",
      points: 1420,
      change: "up",
      wins: 10,
      losses: 4,
      avatar: "https://picsum.photos/seed/team3/40/40",
    },
    {
      rank: 4,
      team: "Team Thunder",
      points: 1380,
      change: "up",
      wins: 9,
      losses: 5,
      avatar: "https://picsum.photos/seed/team4/40/40",
    },
    {
      rank: 5,
      team: "Team Dragon",
      points: 1350,
      change: "down",
      wins: 8,
      losses: 6,
      avatar: "https://picsum.photos/seed/team5/40/40",
    },
  ];

  const columns = [
    {
      title: "Hạng",
      dataIndex: "rank",
      key: "rank",
      render: (rank: number) => (
        <div style={{ textAlign: "center" }}>
          {rank === 1 ? (
            <CrownOutlined style={{ fontSize: 20, color: "#faad14" }} />
          ) : (
            <Text strong style={{ fontSize: 16 }}>
              #{rank}
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
      render: (team: string, record: any) => (
        <Space>
          <Avatar src={record.avatar} size="small" />
          <Text strong>{team}</Text>
          {record.change === "up" && (
            <RiseOutlined style={{ color: "#52c41a" }} />
          )}
          {record.change === "down" && (
            <FallOutlined style={{ color: "#ff4d4f" }} />
          )}
        </Space>
      ),
    },
    {
      title: "Thắng/Thua",
      key: "record",
      render: (record: any) => (
        <Text>
          {record.wins}W - {record.losses}L
        </Text>
      ),
    },
    {
      title: "Tỷ lệ thắng",
      key: "winRate",
      render: (record: any) => {
        const winRate = (record.wins / (record.wins + record.losses)) * 100;
        return (
          <div style={{ width: 120 }}>
            <Progress
              percent={Math.round(winRate)}
              size="small"
              strokeColor={
                winRate >= 70
                  ? "#52c41a"
                  : winRate >= 50
                    ? "#faad14"
                    : "#ff4d4f"
              }
            />
          </div>
        );
      },
    },
    {
      title: "Điểm",
      dataIndex: "points",
      key: "points",
      render: (points: number) => (
        <Tag
          color="blue"
          style={{
            fontSize: 14,
            fontWeight: 600,
            background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
            border: "none",
            color: "white",
          }}
        >
          {points}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title
          level={2}
          style={{
            margin: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🏆 Bảng xếp hạng
        </Title>
        <Text type="secondary">Theo dõi thứ hạng và hiệu suất của các đội</Text>
      </div>

      <Card
        style={{
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        <Table
          dataSource={ranking}
          columns={columns}
          rowKey="rank"
          pagination={false}
        />
      </Card>

      {/* Stats Summary */}
      <div style={{ marginTop: 24 }}>
        <Card
          style={{
            borderRadius: 16,
            border: "none",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            background: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
            }}
          >
            <div>
              <TeamOutlined
                style={{ fontSize: 24, color: "#1890ff", marginBottom: 8 }}
              />
              <div>
                <Text strong style={{ fontSize: 18 }}>
                  5
                </Text>
                <Text
                  type="secondary"
                  style={{ display: "block", fontSize: 12 }}
                >
                  Tổng số đội
                </Text>
              </div>
            </div>
            <div>
              <TrophyOutlined
                style={{ fontSize: 24, color: "#faad14", marginBottom: 8 }}
              />
              <div>
                <Text strong style={{ fontSize: 18 }}>
                  50
                </Text>
                <Text
                  type="secondary"
                  style={{ display: "block", fontSize: 12 }}
                >
                  Trận đấu
                </Text>
              </div>
            </div>
            <div>
              <CrownOutlined
                style={{ fontSize: 24, color: "#52c41a", marginBottom: 8 }}
              />
              <div>
                <Text strong style={{ fontSize: 18 }}>
                  75%
                </Text>
                <Text
                  type="secondary"
                  style={{ display: "block", fontSize: 12 }}
                >
                  Tỷ lệ hoàn thành
                </Text>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

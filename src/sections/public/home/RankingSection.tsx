import React from "react";
import { Table, Typography, Button, Tag, Avatar } from "antd";
import { Link } from "react-router-dom";
import { CrownOutlined, RiseOutlined, FallOutlined, MinusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const data = [
  { 
    key: 1, 
    team: "Team Alpha", 
    win: 10, 
    lose: 2, 
    points: 30,
    trend: "up",
    logo: "https://picsum.photos/seed/team1/50/50"
  },
  { 
    key: 2, 
    team: "Team Beta", 
    win: 8, 
    lose: 4, 
    points: 24,
    trend: "down",
    logo: "https://picsum.photos/seed/team2/50/50"
  },
  { 
    key: 3, 
    team: "Team Gamma", 
    win: 7, 
    lose: 5, 
    points: 21,
    trend: "up",
    logo: "https://picsum.photos/seed/team3/50/50"
  },
  { 
    key: 4, 
    team: "Team Delta", 
    win: 6, 
    lose: 6, 
    points: 18,
    trend: "stable",
    logo: "https://picsum.photos/seed/team4/50/50"
  },
];

const columns = [
  {
    title: "Hạng",
    dataIndex: "key",
    key: "rank",
    render: (key: number) => (
      <div style={{ textAlign: "center" }}>
        {key === 1 ? (
          <CrownOutlined style={{ fontSize: "20px", color: "#faad14" }} />
        ) : (
          <Text strong style={{ fontSize: "16px", color: "#1a1a1a" }}>
            #{key}
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
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Avatar src={record.logo} size="large" />
        <Text strong style={{ color: "#1a1a1a" }}>{team}</Text>
      </div>
    ),
  },
  {
    title: "Thắng",
    dataIndex: "win",
    key: "win",
    render: (win: number) => (
      <Tag color="green" style={{ margin: 0, fontWeight: 600 }}>{win}</Tag>
    ),
    align: 'center' as const,
  },
  {
    title: "Thua",
    dataIndex: "lose",
    key: "lose",
    render: (lose: number) => (
      <Tag color="red" style={{ margin: 0, fontWeight: 600 }}>{lose}</Tag>
    ),
    align: 'center' as const,
  },
  {
    title: "Xu hướng",
    dataIndex: "trend",
    key: "trend",
    render: (trend: string) => (
      <div style={{ textAlign: "center" }}>
        {trend === "up" && <RiseOutlined style={{ color: "#52c41a", fontSize: "16px" }} />}
        {trend === "down" && <FallOutlined style={{ color: "#ff4d4f", fontSize: "16px" }} />}
        {trend === "stable" && <MinusOutlined style={{ color: "#faad14", fontSize: "16px" }} />}
      </div>
    ),
    align: 'center' as const,
    width: 100,
  },
  {
    title: "Điểm",
    dataIndex: "points",
    key: "points",
    render: (points: number) => (
      <div
        style={{
          background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
          color: "white",
          padding: "4px 12px",
          borderRadius: "16px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {points}
      </div>
    ),
    align: 'center' as const,
  },
];

export const RankingSection: React.FC = () => {
  return (
    <section style={{ background: "var(--ant-color-bg-container)", border: "1px solid var(--ant-color-border-secondary)", padding: 32, borderRadius: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ color: "#1a1a1a", margin: 0 }}>
            BẢNG XẾP HẠNG
          </Title>
          <Text style={{ color: "#666666", fontSize: "16px" }}>
            Cập nhật kết quả và thứ hạng mới nhất
          </Text>
        </div>
        <Link to="/ranking">
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

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        style={{ 
          marginTop: 24,
          borderRadius: 12,
          background: "white",
        }}
        rowClassName={(record, index) => 
          index === 0 ? "first-place-row" : ""
        }
      />
    </section>
  );
};
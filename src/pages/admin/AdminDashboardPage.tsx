import React from "react";
import { Card, Col, Row, Typography, List, Tag, Progress, Button } from "antd";
import {
  TrophyOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  DollarOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const { Title, Text } = Typography;

const chartData = [
  { month: "T1", players: 200, revenue: 50000000 },
  { month: "T2", players: 350, revenue: 75000000 },
  { month: "T3", players: 500, revenue: 120000000 },
  { month: "T4", players: 700, revenue: 180000000 },
  { month: "T5", players: 850, revenue: 220000000 },
  { month: "T6", players: 1000, revenue: 300000000 },
];

const activities = [
  {
    id: 1,
    action: "Đội Phoenix đăng ký tham gia giải Esports Cup 2025",
    time: "2 phút trước",
    type: "success",
  },
  {
    id: 2,
    action: "Người dùng admin cập nhật bảng xếp hạng",
    time: "15 phút trước",
    type: "info",
  },
  {
    id: 3,
    action: "Đội Storm thắng trận với tỷ số 2-0",
    time: "1 giờ trước",
    type: "success",
  },
  {
    id: 4,
    action: "Thêm giải đấu mới: Valorant Masters",
    time: "2 giờ trước",
    type: "warning",
  },
];

const statsData = [
  {
    title: "Giải đấu",
    value: 12,
    prefix: <TrophyOutlined />,
    color: "#1890ff",
    progress: 75,
    change: "+12%",
  },
  {
    title: "Đội tham gia",
    value: 32,
    prefix: <TeamOutlined />,
    color: "#52c41a",
    progress: 60,
    change: "+8%",
  },
  {
    title: "Người dùng",
    value: 1200,
    prefix: <UserOutlined />,
    color: "#faad14",
    progress: 85,
    change: "+25%",
  },
  {
    title: "Trận đấu",
    value: 58,
    prefix: <BarChartOutlined />,
    color: "#ff4d4f",
    progress: 90,
    change: "+15%",
  },
];

export const AdminDashboardPage: React.FC = () => {
  const getStatusTag = (type: string) => {
    const config = {
      success: { color: "green", text: "Thành công" },
      info: { color: "blue", text: "Thông tin" },
      warning: { color: "orange", text: "Cảnh báo" },
    };
    const statusConfig = config[type as keyof typeof config];
    return (
      <Tag color={statusConfig.color} style={{ fontSize: 10 }}>
        {statusConfig.text}
      </Tag>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title
          level={2}
          style={{
            margin: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Tổng quan hệ thống
        </Title>
        <Text type="secondary">
          Theo dõi hiệu suất và hoạt động của hệ thống
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{
                borderRadius: 16,
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                background: "white",
              }}
              bodyStyle={{ padding: 20 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div>
                  <Text
                    type="secondary"
                    style={{ fontSize: 14, fontWeight: 500 }}
                  >
                    {stat.title}
                  </Text>
                  <Title
                    level={2}
                    style={{ margin: "8px 0", color: stat.color, fontSize: 32 }}
                  >
                    {stat.value}
                  </Title>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <ArrowUpOutlined
                      style={{ color: "#52c41a", fontSize: 12 }}
                    />
                    <Text
                      style={{
                        color: "#52c41a",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {stat.change}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      so với tháng trước
                    </Text>
                  </div>
                </div>
                <div
                  style={{
                    background: `${stat.color}20`,
                    color: stat.color,
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {stat.prefix}
                </div>
              </div>
              <Progress
                percent={stat.progress}
                strokeColor={stat.color}
                size="small"
                showInfo={false}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts and Activities */}
      <Row gutter={[24, 24]}>
        {/* Growth Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <RocketOutlined style={{ color: "#1890ff" }} />
                <span>Tăng trưởng hệ thống</span>
              </div>
            }
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: "white",
            }}
            extra={
              <Button type="link" icon={<EyeOutlined />}>
                Xem chi tiết
              </Button>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => [
                    name === "players"
                      ? `${value} người`
                      : `${Number(value).toLocaleString()} VNĐ`,
                    name === "players" ? "Người chơi" : "Doanh thu",
                  ]}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="players"
                  stroke="#1890ff"
                  fill="#1890ff"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#52c41a"
                  strokeWidth={2}
                  dot={{ fill: "#52c41a" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CalendarOutlined style={{ color: "#faad14" }} />
                <span>Hoạt động gần đây</span>
              </div>
            }
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: "white",
              height: "100%",
            }}
            extra={<Button type="link">Xem tất cả</Button>}
          >
            <List
              dataSource={activities}
              renderItem={(item) => (
                <List.Item style={{ padding: "12px 0", border: "none" }}>
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 4,
                      }}
                    >
                      <Text style={{ fontSize: 13, lineHeight: 1.4, flex: 1 }}>
                        {item.action}
                      </Text>
                      {getStatusTag(item.type)}
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {item.time}
                    </Text>
                  </div>
                </List.Item>
              )}
              style={{ maxHeight: 300, overflow: "auto" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card
            title="Doanh thu tháng này"
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: "white",
            }}
          >
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <DollarOutlined
                style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }}
              />
              <Title level={2} style={{ color: "#52c41a", margin: 0 }}>
                300M VNĐ
              </Title>
              <Text type="secondary">Tăng 25% so với tháng trước</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Tỷ lệ tham gia"
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: "white",
            }}
          >
            <div style={{ padding: "20px 0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Text>Đội hoàn thành đăng ký</Text>
                <Text strong>85%</Text>
              </div>
              <Progress percent={85} strokeColor="#52c41a" />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  marginTop: 20,
                }}
              >
                <Text>Giải đấu đang diễn ra</Text>
                <Text strong>67%</Text>
              </div>
              <Progress percent={67} strokeColor="#1890ff" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

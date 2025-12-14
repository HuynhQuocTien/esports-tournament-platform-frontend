import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Select,
  DatePicker,
  Space,
  Progress,
  List,
  Tag,
} from "antd";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  DollarOutlined,
  RiseOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const revenueData = [
  { month: "T1", revenue: 50000000, tournaments: 2 },
  { month: "T2", revenue: 75000000, tournaments: 3 },
  { month: "T3", revenue: 120000000, tournaments: 4 },
  { month: "T4", revenue: 180000000, tournaments: 5 },
  { month: "T5", revenue: 220000000, tournaments: 6 },
  { month: "T6", revenue: 300000000, tournaments: 8 },
];

const gameDistributionData = [
  { name: "Valorant", value: 35, color: "#1890ff" },
  { name: "League of Legends", value: 25, color: "#52c41a" },
  { name: "Counter-Strike 2", value: 20, color: "#faad14" },
  { name: "DOTA 2", value: 15, color: "#ff4d4f" },
  { name: "PUBG Mobile", value: 5, color: "#722ed1" },
];

const userGrowthData = [
  { week: "W1", newUsers: 50, activeUsers: 200 },
  { week: "W2", newUsers: 80, activeUsers: 350 },
  { week: "W3", newUsers: 120, activeUsers: 500 },
  { week: "W4", newUsers: 150, activeUsers: 700 },
  { week: "W5", newUsers: 200, activeUsers: 850 },
  { week: "W6", newUsers: 250, activeUsers: 1000 },
];

const topPerformers = [
  { id: 1, name: "Team Phoenix", winRate: 85, matches: 20, revenue: 50000000 },
  { id: 2, name: "Team Alpha", winRate: 78, matches: 18, revenue: 45000000 },
  { id: 3, name: "Team Storm", winRate: 72, matches: 15, revenue: 38000000 },
  { id: 4, name: "Team Thunder", winRate: 68, matches: 12, revenue: 30000000 },
];

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            📊 Thống kê & Báo cáo
          </Title>
          <Text type="secondary">Phân tích hiệu suất và xu hướng hệ thống</Text>
        </div>
        <Space>
          <Select defaultValue="6months" style={{ width: 150 }}>
            <Option value="1month">1 tháng</Option>
            <Option value="3months">3 tháng</Option>
            <Option value="6months">6 tháng</Option>
            <Option value="1year">1 năm</Option>
          </Select>
          <RangePicker />
        </Space>
      </div>

      {/* Key Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={300000000}
              formatter={(value) => `${Number(value).toLocaleString()} VNĐ`}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <RiseOutlined style={{ color: "#52c41a", fontSize: 12 }} />
              <Text style={{ color: "#52c41a", fontSize: 12 }}>
                +25% so với tháng trước
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng hoạt động"
              value={1250}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <RiseOutlined style={{ color: "#52c41a", fontSize: 12 }} />
              <Text style={{ color: "#52c41a", fontSize: 12 }}>
                +15% so với tháng trước
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giải đấu đang chạy"
              value={8}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                12 giải đã hoàn thành
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ giữ chân"
              value={85}
              suffix="%"
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={85} size="small" strokeColor="#ff4d4f" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title="Doanh thu & Giải đấu theo tháng"
            extra={<EyeOutlined />}
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue"
                      ? `${Number(value).toLocaleString()} VNĐ`
                      : value,
                    name === "revenue" ? "Doanh thu" : "Giải đấu",
                  ]}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="#1890ff"
                  name="Doanh thu"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="tournaments"
                  stroke="#52c41a"
                  strokeWidth={2}
                  name="Giải đấu"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Phân bố theo game"
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gameDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gameDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Tăng trưởng người dùng"
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#1890ff"
                  strokeWidth={2}
                  name="Người dùng mới"
                />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#52c41a"
                  strokeWidth={2}
                  name="Người dùng hoạt động"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Top đội hiệu suất cao"
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <List
              dataSource={topPerformers}
              renderItem={(item) => (
                <List.Item>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ display: "block" }}>
                        {item.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.matches} trận • {item.revenue.toLocaleString()}{" "}
                        VNĐ
                      </Text>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Progress
                        percent={item.winRate}
                        size="small"
                        style={{ width: 100 }}
                        strokeColor={
                          item.winRate >= 80
                            ? "#52c41a"
                            : item.winRate >= 70
                              ? "#faad14"
                              : "#ff4d4f"
                        }
                      />
                      <Text
                        style={{ fontSize: 12, display: "block", marginTop: 4 }}
                      >
                        {item.winRate}% thắng
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card
            title="Hiệu suất hệ thống"
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text>Uptime Server</Text>
                  <Text strong>99.8%</Text>
                </div>
                <Progress percent={99.8} strokeColor="#52c41a" />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text>Thời gian phản hồi</Text>
                  <Text strong>120ms</Text>
                </div>
                <Progress percent={85} strokeColor="#1890ff" />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text>Dung lượng lưu trữ</Text>
                  <Text strong>65%</Text>
                </div>
                <Progress percent={65} strokeColor="#faad14" />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title="Tỷ lệ chuyển đổi"
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  color: "#1890ff",
                  marginBottom: 8,
                }}
              >
                4.2%
              </div>
              <Text type="secondary">Tỷ lệ chuyển đổi trung bình</Text>
              <div style={{ marginTop: 16 }}>
                <Tag color="green">+0.5% so với tháng trước</Tag>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title="Xu hướng theo mùa"
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <List
              size="small"
              dataSource={[
                { season: "Mùa xuân", growth: "+35%", color: "green" },
                { season: "Mùa hè", growth: "+45%", color: "orange" },
                { season: "Mùa thu", growth: "+25%", color: "gold" },
                { season: "Mùa đông", growth: "+15%", color: "blue" },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Text>{item.season}</Text>
                    <Tag color={item.color}>{item.growth}</Tag>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

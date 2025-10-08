import React from "react";
import { Card, Col, Row, Statistic, Typography, List } from "antd";
import { TrophyOutlined, TeamOutlined, UserOutlined, BarChartOutlined } from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const { Title } = Typography;

// Giả lập dữ liệu biểu đồ
const chartData = [
  { month: "T1", players: 200 },
  { month: "T2", players: 350 },
  { month: "T3", players: 500 },
  { month: "T4", players: 700 },
  { month: "T5", players: 850 },
  { month: "T6", players: 1000 },
];

// Giả lập dữ liệu hoạt động gần đây
const activities = [
  "Đội Phoenix đăng ký tham gia giải Esports Cup 2025",
  "Người dùng admin cập nhật bảng xếp hạng",
  "Đội Storm thắng trận với tỷ số 2-0",
  "Thêm giải đấu mới: Valorant Masters",
];

export const AdminDashboardPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Tổng quan hệ thống</Title>

      {/* Thống kê nhanh */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Giải đấu" value={12} prefix={<TrophyOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Đội tham gia" value={32} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Người dùng" value={1200} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Trận đấu" value={58} prefix={<BarChartOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ tăng trưởng */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={16}>
          <Card title="Tăng trưởng người chơi">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="players" stroke="#1890ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Hoạt động gần đây */}
        <Col xs={24} md={8}>
          <Card title="Hoạt động gần đây">
            <List
              dataSource={activities}
              renderItem={(item) => <List.Item>📢 {item}</List.Item>}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
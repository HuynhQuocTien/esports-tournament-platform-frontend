import { Card, Row, Col, Statistic } from "antd";
import { TeamOutlined, TrophyOutlined, BarChartOutlined, UserOutlined } from "@ant-design/icons";


export const AdminPage: React.FC = () => {
  return (
    <div>
      <h2>Tổng quan quản trị</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Giải đấu" value={12} prefix={<TrophyOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đội tham gia" value={48} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Người dùng" value={120} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Sự kiện đang diễn ra" value={3} prefix={<BarChartOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
import React from 'react';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  Button,
  Timeline,
  Statistic,
  Progress,
  Typography,
  Space,
  Alert
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { TournamentData } from '../../../common/types/tournament';

const { Title, Text } = Typography;

interface TournamentOverviewProps {
  data: TournamentData;
  updateData: (key: keyof TournamentData, data: any) => void;
}

const TournamentOverview: React.FC<TournamentOverviewProps> = ({ data }) => {
  const {
    basicInfo = {},
    settings = {},
    stages = [],
    prizes = [],
    rules = []
  } = data;

  const getStatusColor = (status?: string): string => {
    const colors: { [key: string]: string } = {
      draft: 'blue',
      announced: 'orange',
      registration_open: 'green',
      live: 'red',
      completed: 'gray'
    };
    return colors[status || 'draft'] || 'blue';
  };

  const getTypeLabel = (type?: string): string => {
    const types: { [key: string]: string } = {
      single_elimination: 'Loại trực tiếp',
      double_elimination: 'Loại kép',
      round_robin: 'Vòng tròn',
      swiss: 'Thụy Sĩ',
      group_stage: 'Vòng bảng + Playoffs'
    };
    return types[type || ''] || type || 'Chưa chọn';
  };

  // Tính toán tiến độ hoàn thành
  const completionStats = {
    basicInfo: Object.keys(basicInfo).length > 3 ? 100 : 0,
    settings: Object.keys(settings).length > 3 ? 100 : 0,
    stages: stages.length > 0 ? 100 : 0,
    prizes: prizes.length > 0 ? 100 : 0,
    rules: rules.length > 0 ? 100 : 0
  };

  const totalCompletion = Math.round(Object.values(completionStats).reduce((a, b) => a + b, 0) / 5);

  // Kiểm tra các phần còn thiếu
  const missingSections = [
    { key: 'basicInfo', name: 'Thông tin cơ bản', completed: completionStats.basicInfo === 100 },
    { key: 'settings', name: 'Cài đặt', completed: completionStats.settings === 100 },
    { key: 'stages', name: 'Vòng đấu', completed: completionStats.stages === 100 },
    { key: 'prizes', name: 'Giải thưởng', completed: completionStats.prizes === 100 },
    { key: 'rules', name: 'Quy định', completed: completionStats.rules === 100 }
  ].filter(section => !section.completed);

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Tổng quan giải đấu">
            {missingSections.length > 0 && (
              <Alert
                message="Còn thiếu thông tin"
                description={`Cần hoàn thành ${missingSections.length} mục trước khi xuất bản: ${missingSections.map(s => s.name).join(', ')}`}
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                style={{ marginBottom: 16 }}
              />
            )}
            
            <Row gutter={[24, 24]}>
              <Col span={8}>
                <Statistic
                  title="Tiến độ hoàn thành"
                  value={totalCompletion}
                  suffix="%"
                  valueStyle={{ color: totalCompletion === 100 ? '#3f8600' : '#cf1322' }}
                />
                <Progress 
                  percent={totalCompletion} 
                  status={totalCompletion === 100 ? 'success' : 'active'}
                />
              </Col>
              
              <Col span={8}>
                <Statistic
                  title="Tổng giải thưởng"
                  value={settings.prizePool || 0}
                  prefix="₫"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              
              <Col span={8}>
                <Statistic
                  title="Số đội tối đa"
                  value={settings.maxTeams || 0}
                  prefix={<TeamOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Thông tin cơ bản" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tên giải đấu">
                {basicInfo.name || 'Chưa có'}
              </Descriptions.Item>
              <Descriptions.Item label="Game">
                {basicInfo.game || 'Chưa có'}
              </Descriptions.Item>
              <Descriptions.Item label="Thể thức">
                <Tag color="blue">
                  {getTypeLabel(settings.type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(basicInfo.status)}>
                  {basicInfo.status || 'draft'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian đăng ký">
                {basicInfo.registrationStart ? 
                  `${new Date(basicInfo.registrationStart).toLocaleDateString()} - ${new Date(basicInfo.registrationEnd || '').toLocaleDateString()}` 
                  : 'Chưa thiết lập'
                }
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Vòng đấu" size="small" style={{ marginTop: 16 }}>
            <Timeline>
              {stages.map((stage, index) => (
                <Timeline.Item
                  key={index}
                  dot={<ClockCircleOutlined />}
                  color="green"
                >
                  <strong>{stage.name}</strong>
                  <br />
                  <small>{getTypeLabel(stage.type)} - Thứ tự: {stage.stageOreder}</small>
                </Timeline.Item>
              ))}
              {stages.length === 0 && (
                <Timeline.Item color="red">
                  Chưa có vòng đấu nào được thiết lập
                </Timeline.Item>
              )}
            </Timeline>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Giải thưởng" size="small">
            {prizes.length > 0 ? (
              prizes.map((prize, index) => (
                <div key={index} style={{ marginBottom: 12, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space>
                    <Text strong>Hạng {prize.position}:</Text> 
                    <Text>{prize.description}</Text>
                    {prize.cashValue && (
                      <Tag color="green">
                        ₫{prize.cashValue.toLocaleString()}
                      </Tag>
                    )}
                  </Space>
                </div>
              ))
            ) : (
              <div style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>
                <TrophyOutlined style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }} />
                <br />
                Chưa có giải thưởng nào
              </div>
            )}
          </Card>

          <Card title="Thống kê" size="small" style={{ marginTop: 16 }}>
            <Row gutter={[8, 16]}>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                    {stages.length}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>Vòng đấu</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                    {prizes.length}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>Giải thưởng</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                    {rules.length}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>Quy định</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
                    {settings.maxTeams || 0}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>Đội tối đa</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Kiểm tra hoàn thành" size="small">
            <Row gutter={[16, 16]}>
              {[
                { key: 'basicInfo', name: 'Thông tin cơ bản', icon: '📝', completed: completionStats.basicInfo === 100 },
                { key: 'settings', name: 'Cài đặt', icon: '⚙️', completed: completionStats.settings === 100 },
                { key: 'stages', name: 'Vòng đấu', icon: '🏆', completed: completionStats.stages === 100 },
                { key: 'prizes', name: 'Giải thưởng', icon: '💰', completed: completionStats.prizes === 100 },
                { key: 'rules', name: 'Quy định', icon: '📜', completed: completionStats.rules === 100 }
              ].map((section, index) => (
                <Col span={4} key={index}>
                  <Card 
                    size="small" 
                    style={{ 
                      border: section.completed ? '2px solid #52c41a' : '1px solid #d9d9d9',
                      textAlign: 'center',
                      background: section.completed ? '#f6ffed' : '#fff'
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>
                      {section.icon}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                      {section.name}
                    </div>
                    <div style={{ fontSize: 10, color: section.completed ? '#52c41a' : '#ff4d4f' }}>
                      {section.completed ? '✅ Hoàn thành' : '❌ Chưa xong'}
                    </div>
                  </Card>
                </Col>
              ))}
              
              <Col span={4}>
                <Card 
                  size="small" 
                  style={{ 
                    border: totalCompletion === 100 ? '2px solid #52c41a' : '1px solid #d9d9d9',
                    textAlign: 'center',
                    background: totalCompletion === 100 ? '#f6ffed' : '#fff'
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>
                    🚀
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                    Xuất bản
                  </div>
                  <div style={{ fontSize: 10, color: totalCompletion === 100 ? '#52c41a' : '#ff4d4f' }}>
                    {totalCompletion === 100 ? '✅ Sẵn sàng' : '❌ Chưa sẵn sàng'}
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {totalCompletion === 100 && (
          <Col span={24}>
            <Alert
              message="Giải đấu đã sẵn sàng để xuất bản!"
              description="Tất cả các phần cần thiết đã được hoàn thành. Bạn có thể xuất bản giải đấu ngay bây giờ."
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              action={
                <Button size="small" type="primary">
                  Xuất bản ngay
                </Button>
              }
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default TournamentOverview;
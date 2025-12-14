import React from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Statistic,
  Progress,
  Alert
} from 'antd';
import {
  CheckCircleOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { TournamentStepProps } from '../../../common/types/tournament';
const TournamentOverview: React.FC<TournamentStepProps> = ({ data, updateData }) => {

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

  const completionStats = {
    basicInfo: Object.keys(data.basicInfo).length > 3 ? 100 : 0,
    settings: Object.keys(data.settings).length > 3 ? 100 : 0,
    stages: data.stages.length > 0 ? 100 : 0,
    rules: data.rules.length > 0 ? 100 : 0
  };

  const totalCompletion = Math.round(Object.values(completionStats).reduce((a, b) => a + b, 0) / 5);

  const missingSections = [
    { key: 'basicInfo', name: 'Thông tin cơ bản', completed: completionStats.basicInfo === 100 },
    { key: 'settings', name: 'Cài đặt', completed: completionStats.settings === 100 },
    { key: 'stages', name: 'Vòng đấu', completed: completionStats.stages === 100 },
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
                  title="Số đội tối đa"
                  value={data.settings.maxTeams}
                  prefix={<TeamOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* ... rest of the component remains the same ... */}
        
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
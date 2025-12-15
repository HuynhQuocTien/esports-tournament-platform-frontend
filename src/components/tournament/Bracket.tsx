// components/BracketVisualization.tsx
import React from 'react';
import { Card, Row, Col, Typography, Empty } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface BracketVisualizationProps {
  data: any;
  onMatchClick?: (match: any) => void;
}

const BracketVisualization: React.FC<BracketVisualizationProps> = ({
  data,
  onMatchClick,
}) => {
  if (!data || Object.keys(data).length === 0) {
    return <Empty description="Chưa có dữ liệu nhánh đấu" />;
  }

  const renderMatch = (match: any) => (
    <Card
      key={match.id}
      size="small"
      hoverable
      style={{
        marginBottom: 16,
        borderLeft: `4px solid ${
          match.status === 'COMPLETED' ? '#52c41a' :
          match.status === 'ONGOING' ? '#faad14' :
          match.status === 'SCHEDULED' ? '#1890ff' : '#d9d9d9'
        }`,
      }}
      onClick={() => onMatchClick?.(match)}
    >
      <div style={{ padding: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary">Trận {match.order}</Text>
        </div>
        
        {/* Team 1 */}
        <div
          style={{
            padding: '4px 8px',
            backgroundColor: match.team1 ? '#f6ffed' : '#fafafa',
            borderRadius: 4,
            marginBottom: 4,
          }}
        >
          <Text strong={!!match.team1}>
            {match.team1?.name || 'Chờ đội...'}
          </Text>
          {match.team1Score !== undefined && (
            <Text strong style={{ float: 'right' }}>
              {match.team1Score}
            </Text>
          )}
        </div>

        {/* VS */}
        <div style={{ textAlign: 'center', margin: '4px 0' }}>
          <Text type="secondary">VS</Text>
        </div>

        {/* Team 2 */}
        <div
          style={{
            padding: '4px 8px',
            backgroundColor: match.team2 ? '#f6ffed' : '#fafafa',
            borderRadius: 4,
          }}
        >
          <Text strong={!!match.team2}>
            {match.team2?.name || 'Chờ đội...'}
          </Text>
          {match.team2Score !== undefined && (
            <Text strong style={{ float: 'right' }}>
              {match.team2Score}
            </Text>
          )}
        </div>

        {/* Match Info */}
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid #f0f0f0',
            fontSize: '12px',
            color: '#999',
          }}
        >
          {match.scheduledTime && (
            <div>{new Date(match.scheduledTime).toLocaleString('vi-VN')}</div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: 16 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        <TrophyOutlined /> Nhánh đấu giải đấu
      </Title>
      
      <Row gutter={[32, 32]}>
        {Object.keys(data)
          .map(Number)
          .sort((a, b) => a - b)
          .map((round) => (
            <Col key={round} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                title={`Vòng ${round}`}
                size="small"
                style={{ height: '100%' }}
                headStyle={{ backgroundColor: '#fafafa' }}
              >
                {data[round].map(renderMatch)}
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default BracketVisualization;
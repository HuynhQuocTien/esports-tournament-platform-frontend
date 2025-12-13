import React from 'react';
import { Table, Tag, Card, Row, Col, Empty } from 'antd';
import type { StageConfig } from '../../../common/types/tournament';

interface StageScheduleProps {
  stageConfig: StageConfig;
  maxTeams: number;
}

const StageSchedule: React.FC<StageScheduleProps> = ({ stageConfig, maxTeams }) => {
  const { numberOfGroups = 1, teamsPerGroup = 4 } = stageConfig;
  
  if (stageConfig.type !== 'GROUP') {
    return <Empty description="Chỉ hỗ trợ xem trước cho thể thức vòng bảng" />;
  }

  const totalTeams = Math.min(maxTeams, numberOfGroups * teamsPerGroup);
  const matchesPerGroup = (teamsPerGroup * (teamsPerGroup - 1)) / 2;
  const totalMatches = numberOfGroups * matchesPerGroup;

  const columns = [
    {
      title: 'Bảng',
      dataIndex: 'group',
      key: 'group',
      render: (group: number) => (
        <Tag color="blue">Bảng {String.fromCharCode(64 + group)}</Tag>
      ),
    },
    {
      title: 'Số đội',
      dataIndex: 'teams',
      key: 'teams',
    },
    {
      title: 'Số trận',
      dataIndex: 'matches',
      key: 'matches',
    },
    {
      title: 'Lịch đấu',
      key: 'schedule',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          Mỗi đội đấu {record.teams - 1} trận
        </div>
      ),
    },
  ];

  const data = Array.from({ length: numberOfGroups }).map((_, index) => ({
    key: index,
    group: index + 1,
    teams: teamsPerGroup,
    matches: matchesPerGroup,
  }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{numberOfGroups}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Số bảng</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalTeams}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Tổng đội</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{matchesPerGroup}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Trận mỗi bảng</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalMatches}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Tổng trận</div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />

      <div style={{ marginTop: 16, fontSize: '12px', color: '#666' }}>
        <div><strong>Lưu ý:</strong></div>
        <ul>
          <li>Mỗi đội đấu với tất cả các đội khác trong cùng bảng</li>
          <li>Top {Math.ceil(teamsPerGroup / 2)} đội mỗi bảng sẽ vào vòng trong</li>
          <li>Thời gian mỗi trận: Khoảng 45-60 phút</li>
        </ul>
      </div>
    </div>
  );
};

export default StageSchedule;
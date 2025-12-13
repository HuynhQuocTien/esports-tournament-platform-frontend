import React from 'react';
import { Card, Row, Col, Tag, Empty, Timeline } from 'antd';
import type { StageConfig } from '../../../common/types/tournament';

interface BracketPreviewProps {
  stageConfig: StageConfig;
  maxTeams: number;
}

const BracketPreview: React.FC<BracketPreviewProps> = ({ stageConfig, maxTeams }) => {
  const { type, numberOfGroups = 1, teamsPerGroup = 4 } = stageConfig;
  
  if (type !== 'BRACKET') {
    return <Empty description="Chỉ hỗ trợ xem trước cho thể thức đấu loại" />;
  }

  const totalTeams = Math.min(maxTeams, numberOfGroups * teamsPerGroup);
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(totalTeams)));
  const rounds = Math.log2(bracketSize);
  const byes = bracketSize - totalTeams;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
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
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{bracketSize}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Kích thước bracket</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{byes}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Đội được miễn đấu</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{bracketSize - 1}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Tổng trận đấu</div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Timeline mode="left">
        {Array.from({ length: rounds + 1 }).map((_, round) => (
          <Timeline.Item 
            key={round} 
            label={`Vòng ${round + 1}`}
            color={round === rounds ? 'green' : 'blue'}
          >
            <div style={{ marginBottom: 8 }}>
              <Tag color={round === rounds ? 'green' : 'blue'}>
                {round === rounds ? 'Chung kết' : `Vòng ${round + 1}`}
              </Tag>
              <span style={{ marginLeft: 8 }}>
                {Math.pow(2, rounds - round)} trận đấu
              </span>
            </div>
            {round === rounds ? (
              <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <strong>TRẬN CHUNG KẾT</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Đội thắng → Vô địch
                  </div>
                </div>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Array.from({ length: Math.pow(2, rounds - round) }).map((_, match) => (
                  <Card 
                    key={match} 
                    size="small" 
                    style={{ width: '180px', backgroundColor: '#f0f5ff' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div>Đội {match * 2 + 1}</div>
                      <div style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>vs</div>
                      <div>Đội {match * 2 + 2}</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

export default BracketPreview;
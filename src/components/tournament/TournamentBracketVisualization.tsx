import React from 'react';
import { Card, Typography, Tag, Button, Space, Tooltip } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { Bracket, Match } from '@/common/types';

const { Text } = Typography;

interface TournamentBracketVisualizationProps {
  bracket: Bracket;
  onMatchClick: (match: Match) => void;
  onScheduleMatch: (match: Match) => void;
}

const TournamentBracketVisualization: React.FC<TournamentBracketVisualizationProps> = ({
  bracket,
  onMatchClick,
  onScheduleMatch
}) => {
  if (!bracket.matches || bracket.matches.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Text type="secondary">Chưa có trận đấu nào</Text>
      </div>
    );
  }

  // Nhóm matches theo round
  const matchesByRound: Record<number, Match[]> = {};
  bracket.matches.forEach(match => {
    if (!matchesByRound[match.round]) {
      matchesByRound[match.round] = [];
    }
    matchesByRound[match.round].push(match);
  });

  const rounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  const getMatchColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '#52c41a';
      case 'PROCESSING': return '#faad14';
      case 'SCHEDULED': return '#1890ff';
      case 'PENDING': return '#d9d9d9';
      default: return '#d9d9d9';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      overflowX: 'auto',
      padding: '16px 0',
      minHeight: '400px'
    }}>
      {rounds.map(round => (
        <div 
          key={round} 
          style={{ 
            minWidth: '280px',
            marginRight: '32px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Tag color="blue" style={{ fontSize: '14px' }}>
              {round === Math.max(...rounds) && bracket.isFinal ? 'Chung kết' : `Vòng ${round}`}
            </Tag>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {matchesByRound[round]
              .sort((a, b) => a.order - b.order)
              .map(match => (
                <Tooltip key={match.id} title="Click để xem chi tiết">
                  <Card
                    size="small"
                    hoverable
                    onClick={() => onMatchClick(match)}
                    style={{
                      border: `2px solid ${getMatchColor(match.status)}`,
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                      <Text strong>Trận {match.order}</Text>
                    </div>
                    
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ 
                        padding: '8px', 
                        backgroundColor: '#fafafa',
                        borderRadius: '4px',
                        marginBottom: '4px'
                      }}>
                        <Space>
                          {match.team1?.logoUrl && (
                            <img 
                              src={match.team1.logoUrl} 
                              alt={match.team1.name}
                              style={{ width: '20px', height: '20px', borderRadius: '4px' }}
                            />
                          )}
                          <Text strong={!!match.team1}>
                            {match.team1?.name || 'Chờ đội...'}
                          </Text>
                          {match.team1Score !== undefined && (
                            <Tag color="green">{match.team1Score}</Tag>
                          )}
                        </Space>
                      </div>
                      
                      <div style={{ 
                        padding: '8px', 
                        backgroundColor: '#fafafa',
                        borderRadius: '4px'
                      }}>
                        <Space>
                          {match.team2?.logoUrl && (
                            <img 
                              src={match.team2.logoUrl} 
                              alt={match.team2.name}
                              style={{ width: '20px', height: '20px', borderRadius: '4px' }}
                            />
                          )}
                          <Text strong={!!match.team2}>
                            {match.team2?.name || 'Chờ đội...'}
                          </Text>
                          {match.team2Score !== undefined && (
                            <Tag color="green">{match.team2Score}</Tag>
                          )}
                        </Space>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Tag color={getMatchColor(match.status)}>
                        {match.status}
                      </Tag>
                      
                      {!match.scheduledTime && match.status === 'PENDING' && (
                        <Button 
                          size="small" 
                          icon={<ClockCircleOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onScheduleMatch(match);
                          }}
                        >
                          Lên lịch
                        </Button>
                      )}
                    </div>
                  </Card>
                </Tooltip>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentBracketVisualization;
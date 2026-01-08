// components/tournament/HeapBracketVisualization.tsx
import React, { useEffect, useRef } from 'react';
import { Card, Typography, Tag, Space, Button, Tooltip } from 'antd';
import { TeamOutlined, TrophyOutlined, ArrowRightOutlined, SwapOutlined } from '@ant-design/icons';
import type { Bracket, Match } from '@/common/types';

const { Text, Title } = Typography;

interface HeapBracketVisualizationProps {
  bracket: Bracket;
  matches: Match[];
  isLoserBracket?: boolean;
  onMatchClick?: (match: Match) => void;
  onScheduleMatch?: (match: Match) => void;
}

const HeapBracketVisualization: React.FC<HeapBracketVisualizationProps> = ({
  bracket,
  matches,
  isLoserBracket = false,
  onMatchClick,
  onScheduleMatch,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Phân nhóm matches theo heapDepth
  const matchesByDepth = matches.reduce((acc, match) => {
    const depth = match.heapDepth;
    if (!acc[depth]) acc[depth] = [];
    acc[depth].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  // Sắp xếp theo heapPosition trong mỗi depth
  Object.values(matchesByDepth).forEach(depthMatches => {
    depthMatches.sort((a, b) => a.heapPosition - b.heapPosition);
  });

  // Tìm chiều sâu tối đa
  const maxDepth = Math.max(...matches.map(m => m.heapDepth), 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ các đường nối
    matches.forEach(match => {
      if (!match.nextLoserMatch) return;

      const fromPos = calculateNodePosition(match, maxDepth);
      const toPos = calculateNodePosition(match.nextLoserMatch, maxDepth);

      if (fromPos && toPos) {
        // Vẽ đường nối
        ctx.beginPath();
        ctx.moveTo(fromPos.x + 100, fromPos.y + 40);
        ctx.bezierCurveTo(
          fromPos.x + 150,
          fromPos.y + 40,
          toPos.x - 50,
          toPos.y + 40,
          toPos.x,
          toPos.y + 40
        );
        ctx.strokeStyle = isLoserBracket ? '#ff4d4f' : '#1890ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Vẽ mũi tên
        ctx.beginPath();
        ctx.moveTo(toPos.x, toPos.y + 40);
        ctx.lineTo(toPos.x - 10, toPos.y + 35);
        ctx.lineTo(toPos.x - 10, toPos.y + 45);
        ctx.closePath();
        ctx.fillStyle = isLoserBracket ? '#ff4d4f' : '#1890ff';
        ctx.fill();
      }
    });
  }, [matches, maxDepth, isLoserBracket]);

  const calculateNodePosition = (match: Match, maxDepth: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const padding = 50;
    const nodeWidth = 200;
    const nodeHeight = 80;
    const verticalSpacing = 100;
    const horizontalSpacing = 250;

    // X: heapDepth càng nhỏ (càng gần root) càng ở bên phải
    const x = canvas.width - padding - (maxDepth - match.heapDepth) * horizontalSpacing - nodeWidth;
    
    // Y: heapPosition quyết định vị trí dọc
    const y = padding + (match.heapPosition - 1) * verticalSpacing;
    
    return { x, y };
  };

  const renderMatchNode = (match: Match) => {
    const isWinnerDecided = match.winnerSeed !== null;
    const isByeMatch = match.isBye;

    return (
      <div
        key={match.id}
        style={{
          width: '200px',
          padding: '12px',
          border: `2px solid ${
            isWinnerDecided ? '#52c41a' : 
            isByeMatch ? '#d9d9d9' : 
            isLoserBracket ? '#ff4d4f' : '#1890ff'
          }`,
          borderRadius: '8px',
          backgroundColor: isWinnerDecided ? '#f6ffed' : 'white',
          cursor: 'pointer',
          position: 'relative',
          opacity: match.isActive ? 1 : 0.6,
        }}
        onClick={() => onMatchClick?.(match)}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <Text strong style={{ fontSize: '12px' }}>
            M{match.matchIndex}
          </Text>
          <Space size="small">
            <Tag color={isLoserBracket ? 'red' : 'blue'} >
              {isLoserBracket ? 'LB' : 'WB'}
            </Tag>
            {match.isHeapified && (
              <Tag color="gold" >
                <SwapOutlined /> Heap
              </Tag>
            )}
          </Space>
        </div>

        {/* Team 1 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '4px',
          padding: '2px 4px',
          backgroundColor: match.team1 ? '#f0f9ff' : '#fafafa',
          borderRadius: '4px'
        }}>
          <Text style={{ fontSize: '12px' }}>
            {match.team1?.name || 'TBD'}
          </Text>
          <Space size={2}>
            {match.team1Seed && (
              <Text type="secondary" style={{ fontSize: '10px' }}>
                #{match.team1Seed}
              </Text>
            )}
            {match.team1Score !== undefined && (
              <Text strong style={{ fontSize: '12px' }}>
                {match.team1Score}
              </Text>
            )}
          </Space>
        </div>

        {/* Team 2 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '2px 4px',
          backgroundColor: match.team2 ? '#fff7e6' : '#fafafa',
          borderRadius: '4px'
        }}>
          <Text style={{ fontSize: '12px' }}>
            {match.team2?.name || 'TBD'}
          </Text>
          <Space size={2}>
            {match.team2Seed && (
              <Text type="secondary" style={{ fontSize: '10px' }}>
                #{match.team2Seed}
              </Text>
            )}
            {match.team2Score !== undefined && (
              <Text strong style={{ fontSize: '12px' }}>
                {match.team2Score}
              </Text>
            )}
          </Space>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '8px', 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '10px'
        }}>
          <Text type="secondary">R{match.round}.{match.order}</Text>
          <Text type="secondary">
            H[{match.heapDepth},{match.heapPosition}]
          </Text>
        </div>

        {/* Hiển thị heap value */}
        {match.isHeapified && (
          <Tooltip title={`Heap Value: ${match.heapValue}`}>
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#faad14',
              color: 'white',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              {match.heapValue}
            </div>
          </Tooltip>
        )}

        {/* Hiển thị nếu là bye match */}
        {match.isBye && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px'
          }}>
            BYE
          </div>
        )}
      </div>
    );
  };

  return (
    <Card 
      title={
        <Space>
          {isLoserBracket ? (
            <TeamOutlined style={{ color: '#ff4d4f' }} />
          ) : (
            <TrophyOutlined style={{ color: '#1890ff' }} />
          )}
          <span>{bracket.name}</span>
          <Tag color={isLoserBracket ? 'red' : 'blue'}>
            {isLoserBracket ? 'Loser Bracket' : 'Winner Bracket'}
          </Tag>
          {matches.some(m => m.isHeapified) && (
            <Tag color="gold">
              <SwapOutlined /> Heap Structure
            </Tag>
          )}
        </Space>
      }
      style={{ position: 'relative' }}
    >
      {/* Canvas cho đường nối */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
        width={maxDepth * 300 + 400}
        height={matches.length * 120 + 100}
      />

      {/* Hiển thị các matches theo heap depth */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        minHeight: '500px',
        padding: '20px'
      }}>
        {Object.entries(matchesByDepth)
          .sort(([depthA], [depthB]) => parseInt(depthB) - parseInt(depthA))
          .map(([depth, depthMatches]) => (
            <div 
              key={`depth-${depth}`}
              style={{
                marginBottom: '40px'
              }}
            >
              <div style={{ marginBottom: '8px' }}>
                <Text strong>
                  Heap Depth: {depth} 
                  <Text type="secondary" style={{ marginLeft: '8px' }}>
                    ({depthMatches.length} matches)
                  </Text>
                </Text>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                {depthMatches.map(match => renderMatchNode(match))}
              </div>
            </div>
          ))}
      </div>

      {/* Thông tin tổng quan */}
      <div style={{ 
        marginTop: '24px', 
        padding: '12px', 
        background: '#fafafa',
        borderRadius: '8px'
      }}>
        <Space wrap>
          <Text>
            <strong>Total Matches:</strong> {matches.length}
          </Text>
          <Text>
            <strong>Active Matches:</strong> {matches.filter(m => m.isActive).length}
          </Text>
          <Text>
            <strong>Heapified:</strong> {matches.filter(m => m.isHeapified).length}
          </Text>
          <Text>
            <strong>Bye Matches:</strong> {matches.filter(m => m.isBye).length}
          </Text>
          <Text>
            <strong>Completed:</strong> {matches.filter(m => m.status === 'COMPLETED').length}
          </Text>
        </Space>
      </div>
    </Card>
  );
};

export default HeapBracketVisualization;
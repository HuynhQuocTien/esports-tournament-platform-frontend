// components/tournament/CompactHeapTree.tsx
import React from 'react';
import { Typography, Space, Tag, Card } from 'antd';
import { SwapOutlined, TeamOutlined } from '@ant-design/icons';
import type { Match } from '@/common/types';

const { Text } = Typography;

interface CompactHeapTreeProps {
  matches: Match[];
  title?: string;
}

const CompactHeapTree: React.FC<CompactHeapTreeProps> = ({ matches, title }) => {
  // Xây dựng cây heap từ matches
  const buildHeapTree = () => {
    const root = matches.find(m => m.heapDepth === 0);
    if (!root) return null;

    const tree: any = { match: root, children: [] };
    
    // Đệ quy tìm children (depth tăng dần, position phù hợp)
    const buildTree = (parent: any, depth: number, position: number) => {
      // Tìm children ở depth + 1
      const children = matches.filter(m => 
        m.heapDepth === depth + 1 && 
        Math.floor((m.heapPosition - 1) / 2) === position - 1
      );

      parent.children = children.map(child => {
        const childTree = { match: child, children: [] };
        buildTree(childTree, depth + 1, child.heapPosition);
        return childTree;
      });
    };

    buildTree(tree, 0, 1);
    return tree;
  };

  const heapTree = buildHeapTree();

  const renderTreeNode = (node: any, level: number = 0) => {
    if (!node) return null;

    return (
      <div key={node.match.id} style={{ marginLeft: level * 40 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '4px 0',
          padding: '8px',
          background: level % 2 === 0 ? '#f6ffed' : '#fff7e6',
          borderRadius: '4px',
          border: '1px solid #d9d9d9'
        }}>
          <Space>
            <Tag color="blue">M{node.match.matchIndex}</Tag>
            <Text strong style={{ fontSize: '12px' }}>
              {node.match.team1?.name?.substring(0, 10) || 'TBD'} 
              vs 
              {node.match.team2?.name?.substring(0, 10) || 'TBD'}
            </Text>
            {node.match.winnerSeed && (
              <Tag color="green">W#{node.match.winnerSeed}</Tag>
            )}
            {node.match.isHeapified && (
              <Tag color="gold">
                <SwapOutlined /> {node.match.heapValue}
              </Tag>
            )}
          </Space>
        </div>
        
        {node.children.length > 0 && (
          <div style={{ marginLeft: 20 }}>
            {node.children.map((child: any) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card 
      title={
        <Space>
          <TeamOutlined />
          <span>{title || 'Heap Tree Structure'}</span>
          <Tag color="purple">Heap Depth: {Math.max(...matches.map(m => m.heapDepth || 0))}</Tag>
        </Space>
      }
      size="small"
    >
      {heapTree ? (
        renderTreeNode(heapTree)
      ) : (
        <Text type="secondary">No heap structure available</Text>
      )}
      
      {/* Thông tin thống kê */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
        <Space wrap>
          <Text type="secondary">Total Nodes: {matches.length}</Text>
          <Text type="secondary">Heapified: {matches.filter(m => m.isHeapified).length}</Text>
          <Text type="secondary">Max Depth: {Math.max(...matches.map(m => m.heapDepth || 0))}</Text>
          <Text type="secondary">Bye Matches: {matches.filter(m => m.isBye).length}</Text>
        </Space>
      </div>
    </Card>
  );
};

export default CompactHeapTree;
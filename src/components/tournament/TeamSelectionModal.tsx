// components/TeamSelectionModal.tsx
import React, { useState } from 'react';
import { Modal, List, Avatar, Input, Button, Space, Tag, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { Match, Team } from '@/common/types';

interface TeamSelectionModalProps {
  visible: boolean;
  match: Match | null;
  slot: 'team1' | 'team2';
  teams: Team[];
  onCancel: () => void;
  onOk: (matchId: string, slot: 'team1' | 'team2', teamId?: string) => Promise<void>;
}

const TeamSelectionModal: React.FC<TeamSelectionModalProps> = ({
  visible,
  match,
  slot,
  teams,
  onCancel,
  onOk,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (teamId: string) => {
    setSelectedTeamId(teamId === selectedTeamId ? undefined : teamId);
  };

  const handleOk = async () => {
    if (!match) return;
    
    setLoading(true);
    try {
      await onOk(match.id, slot, selectedTeamId);
      onCancel();
    } catch (error) {
      console.error('Error selecting team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!match) return;
    
    setLoading(true);
    try {
      await onOk(match.id, slot, undefined);
      onCancel();
    } catch (error) {
      console.error('Error clearing team:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Chọn đội cho vị trí ${slot === 'team1' ? 'Đội 1' : 'Đội 2'}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="clear" onClick={handleClear} loading={loading}>
          Xóa đội
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={handleOk}
          loading={loading}
          disabled={!selectedTeamId}
        >
          Xác nhận
        </Button>,
      ]}
      width={600}
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm đội..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      {filteredTeams.length === 0 ? (
        <Empty description="Không tìm thấy đội nào" />
      ) : (
        <List
          dataSource={filteredTeams}
          renderItem={(team) => (
            <List.Item
              style={{
                cursor: 'pointer',
                backgroundColor: selectedTeamId === team.id ? '#e6f7ff' : 'transparent',
                padding: '12px 16px',
                borderRadius: 8,
              }}
              onClick={() => handleSelect(team.id)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar src={team.logoUrl} size="large">
                    {team.name.charAt(0)}
                  </Avatar>
                }
                title={
                  <Space>
                    <Text strong>{team.name}</Text>
                    {team.seed && (
                      <Tag color="gold">Hạt giống #{team.seed}</Tag>
                    )}
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">
                      Thành viên: {team.members?.length || 0}
                    </Text>
                    <Text type="secondary" code>
                      ID: {team.id.substring(0, 8)}...
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default TeamSelectionModal;
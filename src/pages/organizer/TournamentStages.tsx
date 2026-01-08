import React, { useState, useEffect} from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  message, 
  Typography, 
  Space, 
  Alert,
  Spin,
  Tag,
  Modal,
  Progress,
  Empty,
  Tabs,
  List,
  Avatar,
  Badge,
  Select,
  InputNumber,
  DatePicker,
  Collapse,
  Form,
} from 'antd';
import { 
  ExclamationCircleOutlined, 
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  TeamOutlined,
  TrophyOutlined,
  ScheduleOutlined,
  DragOutlined,
  SyncOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { 
  DndContext, 
  type DragEndEvent, 
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TournamentBracketVisualization from '@/components/tournament/TournamentBracketVisualization';
import { tournamentService } from '@/services/tournamentService';
import { matchService } from '@/services/matchService';
import type { 
  TournamentStage, 
  Bracket, 
  Match, 
  Team, 
  TournamentStepProps
} from '@/common/types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

interface DraggableItem {
  id: string;
  type: 'team' | 'match';
  data: Team | Match;
}

const SortableItem: React.FC<{
  id: string;
  children: React.ReactNode;
  data?: any;
}> = ({ id, children, data }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} data-drag-data={JSON.stringify(data)}>
      {children}
    </div>
  );
};

const TournamentStages: React.FC<TournamentStepProps> = ({ data, updateData}) => {
  const [activeTab, setActiveTab] = useState('brackets');
  const [loading, setLoading] = useState(false);
  const [generatingBracket, setGeneratingBracket] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [isSeedModalVisible, setIsSeedModalVisible] = useState(false);
  const [draggingItem, setDraggingItem] = useState<DraggableItem | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingMatch, setEditingMatch] = useState<{
    matchId: string;
    team1Score?: number;
    team2Score?: number;
    scheduledTime?: Date;
  } | null>(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (data?.registrations) {
      // Lấy teams từ registrations (giả sử có field teams)
      const approvedTeams = data.registrations
        .filter((reg: any) => reg.status === "approved")
        .map((reg: any) => reg.team);
      setTeams(approvedTeams);
    }
    console.log('TournamentStages registrations data:', data.registrations);
  }, [data]);

  const handleGenerateBrackets = async () => {
    if (!data?.basicInfo.id) return;

    confirm({
      title: 'Tạo nhánh đấu tự động',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Hệ thống sẽ tạo nhánh đấu với thông tin:</p>
          <ul>
            <li>Số đội: <strong>{teams.length}</strong></li>
            <li>Thể thức: <strong>{data?.basicInfo.format}</strong></li>
            <li>Game: <strong>{data?.basicInfo.game}</strong></li>
          </ul>
          <Alert 
            type="warning" 
            message="Nhánh đấu cũ sẽ bị xóa nếu đã tồn tại!"
            style={{ marginTop: 16 }}
          />
        </div>
      ),
      onOk: async () => {
        setGeneratingBracket(true);
        try {
          // Gọi API tạo bracket
          await tournamentService.generateBrackets(data?.basicInfo.id, {
            format: data?.basicInfo.format,
            teams: teams
          });
          
          message.success('Đã tạo nhánh đấu thành công!');
          // await onRefresh();
        } catch (error) {
          message.error('Không thể tạo nhánh đấu');
          console.error('Generate bracket error:', error);
        } finally {
          setGeneratingBracket(false);
        }
      }
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const dragData = active.data.current as DraggableItem;
    setDraggingItem(dragData);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setDraggingItem(null);
      return;
    }

    const dragData = active.data.current as DraggableItem;
    const dropData = over.data.current as any;

    // Kéo team vào match slot
    if (dragData.type === 'team' && dropData?.type === 'match-slot') {
      await assignTeamToMatchSlot(
        dragData.data as Team,
        dropData.matchId,
        dropData.slot
      );
    }

    setDraggingItem(null);
  };

  const assignTeamToMatchSlot = async (team: Team, matchId: string, slot: 1 | 2) => {
    try {
      await matchService.assignTeam(matchId, {
        teamId: team.id,
        slot: slot
      });
      message.success(`Đã thêm ${team.name} vào trận đấu`);
      // await onRefresh();
    } catch (error) {
      message.error('Không thể thêm đội vào trận đấu');
    }
  };

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
    setIsMatchModalVisible(true);
  };

  const handleUpdateMatchResult = async () => {
    if (!selectedMatch || !editingMatch) return;

    try {
      await matchService.updateResult(selectedMatch.id, {
        team1Score: editingMatch.team1Score || 0,
        team2Score: editingMatch.team2Score || 0
      });
      message.success('Đã cập nhật kết quả trận đấu');
      setIsMatchModalVisible(false);
      setEditingMatch(null);
      // await onRefresh();
    } catch (error) {
      message.error('Không thể cập nhật kết quả');
    }
  };

  const handleScheduleMatch = async (match: Match) => {
    setSelectedMatch(match);
    setScheduleModalVisible(true);
  };

  const handleAutoSeed = async () => {
    try {
      const seeds = teams.map((team, index) => ({
        teamId: team.id,
        seed: index + 1
      }));
      
      await tournamentService.seedTeams(data?.basicInfo.id, seeds);
      message.success('Đã xếp hạt giống tự động');
      // await onRefresh();
    } catch (error) {
      message.error('Không thể xếp hạt giống');
    }
  };

  const renderTeamList = () => (
    <Card 
      title={
        <Space>
          <TeamOutlined />
          {/*<span>Danh sách đội ({teams.length}/{tournamentData.basicInfo.maxTeams})</span>*/}
        </Space>
      }
      extra={
        <Space>
          <Button 
            size="small" 
            icon={<SyncOutlined />} 
            onClick={handleAutoSeed}
            disabled={teams.length < 2}
          >
            Xếp hạt giống
          </Button>
          <Button 
            size="small" 
            type="primary" 
            icon={<DragOutlined />}
            onClick={() => setIsSeedModalVisible(true)}
            disabled={teams.length < 2}
          >
            Sắp xếp thủ công
          </Button>
        </Space>
      }
    >
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={teams.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <List
            dataSource={teams}
            renderItem={(team, index) => (
              <SortableItem 
                key={team.id} 
                id={team.id}
                data={{ type: 'team', data: team }}
              >
                <List.Item
                  style={{
                    padding: '12px',
                    border: '1px solid #f0f0f0',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'grab',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        src={team.logoUrl} 
                        icon={<UserOutlined />}
                        size="large"
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{team.name}</Text>
                        {team.seed && (
                          <Tag color="gold">
                            <TrophyOutlined /> #{team.seed}
                          </Tag>
                        )}
                      </Space>
                    }
                    description={
                      <Text type="secondary">
                        {team.members?.length || 0} thành viên
                      </Text>
                    }
                  />
                  <Badge 
                    status="success" 
                    text="Đã duyệt"
                  />
                </List.Item>
              </SortableItem>
            )}
          />
        </SortableContext>

        <DragOverlay>
          {draggingItem?.type === 'team' && (
            <div style={{
              padding: '12px',
              background: 'white',
              border: '2px dashed #1890ff',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              width: '300px'
            }}>
              <Space>
                <Avatar 
                  src={(draggingItem.data as Team).logoUrl} 
                  icon={<UserOutlined />}
                />
                <Text strong>{(draggingItem.data as Team).name}</Text>
                <Tag color="blue">Kéo vào trận đấu</Tag>
              </Space>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {teams.length === 0 && (
        <Empty
          description="Chưa có đội nào được duyệt"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );

  const renderBrackets = () => {
    if (!data.stages || data.stages.length === 0) {
      return (
        <Empty
          description={
            <div>
              <Title level={4}>Chưa có nhánh đấu nào</Title>
              <Text type="secondary">
                Tạo nhánh đấu để bắt đầu giải đấu. Cần ít nhất 2 đội đã được duyệt.
              </Text>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button 
            type="primary" 
            size="large"
            onClick={handleGenerateBrackets}
            disabled={teams.length < 2}
            loading={generatingBracket}
            icon={<PlusOutlined />}
          >
            Tạo nhánh đấu
          </Button>
        </Empty>
      );
    }

    return (
      <div>
        {data.stages.map((stage: TournamentStage) => (
          <Card 
            key={stage.id || stage.name}
            title={
              <Space>
                <span>{stage.name}</span>
                <Tag color="blue">{stage.type}</Tag>
                {stage.isSeeded && <Tag color="gold">Đã xếp hạt giống</Tag>}
              </Space>
            }
            style={{ marginBottom: 24 }}
            extra={
              <Space>
                <Button 
                  icon={<ScheduleOutlined />}
                  onClick={() => handleScheduleStage(stage)}
                >
                  Lên lịch
                </Button>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => handleEditStage(stage)}
                >
                  Chỉnh sửa
                </Button>
              </Space>
            }
          >
            {stage.brackets && stage.brackets.map((bracket: Bracket) => (
              <div key={bracket.id} style={{ marginBottom: 32 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 16 
                }}>
                  <Title level={4}>
                    {bracket.name}
                    {bracket.isFinal && (
                      <Tag color="red" style={{ marginLeft: 8 }}>
                        <TrophyOutlined /> Chung kết
                      </Tag>
                    )}
                  </Title>
                  <Space>
                    <Text type="secondary">{bracket.matches?.length || 0} trận đấu</Text>
                    <Button 
                      size="small"
                      onClick={() => handleScheduleBracket(bracket)}
                    >
                      <ClockCircleOutlined /> Lên lịch
                    </Button>
                  </Space>
                </div>
                
                {bracket.matches && bracket.matches.length > 0 ? (
                  <TournamentBracketVisualization
                    bracket={bracket}
                    onMatchClick={handleMatchClick}
                    onScheduleMatch={handleScheduleMatch}
                  />
                ) : (
                  <Empty description="Chưa có trận đấu nào" />
                )}
              </div>
            ))}
          </Card>
        ))}
      </div>
    );
  };

  const renderMatchSchedule = () => {
    const allMatches: Match[] = [];
    
    data.stages?.forEach((stage: TournamentStage) => {
      stage.brackets?.forEach((bracket: Bracket) => {
        if (bracket.matches) {
          allMatches.push(...bracket.matches);
        }
      });
    });

    const scheduledMatches = allMatches.filter(m => m.scheduledTime);
    const unscheduledMatches = allMatches.filter(m => !m.scheduledTime);

    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Alert
            message={`${scheduledMatches.length} trận đã lên lịch / ${unscheduledMatches.length} trận chưa lên lịch`}
            type="info"
            showIcon
          />
        </Col>

        <Col span={12}>
          <Card title="Trận đã lên lịch" size="small">
            <List
              dataSource={scheduledMatches.sort((a, b) => 
                new Date(a.scheduledTime!).getTime() - new Date(b.scheduledTime!).getTime()
              )}
              renderItem={match => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      icon={<EditOutlined />}
                      onClick={() => handleMatchClick(match)}
                    >
                      Chi tiết
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={`${match.bracket?.name || 'Bracket'} - Trận ${match.order}`}
                    description={
                      <Space direction="vertical" size="small">
                        <Text>
                          {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'}
                        </Text>
                        <Space>
                          <ClockCircleOutlined />
                          <Text type="secondary">
                            {new Date(match.scheduledTime!).toLocaleString()}
                          </Text>
                          <Tag color="blue">Vòng {match.round}</Tag>
                        </Space>
                      </Space>
                    }
                  />
                  <Tag color={
                    match.status === 'COMPLETED' ? 'success' :
                    match.status === 'PROCESSING' ? 'processing' :
                    match.status === 'SCHEDULED' ? 'blue' : 'default'
                  }>
                    {match.status}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Trận chưa lên lịch" size="small">
            <List
              dataSource={unscheduledMatches}
              renderItem={match => (
                <List.Item
                  actions={[
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => handleScheduleMatch(match)}
                    >
                      <CalendarOutlined /> Lên lịch
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={`${match.bracket?.name || 'Bracket'} - Trận ${match.order}`}
                    description={
                      <Text>
                        {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'}
                      </Text>
                    }
                  />
                  <Tag color={match.status === 'PENDING' ? 'orange' : 'default'}>
                    {match.status}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  const renderStats = () => {
    const allMatches: Match[] = [];
    
    data.stages?.forEach((stage: TournamentStage) => {
      stage.brackets?.forEach((bracket: Bracket) => {
        if (bracket.matches) {
          allMatches.push(...bracket.matches);
        }
      });
    });

    const stats = {
      totalTeams: teams.length,
      totalMatches: allMatches.length,
      completedMatches: allMatches.filter(m => m.status === 'COMPLETED').length,
      inProgressMatches: allMatches.filter(m => m.status === 'PROCESSING').length,
      pendingMatches: allMatches.filter(m => m.status === 'PENDING').length,
      scheduledMatches: allMatches.filter(m => m.scheduledTime).length,
    };

    const progressPercent = stats.totalMatches > 0 
      ? Math.round((stats.completedMatches / stats.totalMatches) * 100)
      : 0;

    return (
      <div>
        <Card title="Tiến độ giải đấu" style={{ marginBottom: 16 }}>
          <Progress 
            percent={progressPercent} 
            status={progressPercent === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text type="secondary">
              {stats.completedMatches}/{stats.totalMatches} trận đã hoàn thành
            </Text>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          {Object.entries(stats).map(([key, value]) => (
            <Col key={key} span={8}>
              <Card size="small">
                <StatisticCard 
                  title={getStatTitle(key)}
                  value={value}
                  color={getStatColor(key)}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  const handleScheduleStage = (stage: TournamentStage) => {
    Modal.confirm({
      title: `Lên lịch cho ${stage.name}`,
      content: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <RangePicker
            showTime
            style={{ width: '100%' }}
            placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
          />
          <Text type="secondary">Lịch sẽ được áp dụng cho tất cả trận trong stage này</Text>
        </Space>
      ),
      onOk: async (values) => {
        // Logic schedule stage
      }
    });
  };

  const handleScheduleBracket = (bracket: Bracket) => {
    // Logic schedule bracket
  };

  const handleEditStage = (stage: TournamentStage) => {
    // Logic edit stage
  };

  const getStatTitle = (key: string) => {
    const titles: Record<string, string> = {
      totalTeams: 'Số đội',
      totalMatches: 'Tổng số trận',
      completedMatches: 'Trận đã hoàn thành',
      inProgressMatches: 'Trận đang diễn ra',
      pendingMatches: 'Trận chờ',
      scheduledMatches: 'Trận đã lên lịch'
    };
    return titles[key] || key;
  };

  const getStatColor = (key: string) => {
    const colors: Record<string, string> = {
      totalTeams: '#1890ff',
      totalMatches: '#52c41a',
      completedMatches: '#87d068',
      inProgressMatches: '#faad14',
      pendingMatches: '#d9d9d9',
      scheduledMatches: '#722ed1'
    };
    return colors[key] || '#1890ff';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <Title level={2}>Quản lý Vòng đấu & Trận đấu</Title>
        <Space>
          <Button 
            icon={<SyncOutlined />}
            // onClick={onRefresh}
          >
            Tải lại
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleGenerateBrackets}
            loading={generatingBracket}
            disabled={teams.length < 2}
          >
            Tạo/Tạo lại nhánh đấu
          </Button>
        </Space>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        size="large"
      >
        <TabPane tab="Nhánh đấu" key="brackets">
          <Row gutter={[24, 24]}>
            <Col span={6}>
              {renderTeamList()}
            </Col>
            <Col span={18}>
              {renderBrackets()}
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Lịch thi đấu" key="schedule">
          {renderMatchSchedule()}
        </TabPane>

        <TabPane tab="Thống kê" key="stats">
          {renderStats()}
        </TabPane>
      </Tabs>

      {/* Match Detail Modal */}
      <Modal
        title="Chi tiết trận đấu"
        open={isMatchModalVisible}
        onCancel={() => {
          setIsMatchModalVisible(false);
          setSelectedMatch(null);
          setEditingMatch(null);
        }}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setIsMatchModalVisible(false)}>
            Đóng
          </Button>,
          selectedMatch?.status !== 'COMPLETED' && (
            <Button 
              key="update" 
              type="primary"
              onClick={handleUpdateMatchResult}
              disabled={!editingMatch}
            >
              Cập nhật kết quả
            </Button>
          )
        ]}
      >
        {selectedMatch && renderMatchDetail()}
      </Modal>

      {/* Schedule Match Modal */}
      <Modal
        title="Lên lịch trận đấu"
        open={scheduleModalVisible}
        onCancel={() => setScheduleModalVisible(false)}
        onOk={async () => {
          if (selectedMatch && editingMatch?.scheduledTime) {
            try {
              await matchService.schedule(selectedMatch.id, {
                scheduledTime: editingMatch.scheduledTime
              });
              message.success('Đã lên lịch trận đấu');
              setScheduleModalVisible(false);
              // await onRefresh();
            } catch (error) {
              message.error('Không thể lên lịch trận đấu');
            }
          }
        }}
      >
        {selectedMatch && (
          <Form layout="vertical">
            <Form.Item label="Thời gian">
              <DatePicker
                showTime
                style={{ width: '100%' }}
                value={editingMatch?.scheduledTime ? dayjs(editingMatch.scheduledTime) : null}
                onChange={(date) => {
                  setEditingMatch(prev => ({
                    ...prev!,
                    scheduledTime: date?.toDate()
                  }));
                }}
              />
            </Form.Item>
            <Alert
              message="Thông tin trận đấu"
              description={
                <Space direction="vertical">
                  <Text>{selectedMatch.team1?.name || 'TBD'} vs {selectedMatch.team2?.name || 'TBD'}</Text>
                  <Text>Vòng {selectedMatch.round} - Trận {selectedMatch.order}</Text>
                </Space>
              }
              type="info"
              showIcon
            />
          </Form>
        )}
      </Modal>

      {/* Seed Teams Modal */}
      <Modal
        title="Xếp hạt giống thủ công"
        open={isSeedModalVisible}
        onCancel={() => setIsSeedModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsSeedModalVisible(false)}>
            Hủy
          </Button>,
          <Button 
            key="save" 
            type="primary"
            onClick={async () => {
              // Logic save manual seeding
              setIsSeedModalVisible(false);
            }}
          >
            Lưu hạt giống
          </Button>
        ]}
      >
        <DndContext 
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={teams.map(t => t.id)}>
            <List
              dataSource={teams}
              renderItem={(team, index) => (
                <SortableItem 
                  key={team.id} 
                  id={team.id}
                  data={{ type: 'team', data: team }}
                >
                  <List.Item
                    style={{
                      padding: '12px',
                      border: '1px solid #f0f0f0',
                      marginBottom: '8px',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'grab',
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          src={team.logoUrl} 
                          icon={<UserOutlined />}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{team.name}</Text>
                          <Tag color="gold">Vị trí: {index + 1}</Tag>
                        </Space>
                      }
                    />
                    <DragOutlined style={{ color: '#999' }} />
                  </List.Item>
                </SortableItem>
              )}
            />
          </SortableContext>
        </DndContext>
        <Alert
          message="Kéo và thả để sắp xếp thứ tự hạt giống"
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Modal>
    </div>
  );

  function renderMatchDetail() {
    if (!selectedMatch) return null;

    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card size="small" title="Thông tin trận đấu">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Vòng:</Text>
                  <Text>Vòng {selectedMatch.round} - Trận {selectedMatch.order}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Trạng thái:</Text>
                  <Tag color={
                    selectedMatch.status === 'COMPLETED' ? 'success' :
                    selectedMatch.status === 'PROCESSING' ? 'processing' :
                    selectedMatch.status === 'SCHEDULED' ? 'blue' : 'default'
                  }>
                    {selectedMatch.status}
                  </Tag>
                </div>
                {selectedMatch.scheduledTime && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Thời gian:</Text>
                    <Text>{new Date(selectedMatch.scheduledTime).toLocaleString()}</Text>
                  </div>
                )}
              </Space>
            </Card>
          </Col>

          <Col span={24}>
            <Card size="small" title="Đội thi đấu">
              <Row gutter={[16, 16]}>
                <Col span={10}>
                  <TeamCard 
                    team={selectedMatch.team1}
                    slot={1}
                    matchId={selectedMatch.id}
                  />
                </Col>
                
                <Col span={4} style={{ textAlign: 'center', paddingTop: 40 }}>
                  <Title level={2}>VS</Title>
                  {selectedMatch.team1Score !== undefined && selectedMatch.team2Score !== undefined && (
                    <Title level={3} style={{ color: '#52c41a' }}>
                      {selectedMatch.team1Score} - {selectedMatch.team2Score}
                    </Title>
                  )}
                </Col>
                
                <Col span={10}>
                  <TeamCard 
                    team={selectedMatch.team2}
                    slot={2}
                    matchId={selectedMatch.id}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {selectedMatch.status !== 'COMPLETED' && (
            <Col span={24}>
              <Card size="small" title="Cập nhật kết quả">
                <Row gutter={16}>
                  <Col span={10}>
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      placeholder="Điểm đội 1"
                      value={editingMatch?.team1Score}
                      onChange={(value) => setEditingMatch(prev => ({
                        ...prev!,
                        team1Score: value || 0
                      }))}
                    />
                  </Col>
                  <Col span={4} style={{ textAlign: 'center', paddingTop: 8 }}>
                    <Text strong>:</Text>
                  </Col>
                  <Col span={10}>
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      placeholder="Điểm đội 2"
                      value={editingMatch?.team2Score}
                      onChange={(value) => setEditingMatch(prev => ({
                        ...prev!,
                        team2Score: value || 0
                      }))}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          )}

          {selectedMatch.status === 'COMPLETED' && selectedMatch.team1 && selectedMatch.team2 && (
            <Col span={24}>
              <Alert
                message={`Đội thắng: ${
                  (selectedMatch.team1Score || 0) > (selectedMatch.team2Score || 0) 
                    ? selectedMatch.team1.name 
                    : selectedMatch.team2.name
                }`}
                type="success"
                showIcon
              />
            </Col>
          )}
        </Row>
      </div>
    );
  }
};

const TeamCard: React.FC<{ 
  team?: Team; 
  slot: 1 | 2; 
  matchId: string 
}> = ({ team, slot, matchId }) => {
  return (
    <div
      style={{
        border: '2px dashed',
        borderColor: '#d9d9d9',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        backgroundColor: '#fafafa',
        minHeight: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      data-type="match-slot"
      data-match-id={matchId}
      data-slot={slot}
    >
      {team ? (
        <>
          <Avatar 
            src={team.logoUrl} 
            size={64} 
            icon={<TeamOutlined />}
          />
          <Title level={4} style={{ marginTop: 8, marginBottom: 0 }}>
            {team.name}
          </Title>
          {team.seed && (
            <Text type="secondary">Hạt giống #{team.seed}</Text>
          )}
        </>
      ) : (
        <>
          <Avatar 
            size={64} 
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#f0f0f0' }}
          />
          <Text type="secondary" style={{ marginTop: 8 }}>
            Kéo đội vào đây
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Slot {slot}
          </Text>
        </>
      )}
    </div>
  );
};

const StatisticCard: React.FC<{ 
  title: string; 
  value: number; 
  color: string 
}> = ({ title, value, color }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ 
      fontSize: '32px', 
      fontWeight: 'bold', 
      color,
      marginBottom: '8px'
    }}>
      {value}
    </div>
    <Text type="secondary">{title}</Text>
  </div>
);

export default TournamentStages;
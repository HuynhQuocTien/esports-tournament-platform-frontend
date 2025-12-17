import React, { useState, useEffect} from 'react';
import {
  Card,
  Tabs,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Alert,
  Spin,
  Modal,
  Table,
  Tag,
  Tooltip,
  Input,
  Select,
  Form,
  InputNumber,
  DatePicker,
  Dropdown,
  Menu,
  message,
  Divider,
  Empty,
  Badge,
  Avatar,
  List,
  Descriptions,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  TrophyOutlined,
  TeamOutlined,
  ScheduleOutlined,
  DragOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  MoreOutlined,
  CopyOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import DraggableRow from './DragRow';
import MatchScoreModal from './MatchScoreModal';
import TeamSelectionModal from './TeamSelectionModal';
import BracketVisualization from './Bracket';
import { tournamentService, matchService, teamService } from '@/services/api';
import { MatchStatus, TournamentStatus, type Match, type Team } from '@/common/types';
import type { Tournament } from '@/common/interfaces/tournament/tournament';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

interface TournamentManagementProps {
  tournamentId: string;
}

const TournamentManagementAntd: React.FC<TournamentManagementProps> = ({ tournamentId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState({
    status: 'all',
    round: 'all',
    search: '',
  });
  const [scoreModal, setScoreModal] = useState<{
    visible: boolean;
    match: Match | null;
  }>({ visible: false, match: null });
  const [teamSelectionModal, setTeamSelectionModal] = useState<{
    visible: boolean;
    match: Match | null;
    slot: 'team1' | 'team2';
  }>({ visible: false, match: null, slot: 'team1' });
  const [bracketData, setBracketData] = useState<any>(null);
  const [draggingRow, setDraggingRow] = useState<string | null>(null);
  const [autoSeedModal, setAutoSeedModal] = useState(false);
  const [matchStatusModal, setMatchStatusModal] = useState<{
    visible: boolean;
    match: Match | null;
    newStatus: MatchStatus | null;
  }>({ visible: false, match: null, newStatus: null });

  useEffect(() => {
    if (tournamentId) {
      loadTournamentData();
    }
  }, [tournamentId]);

  useEffect(() => {
    applyFilters();
  }, [matches, filter]);

  const loadTournamentData = async () => {
    try {
      setLoading(true);
      const [tournamentData, matchesData, teamsData, bracketData] = await Promise.all([
        tournamentService.getById(tournamentId),
        matchService.getByTournament(tournamentId),
        teamService.getByTournament(tournamentId),
        tournamentService.getBracketTree(tournamentId),
      ]);

      setTournament(tournamentData);
      setMatches(matchesData);
      setTeams(teamsData);
      setBracketData(bracketData);
    } catch (error) {
      message.error('Không thể tải dữ liệu giải đấu');
      console.error('Error loading tournament data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...matches];

    if (filter.status !== 'all') {
      filtered = filtered.filter(match => match.status === filter.status);
    }

    if (filter.round !== 'all') {
      filtered = filtered.filter(match => match.round === parseInt(filter.round));
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(match =>
        match.team1?.name.toLowerCase().includes(searchLower) ||
        match.team2?.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredMatches(filtered);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingRow(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggingRow(null);

    if (!over || active.id === over.id) return;

    const activeIndex = matches.findIndex(item => item.id === active.id);
    const overIndex = matches.findIndex(item => item.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newMatches = arrayMove(matches, activeIndex, overIndex);
      setMatches(newMatches);
      
      // Update match order in backend
      try {
        await matchService.updateMatchOrder(tournamentId, newMatches.map(m => m.id));
        message.success('Đã cập nhật thứ tự trận đấu');
      } catch (error) {
        message.error('Không thể cập nhật thứ tự');
        // Rollback on error
        setMatches([...matches]);
      }
    }
  };

  const handleScoreUpdate = async (matchId: string, team1Score: number, team2Score: number) => {
    try {
      await matchService.updateScore(matchId, { team1Score, team2Score });
      await loadTournamentData();
      message.success('Đã cập nhật tỷ số');
    } catch (error) {
      message.error('Không thể cập nhật tỷ số');
    }
  };

  const handleTeamSelect = async (matchId: string, slot: 'team1' | 'team2', teamId?: string) => {
    try {
      await matchService.updateTeam(matchId, slot, teamId);
      await loadTournamentData();
      message.success('Đã cập nhật đội');
    } catch (error) {
      message.error('Không thể cập nhật đội');
    }
  };

  const handleStatusChange = async (matchId: string, status: MatchStatus) => {
    try {
      await matchService.updateStatus(matchId, status);
      await loadTournamentData();
      message.success('Đã cập nhật trạng thái');
    } catch (error) {
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const handleAutoSeed = async () => {
    try {
      await tournamentService.autoSeed(tournamentId);
      await loadTournamentData();
      message.success('Đã tự động xếp hạt giống');
      setAutoSeedModal(false);
    } catch (error) {
      message.error('Không thể xếp hạt giống tự động');
    }
  };

  const getStatusTag = (status: TournamentStatus | MatchStatus) => {
    const statusConfig: Record<string, { color: string; text: string; icon?: React.ReactNode }> = {
      // Tournament Status
      [TournamentStatus.DRAFT]: { color: 'default', text: 'Nháp' },
      [TournamentStatus.PUBLISHED]: { color: 'processing', text: 'Đã xuất bản' },
      [TournamentStatus.REGISTRATION_OPEN]: { color: 'success', text: 'Mở đăng ký' },
      [TournamentStatus.REGISTRATION_CLOSED]: { color: 'warning', text: 'Đóng đăng ký' },
      [TournamentStatus.ONGOING]: { color: 'processing', text: 'Đang diễn ra', icon: <PlayCircleOutlined /> },
      [TournamentStatus.COMPLETED]: { color: 'success', text: 'Đã kết thúc', icon: <CheckCircleOutlined /> },
      [TournamentStatus.CANCELLED]: { color: 'error', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
      
      // Match Status
      [MatchStatus.PENDING]: { color: 'default', text: 'Chờ' },
      [MatchStatus.SCHEDULED]: { color: 'processing', text: 'Đã lên lịch' },
      [MatchStatus.PROCESSING]: { color: 'warning', text: 'Đang diễn ra', icon: <PlayCircleOutlined /> },
    //   [MatchStatus.COMPLETED]: { color: 'success', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
    //   [MatchStatus.CANCELLED]: { color: 'error', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
    };

    const config = statusConfig[status] || { color: 'default', text: status };
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const tournamentMenu = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Chỉnh sửa giải đấu
      </Menu.Item>
      <Menu.Item key="duplicate" icon={<CopyOutlined />}>
        Nhân bản giải đấu
      </Menu.Item>
      <Menu.Item key="export" icon={<DownloadOutlined />}>
        Xuất dữ liệu
      </Menu.Item>
      <Menu.Item key="share" icon={<ShareAltOutlined />}>
        Chia sẻ
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Xóa giải đấu
      </Menu.Item>
    </Menu>
  );

  const matchColumns = [
    {
      title: 'Vòng',
      dataIndex: 'round',
      key: 'round',
      width: 80,
      render: (round: number) => (
        <Badge count={round} style={{ backgroundColor: '#1890ff' }} />
      ),
    },
    {
      title: 'Trận đấu',
      dataIndex: 'order',
      key: 'order',
      width: 100,
      render: (order: number) => (
        <Text strong>Trận {order}</Text>
      ),
    },
    {
      title: 'Đội 1',
      key: 'team1',
      render: (record: Match) => (
        <Space>
          {record.team1 ? (
            <>
              <Avatar src={record.team1.logoUrl} size="small">
                {record.team1.name.charAt(0)}
              </Avatar>
              <Text>{record.team1.name}</Text>
              {record.team1.seed && (
                <Tag color="gold" style={{ marginLeft: 4 }}>
                  #{record.team1.seed}
                </Tag>
              )}
            </>
          ) : (
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setTeamSelectionModal({
                visible: true,
                match: record,
                slot: 'team1',
              })}
            >
              Thêm đội
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: 'VS',
      key: 'vs',
      width: 60,
      align: 'center' as const,
      render: () => (
        <Text type="secondary" strong>
          VS
        </Text>
      ),
    },
    {
      title: 'Đội 2',
      key: 'team2',
      render: (record: Match) => (
        <Space>
          {record.team2 ? (
            <>
              <Avatar src={record.team2.logoUrl} size="small">
                {record.team2.name.charAt(0)}
              </Avatar>
              <Text>{record.team2.name}</Text>
              {record.team2.seed && (
                <Tag color="gold" style={{ marginLeft: 4 }}>
                  #{record.team2.seed}
                </Tag>
              )}
            </>
          ) : (
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setTeamSelectionModal({
                visible: true,
                match: record,
                slot: 'team2',
              })}
            >
              Thêm đội
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: 'Tỷ số',
      key: 'score',
      width: 120,
      render: (record: Match) => (
        record.status === MatchStatus.COMPLETED ? (
          <Text strong>
            {record.team1Score || 0} - {record.team2Score || 0}
          </Text>
        ) : (
          <Button
            type="link"
            size="small"
            onClick={() => setScoreModal({ visible: true, match: record })}
          >
            Cập nhật tỷ số
          </Button>
        )
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: MatchStatus) => getStatusTag(status),
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 180,
      render: (record: Match) => (
        record.scheduledTime ? (
          <Text type="secondary">
            {new Date(record.scheduledTime).toLocaleString('vi-VN')}
          </Text>
        ) : (
          <Text type="secondary">Chưa lên lịch</Text>
        )
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (record: Match) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                // Open edit modal
              }}
            />
          </Tooltip>
          <Tooltip title="Thay đổi trạng thái">
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'scheduled',
                    label: 'Đã lên lịch',
                    icon: <ScheduleOutlined />,
                    onClick: () => handleStatusChange(record.id, MatchStatus.SCHEDULED),
                  },
                  {
                    key: 'ongoing',
                    label: 'Đang diễn ra',
                    icon: <PlayCircleOutlined />,
                    onClick: () => handleStatusChange(record.id, MatchStatus.PROCESSING),
                  },
                  {
                    key: 'completed',
                    label: 'Hoàn thành',
                    icon: <CheckCircleOutlined />,
                    onClick: () => handleStatusChange(record.id, MatchStatus.COMPLETED),
                  },
                  {
                    key: 'cancelled',
                    label: 'Hủy',
                    icon: <CloseCircleOutlined />,
                    danger: true,
                    onClick: () => handleStatusChange(record.id, MatchStatus.CANCELLED),
                  },
                ],
              }}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: 16 }}>Đang tải thông tin giải đấu...</Title>
      </div>
    );
  }

  if (!tournament) {
    return (
      <Alert
        message="Không tìm thấy giải đấu"
        description="Giải đấu không tồn tại hoặc bạn không có quyền truy cập."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size="small">
              <Space>
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>
                  Quay lại
                </Button>
                <Title level={3} style={{ margin: 0 }}>
                  {tournament.name}
                </Title>
                {/* {getStatusTag(tournament)} */}
              </Space>
              <Space>
                <Text type="secondary">
                  <TrophyOutlined /> {tournament.game}
                </Text>
                <Divider type="vertical" />
                <Text type="secondary">
                  <TeamOutlined /> {tournament.type}
                </Text>
                <Divider type="vertical" />
                <Text type="secondary">
                  <ScheduleOutlined /> {tournament.format}
                </Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<DragOutlined />}
                onClick={() => setAutoSeedModal(true)}
              >
                Tự động xếp hạt giống
              </Button>
              <Button icon={<DownloadOutlined />}>Xuất dữ liệu</Button>
              <Dropdown overlay={tournamentMenu}>
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
        >
          <TabPane
            tab={
              <span>
                <EyeOutlined />
                Tổng quan
              </span>
            }
            key="overview"
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Descriptions title="Thông tin giải đấu" bordered column={2}>
                  <Descriptions.Item label="Tên giải đấu">{tournament.name}</Descriptions.Item>
                  <Descriptions.Item label="Trò chơi">{tournament.game}</Descriptions.Item>
                  <Descriptions.Item label="Thể thức">{tournament.type}</Descriptions.Item>
                  <Descriptions.Item label="Định dạng">{tournament.format}</Descriptions.Item>
                  <Descriptions.Item label="Số đội tối đa">{tournament.maxTeams}</Descriptions.Item>
                  <Descriptions.Item label="Giải thưởng">
                    {tournament.prizePool?.toLocaleString('vi-VN')} VND
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian bắt đầu">
                    {new Date(tournament.tournamentStart!).toLocaleString('vi-VN')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian kết thúc">
                    {new Date(tournament.tournamentEnd!).toLocaleString('vi-VN')}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={24}>
                <Card title="Thống kê nhanh" size="small">
                  <Row gutter={16}>
                    <Col span={6}>
                      <Card size="small">
                        <Statistic
                          title="Tổng số đội"
                          value={teams.length}
                          prefix={<TeamOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card size="small">
                        <Statistic
                          title="Tổng số trận"
                          value={matches.length}
                          prefix={<TrophyOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card size="small">
                        <Statistic
                          title="Trận đã hoàn thành"
                          value={matches.filter(m => m.status === MatchStatus.COMPLETED).length}
                          prefix={<CheckCircleOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card size="small">
                        <Statistic
                          title="Trận đang diễn ra"
                          value={matches.filter(m => m.status === MatchStatus.PROCESSING).length}
                          prefix={<PlayCircleOutlined />}
                        />
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <TrophyOutlined />
                Nhánh đấu
              </span>
            }
            key="bracket"
          >
            {bracketData ? (
              <BracketVisualization data={bracketData} onMatchClick={(match) => {
                setScoreModal({ visible: true, match });
              }} />
            ) : (
              <Empty description="Chưa có dữ liệu nhánh đấu" />
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <TeamOutlined />
                Quản lý trận đấu
              </span>
            }
            key="matches"
          >
            {/* Filters */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col span={6}>
                  <Select
                    style={{ width: '100%' }}
                    value={filter.status}
                    onChange={(value) => setFilter({ ...filter, status: value })}
                    placeholder="Lọc theo trạng thái"
                  >
                    <Option value="all">Tất cả trạng thái</Option>
                    <Option value={MatchStatus.PENDING}>Chờ</Option>
                    <Option value={MatchStatus.SCHEDULED}>Đã lên lịch</Option>
                    <Option value={MatchStatus.PROCESSING}>Đang diễn ra</Option>
                    <Option value={MatchStatus.COMPLETED}>Hoàn thành</Option>
                    <Option value={MatchStatus.CANCELLED}>Đã hủy</Option>
                  </Select>
                </Col>
                <Col span={6}>
                  <Select
                    style={{ width: '100%' }}
                    value={filter.round}
                    onChange={(value) => setFilter({ ...filter, round: value })}
                    placeholder="Lọc theo vòng"
                  >
                    <Option value="all">Tất cả vòng</Option>
                    {Array.from(new Set(matches.map(m => m.round))).map(round => (
                      <Option key={round} value={round.toString()}>
                        Vòng {round}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={12}>
                  <Search
                    placeholder="Tìm kiếm theo tên đội..."
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    enterButton={<SearchOutlined />}
                    allowClear
                  />
                </Col>
              </Row>
            </Card>

            {/* Matches Table */}
            <DndContext
              modifiers={[restrictToVerticalAxis]}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredMatches.map(m => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <Table
                  dataSource={filteredMatches}
                  columns={matchColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  components={{
                    body: {
                      row: DraggableRow,
                    },
                  }}
                  onRow={(record) => ({
                    id: record.id,
                  })}
                />
              </SortableContext>
              <DragOverlay>
                {draggingRow ? (
                  <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                    <Table.Summary.Cell index={0} colSpan={matchColumns.length}>
                      <Text type="secondary">Đang kéo...</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                ) : null}
              </DragOverlay>
            </DndContext>
          </TabPane>

          <TabPane
            tab={
              <span>
                <TeamOutlined />
                Đội thi đấu
              </span>
            }
            key="teams"
          >
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={teams}
              renderItem={(team) => (
                <List.Item>
                  <Card
                    hoverable
                    cover={
                      team.logoUrl ? (
                        <img
                          alt={team.name}
                          src={team.logoUrl}
                          style={{ height: 120, objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            height: 120,
                            background: '#f0f2f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <TeamOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                        </div>
                      )
                    }
                    actions={[
                      <Tooltip key="view" title="Xem chi tiết">
                        <EyeOutlined />
                      </Tooltip>,
                      <Tooltip key="edit" title="Chỉnh sửa">
                        <EditOutlined />
                      </Tooltip>,
                      <Tooltip key="remove" title="Xóa khỏi giải">
                        <DeleteOutlined />
                      </Tooltip>,
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        <Avatar src={team.logoUrl}>
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
                          <Text type="secondary">
                            ID: {team.id.substring(0, 8)}...
                          </Text>
                        </Space>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Cài đặt
              </span>
            }
            key="settings"
          >
            <Card title="Cài đặt giải đấu">
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Tên giải đấu">
                      <Input value={tournament.name} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Trò chơi">
                      <Input value={tournament.game} readOnly />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="Số đội tối đa">
                      <InputNumber
                        style={{ width: '100%' }}
                        value={tournament.maxTeams}
                        min={2}
                        max={256}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Số thành viên tối thiểu">
                      <InputNumber
                        style={{ width: '100%' }}
                        value={tournament.minTeamSize}
                        min={1}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Số thành viên tối đa">
                      <InputNumber
                        style={{ width: '100%' }}
                        value={tournament.maxTeamSize}
                        min={1}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Thời gian bắt đầu">
                      <DatePicker
                        style={{ width: '100%' }}
                        showTime
                        value={tournament.tournamentStart}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Thời gian kết thúc">
                      <DatePicker
                        style={{ width: '100%' }}
                        showTime
                        value={tournament.tournamentEnd}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Space>
                    <Button type="primary" icon={<EditOutlined />}>
                      Chỉnh sửa cài đặt
                    </Button>
                    <Button danger icon={<DeleteOutlined />}>
                      Xóa giải đấu
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* Modals */}
      <MatchScoreModal
        visible={scoreModal.visible}
        match={scoreModal.match}
        onCancel={() => setScoreModal({ visible: false, match: null })}
        onOk={handleScoreUpdate}
      />

      <TeamSelectionModal
        visible={teamSelectionModal.visible}
        match={teamSelectionModal.match}
        slot={teamSelectionModal.slot}
        teams={teams}
        onCancel={() => setTeamSelectionModal({ visible: false, match: null, slot: 'team1' })}
        onOk={handleTeamSelect}
      />

      <Modal
        title="Tự động xếp hạt giống"
        open={autoSeedModal}
        onCancel={() => setAutoSeedModal(false)}
        onOk={handleAutoSeed}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Alert
          message="Lưu ý"
          description="Hành động này sẽ tự động xếp các đội đã đăng ký vào vị trí trong nhánh đấu dựa trên hạt giống. Các đội đã được xếp thủ công sẽ bị ghi đè."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Text>Bạn có chắc muốn tự động xếp hạt giống?</Text>
      </Modal>
    </div>
  );
};

export default TournamentManagementAntd;

const Statistic: React.FC<{
  title: string;
  value: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}> = ({ title, value, prefix, suffix }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
      {prefix && <span style={{ marginRight: 8 }}>{prefix}</span>}
      {value}
      {suffix && <span style={{ marginLeft: 4 }}>{suffix}</span>}
    </div>
    <Text type="secondary">{title}</Text>
  </div>
);
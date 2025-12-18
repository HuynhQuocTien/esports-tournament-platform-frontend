import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  message, 
  Row, 
  Col,
  Typography,
  Space,
  Steps,
  Spin,
  Modal,
  Select,
  Dropdown,
  Menu,
  Tooltip,
  Input,
  Form,
  Divider,
  Badge,
  Tag,
  Alert
} from 'antd';
import { 
  EyeOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  BranchesOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  MoreOutlined,
  UserOutlined,
  CrownOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ApiOutlined,
  TeamOutlined,
  FlagOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { tournamentService } from '@/services/tournamentService';
import { bracketService } from '@/services/bracketService';
import { matchService } from '@/services/matchService';
import { 
  type TournamentData, 
  type TournamentDataKey, 
  type TournamentStage,
  type Bracket,
  type Match,
  type Team,
  MatchStatus,
  type NextMatchSlot
} from '@/common/types/tournament';
import './TournamentBracket.css';

const { Title, Text } = Typography;
const { Step } = Steps;
const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

interface BracketViewData {
  stages: TournamentStage[];
  activeStage: TournamentStage | null;
  activeBracket: Bracket | null;
  matches: Match[];
  teams: Team[];
  loading: boolean;
  saving: boolean;
}

const BracketMatch: React.FC<{
  match: Match;
  teams: Team[];
  bracket: Bracket;
  onUpdateMatch: (matchId: string, updates: Partial<Match>) => void;
  onEditMatch: (match: Match) => void;
  onStartMatch: (matchId: string) => void;
  onCompleteMatch: (matchId: string) => void;
  onCancelMatch: (matchId: string) => void;
}> = ({ match, teams, bracket, onUpdateMatch, onEditMatch, onStartMatch, onCompleteMatch, onCancelMatch }) => {
  const team1 = match.team1 ? teams.find(t => t.id === match.team1.id) : null;
  const team2 = match.team2 ? teams.find(t => t.id === match.team2.id) : null;
  const winner = match.team1Score && match.team2Score 
    ? (match.team1Score > match.team2Score ? team1 : match.team2Score > match.team1Score ? team2 : null)
    : null;

  const getTeamDisplay = (team?: Team) => {
    if (!team) return { 
      name: 'TBD', 
      color: '#d9d9d9',
      status: 'empty'
    };
    
    const isWinner = winner?.id === team.id;
    return {
      name: team.name || `Đội ${team.id.slice(0, 4)}`,
      color: isWinner ? '#52c41a' : '#1890ff',
      status: isWinner ? 'winner' : 'participant'
    };
  };

  const team1Display = getTeamDisplay(team1);
  const team2Display = getTeamDisplay(team2);

  const getStatusBadge = (status: MatchStatus) => {
    const statusConfig = {
      [MatchStatus.PENDING]: { color: 'default', text: 'Chờ bắt đầu' },
      [MatchStatus.SCHEDULED]: { color: 'blue', text: 'Đã lên lịch' },
      [MatchStatus.PROCESSING]: { color: 'orange', text: 'Đang diễn ra' },
      [MatchStatus.COMPLETED]: { color: 'green', text: 'Đã hoàn thành' },
      [MatchStatus.CANCELLED]: { color: 'red', text: 'Đã hủy' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return <Badge status={config.color as any} text={config.text} />;
  };

  const matchMenu = (
    <Menu>
      <Menu.Item 
        icon={<EditOutlined />}
        onClick={() => onEditMatch(match)}
      >
        Chỉnh sửa trận đấu
      </Menu.Item>
      {match.status === MatchStatus.PENDING && (
        <Menu.Item 
          icon={<PlayCircleOutlined />}
          onClick={() => onStartMatch(match.id)}
        >
          Bắt đầu trận đấu
        </Menu.Item>
      )}
      {match.status === MatchStatus.PROCESSING&& (
        <Menu.Item 
          icon={<CheckCircleOutlined />}
          onClick={() => onCompleteMatch(match.id)}
        >
          Hoàn thành trận đấu
        </Menu.Item>
      )}
      <Menu.Item 
        icon={<SwapOutlined />}
        disabled={!team1 || !team2}
        onClick={() => {
          const updates = {
            team1: team2,
            team2: team1,
            team1Score: match.team2Score,
            team2Score: match.team1Score
          };
          onUpdateMatch(match.id, updates);
        }}
      >
        Hoán đổi đội
      </Menu.Item>
      {match.status !== MatchStatus.COMPLETED && (
        <Menu.Item 
          icon={<DeleteOutlined />}
          danger
          onClick={() => onCancelMatch(match.id)}
        >
          Hủy trận đấu
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="bracket-match">
      <div className="match-header">
        <Space>
          <span className="match-id">
            <FlagOutlined /> Trận {match.round}.{match.order}
          </span>
          {match.bestOf && (
            <Tag color="purple">Bo{match.bestOf}</Tag>
          )}
        </Space>
        <Dropdown overlay={matchMenu}>
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      </div>
      
      <div className="match-content">
        <div 
          className={`team team1 ${winner?.id === team1?.id ? 'winner' : ''}`}
          style={{ borderLeftColor: team1Display.color }}
        >
          <div className="team-info">
            {team1 ? (
              <>
                <UserOutlined className="team-icon" />
                <span className="team-name">{team1Display.name}</span>
                {team1.tag && <Tag size="small">{team1.tag}</Tag>}
              </>
            ) : (
              <span className="team-name empty">Chưa có đội</span>
            )}
          </div>
          <div className="team-score">
            {team1 && match.team1Score !== null && match.team1Score !== undefined ? match.team1Score : '-'}
          </div>
        </div>
        
        <div className="match-vs">VS</div>
        
        <div 
          className={`team team2 ${winner?.id === team2?.id ? 'winner' : ''}`}
          style={{ borderLeftColor: team2Display.color }}
        >
          <div className="team-info">
            {team2 ? (
              <>
                <UserOutlined className="team-icon" />
                <span className="team-name">{team2Display.name}</span>
                {team2.tag && <Tag size="small">{team2.tag}</Tag>}
              </>
            ) : (
              <span className="team-name empty">Chưa có đội</span>
            )}
          </div>
          <div className="team-score">
            {team2 && match.team2Score !== null && match.team2Score !== undefined ? match.team2Score : '-'}
          </div>
        </div>
      </div>
      
      <div className="match-footer">
        <div className="match-status">
          {getStatusBadge(match.status)}
        </div>
        <div className="match-meta">
          {match.scheduledTime && (
            <Tooltip title={new Date(match.scheduledTime).toLocaleString('vi-VN')}>
              <span className="match-time">
                <CalendarOutlined /> {new Date(match.scheduledTime).toLocaleDateString('vi-VN')}
              </span>
            </Tooltip>
          )}
          {match.streamUrl && (
            <a href={match.streamUrl} target="_blank" rel="noopener noreferrer" className="stream-link">
              <EyeOutlined /> Stream
            </a>
          )}
        </div>
      </div>
      
      {match.games && match.games.length > 0 && (
        <div className="match-games">
          <Divider style={{ margin: '8px 0' }} />
          <div className="games-list">
            {match.games.map(game => (
              <div key={game.id} className="game-item">
                <span>Game {game.gameNumber}: {game.mapName || 'Map không xác định'}</span>
                <span className="game-result">
                  {game.result ? `${game.result.team1Score || 0}-${game.result.team2Score || 0}` : 'Chưa có kết quả'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TournamentBracket: React.FC<{
  data: TournamentData;
  updateData: (key: TournamentDataKey, data: any) => void;
}> = ({ data, updateData }) => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const [bracketData, setBracketData] = useState<BracketViewData>({
    stages: [],
    activeStage: null,
    activeBracket: null,
    matches: [],
    teams: data.registrations || [],
    loading: false,
    saving: false
  });
  
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedBracket, setSelectedBracket] = useState<string>('');
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (tournamentId) {
      loadBracketData();
    }
  }, [tournamentId]);

  const loadBracketData = async () => {
    setBracketData(prev => ({ ...prev, loading: true }));
    try {
      const stagesResponse = await tournamentService.getTournamentStages(tournamentId!);
      
      if (stagesResponse.success && stagesResponse.data) {
        const stages = stagesResponse.data;
        const activeStage = stages[0] || null;
        
        let activeBracket = null;
        let matches = [];
        
        if (activeStage) {
          const bracketsResponse = await bracketService.getStageBrackets(activeStage.id);
          if (bracketsResponse.success && bracketsResponse.data) {
            const brackets = bracketsResponse.data;
            activeBracket = brackets[0] || null;
            
            if (activeBracket) {
              const matchesResponse = await matchService.getBracketMatches(activeBracket.id);
              if (matchesResponse.success && matchesResponse.data) {
                matches = matchesResponse.data;
              }
            }
          }
        }
        
        const teams = data.registrations || [];
        
        setBracketData({
          stages,
          activeStage,
          activeBracket,
          matches,
          teams,
          loading: false,
          saving: false
        });
        
        if (activeStage) setSelectedStage(activeStage.id);
        if (activeBracket) setSelectedBracket(activeBracket.id);
      }
    } catch (error) {
      console.error('Error loading bracket data:', error);
      message.error('Không thể tải dữ liệu nhánh đấu');
      setBracketData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleStageChange = async (stageId: string) => {
    setBracketData(prev => ({ ...prev, loading: true }));
    setSelectedStage(stageId);
    
    try {
      const stage = bracketData.stages.find(s => s.id === stageId);
      if (!stage) return;
      
      const bracketsResponse = await bracketService.getStageBrackets(stageId);
      if (bracketsResponse.success && bracketsResponse.data) {
        const brackets = bracketsResponse.data;
        const activeBracket = brackets[0] || null;
        
        let matches = [];
        if (activeBracket) {
          const matchesResponse = await matchService.getBracketMatches(activeBracket.id);
          if (matchesResponse.success && matchesResponse.data) {
            matches = matchesResponse.data;
          }
          setSelectedBracket(activeBracket.id);
        }
        
        setBracketData(prev => ({
          ...prev,
          activeStage: stage,
          activeBracket,
          matches,
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error changing stage:', error);
      message.error('Không thể chuyển giai đoạn');
      setBracketData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleBracketChange = async (bracketId: string) => {
    setBracketData(prev => ({ ...prev, loading: true }));
    setSelectedBracket(bracketId);
    
    try {
      const matchesResponse = await matchService.getBracketMatches(bracketId);
      if (matchesResponse.success && matchesResponse.data) {
        const bracket = bracketData.activeStage?.brackets?.find(b => b.id === bracketId);
        
        setBracketData(prev => ({
          ...prev,
          activeBracket: bracket || null,
          matches: matchesResponse.data,
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error changing bracket:', error);
      message.error('Không thể chuyển nhánh đấu');
      setBracketData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdateMatch = async (matchId: string, updates: Partial<Match>) => {
    setBracketData(prev => ({ ...prev, saving: true }));
    try {
      const response = await matchService.updateMatch(matchId, updates);
      if (response.success) {
        const updatedMatches = bracketData.matches.map(match => 
          match.id === matchId ? { ...match, ...updates } : match
        );
        
        setBracketData(prev => ({
          ...prev,
          matches: updatedMatches,
          saving: false
        }));
        
        message.success('Đã cập nhật trận đấu');
      }
    } catch (error) {
      console.error('Error updating match:', error);
      message.error('Không thể cập nhật trận đấu');
      setBracketData(prev => ({ ...prev, saving: false }));
    }
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    form.setFieldsValue({
      scheduledTime: match.scheduledTime ? new Date(match.scheduledTime).toISOString().slice(0, 16) : undefined,
      bestOf: match.bestOf,
      streamUrl: match.streamUrl,
      notes: match.notes
    });
    setMatchModalVisible(true);
  };

  const handleSaveMatch = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingMatch) {
        await handleUpdateMatch(editingMatch.id, {
          scheduledTime: values.scheduledTime ? new Date(values.scheduledTime) : null,
          bestOf: values.bestOf,
          streamUrl: values.streamUrl,
          notes: values.notes
        });
        setMatchModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const handleStartMatch = async (matchId: string) => {
    confirm({
      title: 'Bắt đầu trận đấu',
      content: 'Xác nhận bắt đầu trận đấu?',
      onOk: async () => {
        await handleUpdateMatch(matchId, {
          status: MatchStatus.IN_PROGRESS,
          actualStartTime: new Date()
        });
      }
    });
  };

  const handleCompleteMatch = async (matchId: string) => {
    const match = bracketData.matches.find(m => m.id === matchId);
    if (!match) return;
    
    Modal.confirm({
      title: 'Nhập kết quả trận đấu',
      content: (
        <div style={{ padding: '20px 0' }}>
          <Row gutter={16}>
            <Col span={12}>
              <label>{match.team1?.name || 'Đội 1'}</label>
              <Input 
                type="number" 
                min={0}
                placeholder="Điểm đội 1"
                defaultValue={match.team1Score || 0}
                onChange={(e) => {
                  match.team1Score = parseInt(e.target.value) || 0;
                }}
              />
            </Col>
            <Col span={12}>
              <label>{match.team2?.name || 'Đội 2'}</label>
              <Input 
                type="number" 
                min={0}
                placeholder="Điểm đội 2"
                defaultValue={match.team2Score || 0}
                onChange={(e) => {
                  match.team2Score = parseInt(e.target.value) || 0;
                }}
              />
            </Col>
          </Row>
        </div>
      ),
      onOk: async () => {
        await handleUpdateMatch(matchId, {
          status: MatchStatus.COMPLETED,
          actualEndTime: new Date(),
          team1Score: match.team1Score,
          team2Score: match.team2Score
        });
        
        if (match.nextMatch && match.team1Score !== undefined && match.team2Score !== undefined) {
          const winner = match.team1Score > match.team2Score ? match.team1 : match.team2Score > match.team1Score ? match.team2 : null;
          
          if (winner && match.nextMatchSlot) {
            const nextMatchUpdates: any = {};
            if (match.nextMatchSlot === NextMatchSlot.SLOT_1) {
              nextMatchUpdates.team1 = winner;
            } else {
              nextMatchUpdates.team2 = winner;
            }
            
            await handleUpdateMatch(match.nextMatch.id, nextMatchUpdates);
          }
        }
      }
    });
  };

  const handleCancelMatch = async (matchId: string) => {
    confirm({
      title: 'Hủy trận đấu',
      content: 'Bạn có chắc chắn muốn hủy trận đấu này?',
      okText: 'Hủy trận',
      okType: 'danger',
      onOk: async () => {
        await handleUpdateMatch(matchId, {
          status: 
          MatchStatus.CANCELLED
        });
      }
    });
  };

  const generateBracketMatches = async () => {
    if (!bracketData.activeStage || !bracketData.activeBracket) {
      message.error('Vui lòng chọn giai đoạn và nhánh đấu');
      return;
    }
    
    confirm({
      title: 'Tạo tự động trận đấu',
      content: 'Hệ thống sẽ tự động tạo các trận đấu dựa trên cấu trúc bracket. Tiếp tục?',
      onOk: async () => {
        setBracketData(prev => ({ ...prev, saving: true }));
        try {
          const response = await bracketService.generateBracketMatches(
            bracketData.activeBracket!.id,
            bracketData.teams.map(t => t.id)
          );
          
          if (response.success) {
            message.success('Đã tạo tự động các trận đấu');
            loadBracketData();
          }
        } catch (error) {
          console.error('Error generating bracket:', error);
          message.error('Không thể tạo bracket tự động');
        } finally {
          setBracketData(prev => ({ ...prev, saving: false }));
        }
      }
    });
  };

  const getRounds = () => {
    if (!bracketData.matches.length) return [];
    
    const rounds = new Set(bracketData.matches.map(match => match.round));
    return Array.from(rounds).sort((a, b) => a - b);
  };

  const getMatchesByRound = (round: number) => {
    return bracketData.matches
      .filter(match => match.round === round)
      .sort((a, b) => a.order - b.order);
  };

  const renderBracketVisualization = () => {
    const rounds = getRounds();
    if (rounds.length === 0) {
      return (
        <div className="empty-bracket">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có trận đấu nào"
          >
            <Button 
              type="primary" 
              icon={<ApiOutlined />}
              onClick={generateBracketMatches}
              loading={bracketData.saving}
            >
              Tạo tự động trận đấu
            </Button>
          </Empty>
        </div>
      );
    }

    return (
      <div className="bracket-visualization">
        {rounds.map(round => (
          <div key={round} className="bracket-round">
            <div className="round-header">
              <Title level={4} className="round-title">
                <CrownOutlined /> Vòng {round}
                <Tag style={{ marginLeft: 8 }}>
                  {getMatchesByRound(round).length} trận
                </Tag>
              </Title>
            </div>
            <div className="matches-container">
              {getMatchesByRound(round).map(match => (
                <div key={match.id} className="match-wrapper">
                  <BracketMatch
                    match={match}
                    teams={bracketData.teams}
                    bracket={bracketData.activeBracket!}
                    onUpdateMatch={handleUpdateMatch}
                    onEditMatch={handleEditMatch}
                    onStartMatch={handleStartMatch}
                    onCompleteMatch={handleCompleteMatch}
                    onCancelMatch={handleCancelMatch}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="tournament-bracket">
      {/* Header với controls */}
      <div className="bracket-header">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                <BranchesOutlined /> Quản lý Nhánh đấu
              </Title>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadBracketData}
                  loading={bracketData.loading}
                >
                  Tải lại
                </Button>
                <Button
                  type="primary"
                  icon={<ApiOutlined />}
                  onClick={generateBracketMatches}
                  loading={bracketData.saving}
                  disabled={!bracketData.activeBracket || bracketData.teams.length === 0}
                >
                  Tạo tự động
                </Button>
              </Space>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div className="control-group">
                <label>Giai đoạn:</label>
                <Select
                  value={selectedStage}
                  onChange={handleStageChange}
                  style={{ width: '100%' }}
                  loading={bracketData.loading}
                  placeholder="Chọn giai đoạn"
                >
                  {bracketData.stages.map(stage => (
                    <Option key={stage.id} value={stage.id}>
                      {stage.name} ({stage.type})
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={12}>
              <div className="control-group">
                <label>Nhánh đấu:</label>
                <Select
                  value={selectedBracket}
                  onChange={handleBracketChange}
                  style={{ width: '100%' }}
                  loading={bracketData.loading}
                  placeholder="Chọn nhánh đấu"
                  disabled={!bracketData.activeStage}
                >
                  {bracketData.activeStage?.brackets?.map(bracket => (
                    <Option key={bracket.id} value={bracket.id}>
                      {bracket.name} {bracket.isFinal && <Tag color="gold">Chung kết</Tag>}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
        </Space>
      </div>

      {/* Thông tin tổng quan */}
      <div className="bracket-overview">
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Tổng trận đấu"
                value={bracketData.matches.length}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Trận đã hoàn thành"
                value={bracketData.matches.filter(m => m.status === MatchStatus.COMPLETED).length}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Trận đang diễn ra"
                value={bracketData.matches.filter(m => m.status === MatchStatus.PROCESSING).length}
                prefix={<PlayCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Số đội tham gia"
                value={bracketData.teams.length}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Hiển thị bracket */}
      <div className="bracket-container">
        {bracketData.loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <Text type="secondary">Đang tải dữ liệu bracket...</Text>
          </div>
        ) : bracketData.activeBracket ? (
          <>
            <Alert
              message={`${bracketData.activeStage?.name} - ${bracketData.activeBracket.name}`}
              description={`Thể thức: ${bracketData.activeStage?.type} | Số trận: ${bracketData.matches.length}`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            {renderBracketVisualization()}
          </>
        ) : (
          <Alert
            message="Chưa có bracket nào"
            description="Vui lòng tạo bracket trong tab 'Vòng đấu' trước"
            type="warning"
            showIcon
          />
        )}
      </div>

      {/* Modal chỉnh sửa trận đấu */}
      <Modal
        title="Chỉnh sửa trận đấu"
        open={matchModalVisible}
        onOk={handleSaveMatch}
        onCancel={() => {
          setMatchModalVisible(false);
          form.resetFields();
        }}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={bracketData.saving}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="scheduledTime"
            label="Thời gian dự kiến"
          >
            <Input type="datetime-local" />
          </Form.Item>
          
          <Form.Item
            name="bestOf"
            label="Best of"
          >
            <Select placeholder="Chọn số game tối đa">
              <Option value={1}>Bo1</Option>
              <Option value={3}>Bo3</Option>
              <Option value={5}>Bo5</Option>
              <Option value={7}>Bo7</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="streamUrl"
            label="Link stream"
          >
            <Input placeholder="https://twitch.tv/..." />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea rows={3} placeholder="Ghi chú về trận đấu..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Cần thêm các service functions vào tournamentService:
/*
// tournamentService.ts
class TournamentService {
  // Lấy các stages của tournament
  async getTournamentStages(tournamentId: string): Promise<ApiResponse<TournamentStage[]>> {
    const response = await api.get(`/tournaments/${tournamentId}/stages`);
    return response.data;
  }
}

// bracketService.ts
class BracketService {
  // Lấy các brackets của stage
  async getStageBrackets(stageId: string): Promise<ApiResponse<Bracket[]>> {
    const response = await api.get(`/stages/${stageId}/brackets`);
    return response.data;
  }

  // Tạo tự động các match trong bracket
  async generateBracketMatches(bracketId: string, teamIds: string[]): Promise<ApiResponse<any>> {
    const response = await api.post(`/brackets/${bracketId}/generate-matches`, { teamIds });
    return response.data;
  }
}

// matchService.ts
class MatchService {
  // Lấy các matches của bracket
  async getBracketMatches(bracketId: string): Promise<ApiResponse<Match[]>> {
    const response = await api.get(`/brackets/${bracketId}/matches`);
    return response.data;
  }

  // Cập nhật match
  async updateMatch(matchId: string, updates: Partial<Match>): Promise<ApiResponse<Match>> {
    const response = await api.patch(`/matches/${matchId}`, updates);
    return response.data;
  }
}
*/

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
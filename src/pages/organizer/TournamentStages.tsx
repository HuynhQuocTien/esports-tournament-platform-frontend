import React, { useState, useEffect } from 'react';
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
  Statistic,
  Descriptions,
  Steps,
  Divider,
  Table,
  InputNumber,
} from 'antd';
import { 
  ExclamationCircleOutlined, 
  TeamOutlined,
  TrophyOutlined,
  ScheduleOutlined,
  SyncOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  PlayCircleOutlined,
  RocketOutlined,
  LoadingOutlined,
  UserOutlined,
  CrownOutlined,
  ArrowRightOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import TournamentBracketVisualization from '@/components/tournament/TournamentBracketVisualization';
import { tournamentService } from '@/services/tournamentService';
import { matchService } from '@/services/matchService';
import type { 
  TournamentStage, 
  Bracket, 
  Match, 
  Team, 
  TournamentStepProps,
  Tournament,
  TournamentData,
  TournamentBasicInfo,
} from '@/common/types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;
const { Step } = Steps;

const TournamentStages: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState('brackets');
  const [loading, setLoading] = useState(false);
  const [generatingBracket, setGeneratingBracket] = useState(false);
  const [seedingTeams, setSeedingTeams] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [processingMatch, setProcessingMatch] = useState(false);
  const [tournamentInfo, setTournamentInfo] = useState<TournamentBasicInfo | null>(null);
  const [matchStats, setMatchStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    scheduled: 0,
    pending: 0,
  });

  useEffect(() => {
    if (data?.registrations) {
      const approvedTeams = data.registrations
        .filter((reg: any) => reg.status === "APPROVED" || reg.status === "approved")
        .map((reg: any) => ({
          ...reg.team,
          registrationId: reg.id,
          registeredAt: reg.registeredAt,
        }));
      setTeams(approvedTeams);
    }
    
    if (data?.basicInfo) {
      setTournamentInfo(data.basicInfo);
    }

    // Tính toán match stats
    calculateMatchStats();
    
    console.log('TournamentStages data:', data);
  }, [data]);

  const calculateMatchStats = () => {
    if (!data?.stages) return;

    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let scheduled = 0;
    let pending = 0;

    data.stages.forEach((stage: TournamentStage) => {
      stage.brackets?.forEach((bracket: Bracket) => {
        bracket.matches?.forEach((match: Match) => {
          total++;
          switch (match.status) {
            case 'COMPLETED':
              completed++;
              break;
            case 'LIVE':
              inProgress++;
              break;
            case 'SCHEDULED':
              scheduled++;
              break;
            case 'PENDING':
              pending++;
              break;
          }
        });
      });
    });

    setMatchStats({ total, completed, inProgress, scheduled, pending });
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      if (data?.basicInfo?.id) {
        const updatedTournament = await tournamentService.getById(data.basicInfo.id);
        updateData('basicInfo', updatedTournament.data);
        message.success('Đã tải lại dữ liệu');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      message.error('Không thể tải lại dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // 🎯 QUAN TRỌNG: 1 NÚT TỰ ĐỘNG LOAD ĐĂNG KÝ VÀO TRẬN ĐẤU
  const handleAutoSeedAndAssign = async () => {
    if (!data?.basicInfo?.id) return;

    confirm({
      title: 'Tự động xếp hạt giống và assign teams',
      icon: <SyncOutlined />,
      content: (
        <div>
          <Alert
            message="Hệ thống sẽ tự động:"
            description={
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>Xếp hạt giống cho {teams.length} đội đã duyệt</li>
                <li>Assign teams vào các trận đấu vòng 1</li>
                <li>Tự động xử lý bye matches (nếu có)</li>
                <li>Lên lịch các trận đấu vòng 1</li>
              </ul>
            }
            type="info"
            style={{ marginBottom: 16 }}
          />
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="Số đội">{teams.length}</Descriptions.Item>
            <Descriptions.Item label="Format">{data?.basicInfo.format}</Descriptions.Item>
            <Descriptions.Item label="Bracket">{data?.stages?.[0]?.brackets?.[0]?.name || 'Chưa có bracket'}</Descriptions.Item>
          </Descriptions>
        </div>
      ),
      onOk: async () => {
        setSeedingTeams(true);
        try {
          // 1. Auto seed teams
          message.loading({ content: 'Đang xếp hạt giống...', key: 'seeding', duration: 0 });
          const seedResult = await tournamentService.autoSeedTeams(data.basicInfo.id);
          
          // 2. Assign teams to matches
          message.loading({ content: 'Đang assign teams vào trận đấu...', key: 'assigning', duration: 0 });
          
          // 3. Auto schedule matches
          message.loading({ content: 'Đang lên lịch trận đấu...', key: 'scheduling', duration: 0 });
          await autoScheduleFirstRoundMatches();
          
          message.success({ content: 'Đã hoàn thành tự động seed và assign!', key: 'seeding' });
          
          // 4. Refresh data
          await refreshData();
          
          return seedResult;
        } catch (error: any) {
          message.error({ content: error.message || 'Không thể tự động seed', key: 'seeding' });
          console.error('Auto seed and assign error:', error);
          return null;
        } finally {
          setSeedingTeams(false);
        }
      }
    });
  };

  const autoScheduleFirstRoundMatches = async () => {
    if (!data?.stages?.[0]?.brackets?.[0]) return;

    const bracket = data.stages[0].brackets[0];
    const firstRoundMatches = bracket.matches?.filter(m => m.round === 1 && m.team1 && m.team2) || [];
    
    // Lên lịch cách nhau 30 phút
    const startTime = new Date();
    startTime.setHours(10, 0, 0, 0); // 10:00 AM

    for (let i = 0; i < firstRoundMatches.length; i++) {
      const match = firstRoundMatches[i];
      const scheduledTime = new Date(startTime.getTime() + i * 30 * 60000); // 30 phút cách nhau
      
      try {
        await matchService.scheduleMatch(match.id, scheduledTime);
      } catch (error) {
        console.error(`Failed to schedule match ${match.id}:`, error);
      }
    }
  };

  const handleGenerateBrackets = async () => {
    if (!data?.basicInfo.id) return;

    confirm({
      title: 'Tạo nhánh đấu tự động',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Hệ thống sẽ tạo nhánh đấu với:</p>
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="Số đội">{teams.length}</Descriptions.Item>
            <Descriptions.Item label="Thể thức">{data?.basicInfo.format}</Descriptions.Item>
            <Descriptions.Item label="Game">{data?.basicInfo.game}</Descriptions.Item>
          </Descriptions>
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
          await tournamentService.generateBrackets(data.basicInfo.id, {
            format: data.basicInfo.format,
            totalTeams: teams.length,
          });
          message.success('Đã tạo nhánh đấu thành công!');
          await refreshData();
        } catch (error: any) {
          message.error(error.message || 'Không thể tạo nhánh đấu');
          console.error('Generate bracket error:', error);
        } finally {
          setGeneratingBracket(false);
        }
      }
    });
  };

  const handleStartTournament = async () => {
    confirm({
      title: 'Bắt đầu giải đấu',
      icon: <RocketOutlined />,
      content: (
        <div>
          <Alert
            message="Sau khi bắt đầu, giải đấu sẽ:"
            description={
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>🚀 Chuyển trạng thái sang "Đang diễn ra"</li>
                <li>⏰ Bắt đầu đếm ngược thời gian</li>
                <li>📋 Hiển thị trên trang chủ</li>
                <li>🚫 <strong>Không thể hoàn tác</strong></li>
              </ul>
            }
            type="warning"
          />
          <div style={{ marginTop: 16 }}>
            <Text strong>Điều kiện bắt đầu:</Text>
            <ul>
              <li>✅ Có bracket: {data?.stages?.length > 0 ? '✓' : '✗'}</li>
              <li>✅ Có teams: {teams.length >= 2 ? '✓' : '✗'}</li>
              <li>✅ Teams đã được seed: {checkIfTeamsAreSeeded() ? '✓' : '✗'}</li>
            </ul>
          </div>
        </div>
      ),
      onOk: async () => {
        setLoading(true);
        try {
          await tournamentService.startTournament(data.basicInfo.id);
          message.success('Giải đấu đã bắt đầu!');
          await refreshData();
        } catch (error: any) {
          message.error(error.message || 'Không thể bắt đầu giải đấu');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const checkIfTeamsAreSeeded = () => {
    // Kiểm tra xem có match nào đã có team chưa
    if (!data?.stages?.[0]?.brackets?.[0]?.matches) return false;
    
    const matches = data.stages[0].brackets[0].matches;
    return matches.some(match => match.team1 || match.team2);
  };

  const handleUpdateMatchResult = async () => {
    if (!selectedMatch) return;

    setProcessingMatch(true);
    try {
      const result = await matchService.updateMatchResult(
        selectedMatch.id,
        {
          team1Score: selectedMatch.team1Score || 0,
          team2Score: selectedMatch.team2Score || 0,
        }
      );

      if (result) {
        message.success('Đã cập nhật kết quả trận đấu!');
        
        // Tự động xử lý đội thắng đi tiếp
        try {
          await handleAutoAdvanceWinner(selectedMatch.id);
        } catch (advanceError) {
          console.warn('Auto advance warning:', advanceError);
        }
        
        setIsMatchModalVisible(false);
        setSelectedMatch(null);
        await refreshData();
      }
    } catch (error: any) {
      message.error(error.message || 'Không thể cập nhật kết quả');
    } finally {
      setProcessingMatch(false);
    }
  };

  const handleAutoAdvanceWinner = async (matchId: string) => {
    try {
      const result = await matchService.autoAdvanceWinner(matchId);
      
      if (result.success) {
        message.success('Đội thắng đã được tự động chuyển đến trận tiếp theo!');
        await refreshData();
      }
      return result;
    } catch (error: any) {
      console.error('Auto advance error:', error);
      throw error;
    }
  };

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
    setIsMatchModalVisible(true);
  };

  const renderTeamList = () => (
    <Card 
      title={
        <Space>
          <TeamOutlined />
          <span>Danh sách đội đã duyệt ({teams.length})</span>
        </Space>
      }
      extra={
        <Button 
          type="primary" 
          size="small"
          icon={<SyncOutlined />}
          onClick={handleAutoSeedAndAssign}
          loading={seedingTeams}
          disabled={teams.length < 2 || !data?.stages?.length}
        >
          Auto Seed & Assign
        </Button>
      }
      style={{ marginBottom: 24 }}
    >
      <List
        dataSource={teams}
        renderItem={(team, index) => (
          <List.Item>
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
                    <Tag color="gold">#{team.seed}</Tag>
                  )}
                </Space>
              }
              description={
                <Space>
                  <Text type="secondary">{team.members?.length || 0} thành viên</Text>
                  {team.registrationDate && (
                    <Tag color="blue">
                      ĐK: {dayjs(team.registrationDate).format('DD/MM HH:mm')}
                    </Tag>
                  )}
                </Space>
              }
            />
            <Tag color="success">Đã duyệt</Tag>
          </List.Item>
        )}
      />

      {teams.length === 0 && (
        <Empty
          description="Chưa có đội nào được duyệt"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      {teams.length > 0 && (
        <Alert
          message="Hướng dẫn"
          description={
            <div>
              <p>1. Click <strong>"Auto Seed & Assign"</strong> để tự động xếp hạt giống và assign teams vào trận đấu</p>
              <p>2. Hệ thống sẽ tự động xử lý seeding và lên lịch</p>
              <p>3. Sau khi assign xong, có thể bắt đầu giải đấu</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Card>
  );

  const renderTournamentControlPanel = () => (
    <Card
      title="Điều khiển giải đấu"
      style={{ marginBottom: 24 }}
      extra={
        <Button 
          icon={<SyncOutlined />} 
          onClick={refreshData}
          loading={loading}
        >
          Tải lại
        </Button>
      }
    >
      <Steps
        current={getTournamentStep()}
        items={[
          {
            title: 'Đội đã duyệt',
            description: `${teams.length} đội`,
            // data?.basicInfo?.minTeamSize ||
            status: teams.length >= ( 2) ? 'finish' : 'process',
          },
          {
            title: 'Tạo bracket',
            description: data?.stages?.length > 0 ? 'Đã tạo' : 'Chưa tạo',
            status: data?.stages?.length > 0 ? 'finish' : 'process',
          },
          {
            title: 'Seed teams',
            description: checkIfTeamsAreSeeded() ? 'Đã seed' : 'Chưa seed',
            status: checkIfTeamsAreSeeded() ? 'finish' : 'process',
          },
          {
            title: 'Bắt đầu',
            description: tournamentInfo?.status === 'LIVE' ? 'Đang diễn ra' : 'Chờ',
            status: tournamentInfo?.status === 'LIVE' ? 'finish' : 'wait',
          },
        ]}
        size="small"
      />

      <Divider />

      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          type="primary"
          block
          icon={<SyncOutlined />}
          onClick={handleAutoSeedAndAssign}
          loading={seedingTeams}
          disabled={teams.length < 2 || !data?.stages?.length}
          size="large"
        >
          AUTO SEED & ASSIGN TEAMS
        </Button>
        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
          Tự động xếp hạt giống và assign {teams.length} đội vào trận đấu
        </Text>

        <Button
          type="dashed"
          block
          icon={<TrophyOutlined />}
          onClick={handleGenerateBrackets}
          loading={generatingBracket}
          disabled={teams.length < 2}
          size="large"
          style={{ marginTop: 8 }}
        >
          TẠO/REFRESH BRACKET
        </Button>

        {checkIfTeamsAreSeeded() && tournamentInfo?.status !== 'LIVE' && (
          <Button
            type="primary"
            danger
            block
            icon={<RocketOutlined />}
            onClick={handleStartTournament}
            size="large"
            style={{ marginTop: 8 }}
          >
            🚀 BẮT ĐẦU GIẢI ĐẤU
          </Button>
        )}
      </Space>
    </Card>
  );

  const getTournamentStep = () => {
    if (tournamentInfo?.status === 'LIVE') return 3;
    if (checkIfTeamsAreSeeded()) return 2;
    if (data?.stages?.length > 0) return 1;
    return 0;
  };

  const renderBrackets = () => {
    if (!data.stages || data.stages.length === 0) {
      return (
        <Empty
          description={
            <div>
              <Title level={4}>Chưa có nhánh đấu nào</Title>
              <Paragraph type="secondary">
                Cần ít nhất 2 đội đã được duyệt để tạo bracket.
              </Paragraph>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button 
            type="primary"
            onClick={handleGenerateBrackets}
            disabled={teams.length < 2}
            loading={generatingBracket}
            icon={<TrophyOutlined />}
            size="large"
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
              </Space>
            }
            style={{ marginBottom: 24 }}
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
                    {!checkIfTeamsAreSeeded() && (
                      <Button 
                        type="primary"
                        size="small"
                        icon={<SyncOutlined />}
                        onClick={handleAutoSeedAndAssign}
                        loading={seedingTeams}
                      >
                        Auto Assign Teams
                      </Button>
                    )}
                  </Space>
                </div>
                
                {bracket.matches && bracket.matches.length > 0 ? (
                  <TournamentBracketVisualization
                    bracket={bracket}
                    onMatchClick={handleMatchClick}
                    onScheduleMatch={() => {}}
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
          <Card title="Tổng quan lịch thi đấu">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic 
                  title="Tổng trận" 
                  value={matchStats.total} 
                  prefix={<TrophyOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Đã hoàn thành" 
                  value={matchStats.completed} 
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Đang diễn ra" 
                  value={matchStats.inProgress} 
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<PlayCircleOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Đã lên lịch" 
                  value={matchStats.scheduled} 
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<CalendarOutlined />}
                />
              </Col>
            </Row>
          </Card>
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
                      icon={<EyeOutlined />}
                      onClick={() => handleMatchClick(match)}
                    >
                      Chi tiết
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>
                          {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'}
                        </Text>
                        <Tag color="blue">Vòng {match.round}</Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <ClockCircleOutlined />
                        <Text type="secondary">
                          {dayjs(match.scheduledTime).format('DD/MM HH:mm')}
                        </Text>
                      </Space>
                    }
                  />
                  <Tag color={
                    match.status === 'COMPLETED' ? 'success' :
                    match.status === 'LIVE' ? 'processing' : 'blue'
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
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Text>
                        {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'}
                      </Text>
                    }
                    description={<Text type="secondary">Vòng {match.round} - Trận {match.order}</Text>}
                  />
                  <Tag color="orange">Chưa lên lịch</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  const renderStats = () => {
    const progressPercent = matchStats.total > 0 
      ? Math.round((matchStats.completed / matchStats.total) * 100)
      : 0;

    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Tiến độ giải đấu">
            <Progress 
              percent={progressPercent} 
              status={progressPercent === 100 ? 'success' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              style={{ marginBottom: 16 }}
            />
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">
                {matchStats.completed}/{matchStats.total} trận đã hoàn thành ({progressPercent}%)
              </Text>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Thống kê chi tiết">
            <Table
              dataSource={[
                { key: 'total', label: 'Tổng số trận', value: matchStats.total, color: '#1890ff' },
                { key: 'completed', label: 'Đã hoàn thành', value: matchStats.completed, color: '#52c41a' },
                { key: 'inProgress', label: 'Đang diễn ra', value: matchStats.inProgress, color: '#fa8c16' },
                { key: 'scheduled', label: 'Đã lên lịch', value: matchStats.scheduled, color: '#722ed1' },
                { key: 'pending', label: 'Chờ xử lý', value: matchStats.pending, color: '#d9d9d9' },
              ]}
              columns={[
                {
                  title: 'Loại',
                  dataIndex: 'label',
                  key: 'label',
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'value',
                  key: 'value',
                  render: (value, record: any) => (
                    <Tag color={record.color} style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {value}
                    </Tag>
                  ),
                },
                {
                  title: 'Tỷ lệ',
                  key: 'percentage',
                  render: (_, record: any) => {
                    const percentage = matchStats.total > 0 
                      ? Math.round((record.value / matchStats.total) * 100)
                      : 0;
                    return <Progress percent={percentage} size="small" />;
                  },
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    );
  };

  const renderMatchDetailModal = () => (
    <Modal
      title="Chi tiết trận đấu"
      open={isMatchModalVisible}
      onCancel={() => {
        setIsMatchModalVisible(false);
        setSelectedMatch(null);
      }}
      width={700}
      footer={[
        <Button key="cancel" onClick={() => setIsMatchModalVisible(false)}>
          Đóng
        </Button>,
        selectedMatch?.status !== 'COMPLETED' && selectedMatch?.team1 && selectedMatch?.team2 && (
          <Button 
            key="update" 
            type="primary"
            onClick={handleUpdateMatchResult}
            loading={processingMatch}
          >
            Cập nhật kết quả
          </Button>
        ),
      ]}
    >
      {selectedMatch && (
        <div>
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="Trận đấu">
              Vòng {selectedMatch.round} - Trận {selectedMatch.order}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={
                selectedMatch.status === 'COMPLETED' ? 'success' :
                selectedMatch.status === 'LIVE' ? 'processing' : 'blue'
              }>
                {selectedMatch.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Đội 1" span={2}>
              {selectedMatch.team1 ? (
                <Space>
                  <Avatar src={selectedMatch.team1.logoUrl} size="small" />
                  <Text strong>{selectedMatch.team1.name}</Text>
                  {selectedMatch.team1.seed && (
                    <Tag color="gold">#{selectedMatch.team1.seed}</Tag>
                  )}
                </Space>
              ) : 'Chưa có đội'}
            </Descriptions.Item>
            <Descriptions.Item label="Đội 2" span={2}>
              {selectedMatch.team2 ? (
                <Space>
                  <Avatar src={selectedMatch.team2.logoUrl} size="small" />
                  <Text strong>{selectedMatch.team2.name}</Text>
                  {selectedMatch.team2.seed && (
                    <Tag color="gold">#{selectedMatch.team2.seed}</Tag>
                  )}
                </Space>
              ) : 'Chưa có đội'}
            </Descriptions.Item>
            <Descriptions.Item label="Tỷ số">
              {selectedMatch.team1Score !== undefined && selectedMatch.team2Score !== undefined 
                ? `${selectedMatch.team1Score} - ${selectedMatch.team2Score}`
                : 'Chưa có'
              }
            </Descriptions.Item>
            <Descriptions.Item label="Đội thắng">
              {selectedMatch.winner ? (
                <Space>
                  <CrownOutlined style={{ color: '#faad14' }} />
                  <Text strong>{selectedMatch.winner.name}</Text>
                </Space>
              ) : 'Chưa xác định'}
            </Descriptions.Item>
          </Descriptions>

          {selectedMatch.status !== 'COMPLETED' && selectedMatch.team1 && selectedMatch.team2 && (
            <div style={{ marginTop: 24 }}>
              <Title level={5}>Cập nhật kết quả</Title>
              <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
                <InputNumber
                  min={0}
                  max={100}
                  value={selectedMatch.team1Score}
                  onChange={(value) => {
                    setSelectedMatch({
                      ...selectedMatch,
                      team1Score: value || 0
                    });
                  }}
                  size="large"
                  style={{ width: 100 }}
                />
                <Text strong style={{ fontSize: '24px' }}>:</Text>
                <InputNumber
                  min={0}
                  max={100}
                  value={selectedMatch.team2Score}
                  onChange={(value) => {
                    setSelectedMatch({
                      ...selectedMatch,
                      team2Score: value || 0
                    });
                  }}
                  size="large"
                  style={{ width: 100 }}
                />
              </Space>
            </div>
          )}
        </div>
      )}
    </Modal>
  );

  if (loading && !seedingTeams) {
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
          {tournamentInfo?.status === 'LIVE' && (
            <Tag color="red" icon={<PlayCircleOutlined />} style={{ fontSize: '16px', padding: '8px 16px' }}>
              ĐANG DIỄN RA
            </Tag>
          )}
          <Button 
            icon={<SyncOutlined />}
            onClick={refreshData}
            loading={loading}
          >
            Tải lại
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={6}>
          {renderTournamentControlPanel()}
          {renderTeamList()}
        </Col>
        <Col span={18}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            type="card"
            size="large"
            items={[
              {
                key: 'brackets',
                label: 'Nhánh đấu',
                children: renderBrackets(),
              },
              {
                key: 'schedule',
                label: 'Lịch thi đấu',
                children: renderMatchSchedule(),
              },
              {
                key: 'stats',
                label: 'Thống kê',
                children: renderStats(),
              },
            ]}
          />
        </Col>
      </Row>

      {renderMatchDetailModal()}
    </div>
  );
};

export default TournamentStages;
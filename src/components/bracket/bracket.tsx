import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  InputNumber, 
  Select, 
  Button, 
  message, 
  Typography, 
  Divider, 
  Space, 
  Alert,
  Steps,
  Spin,
  Tag,
  Modal,
  Progress,
  Empty
} from 'antd';
import { 
  ExclamationCircleOutlined, 
  CheckCircleOutlined,
  LoadingOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import { tournamentService } from '@/services/tournamentService';
import { bracketService } from '@/services/bracketService';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { confirm } = Modal;

interface BracketGeneratorProps {
  tournamentId: string;
  tournamentFormat: string;
  maxParticipants: number;
  matchFormat: string;
  matchDuration: number;
  approvedTeamsCount: number;
  onBracketGenerated?: () => void;
}

interface BracketStructure {
  bracket: {
    id: string;
    name: string;
    isFinal: boolean;
    structure: any;
  };
  matchesByRound: Record<number, Array<{
    id: string;
    order: number;
    team1: any;
    team2: any;
    status: string;
    nextMatchId: string;
    nextMatchSlot: string;
  }>>;
}

interface TournamentBrackets {
  brackets: Array<{
    id: string;
    name: string;
    isFinal: boolean;
    bracketOrder: number;
  }>;
}

const BracketGenerator: React.FC<BracketGeneratorProps> = ({
  tournamentId,
  tournamentFormat,
  maxParticipants = 15,
  matchFormat = 'BO1',
  matchDuration = 30,
  approvedTeamsCount = 0,
  onBracketGenerated,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tournamentBrackets, setTournamentBrackets] = useState<TournamentBrackets | null>(null);
  const [selectedBracketStructure, setSelectedBracketStructure] = useState<BracketStructure | null>(null);
  const [bracketInfo, setBracketInfo] = useState<{
    totalMatches: number;
    rounds: number;
    participantsCount: number;
    totalBrackets: number;
  } | null>(null);

  useEffect(() => {
    if (tournamentId) {
      loadTournamentBrackets();
    }
  }, [tournamentId]);

  const loadTournamentBrackets = async () => {
    setLoading(true);
    try {
      const brackets = await bracketService.getBracketStructure(tournamentId);
      setTournamentBrackets(brackets);
      
      if (brackets.brackets && brackets.brackets.length > 0) {
        const firstBracketId = brackets.brackets[0].id;
        await loadBracketStructure(firstBracketId);
        setCurrentStep(1); 
      }
    } catch (error) {
      console.error('Error loading tournament brackets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBracketStructure = async (bracketId: string) => {
    try {
      const structure = await bracketService.getBracketStructure(bracketId);
      setSelectedBracketStructure(structure);
      calculateBracketInfo(structure);
    } catch (error) {
      console.error('Error loading bracket structure:', error);
      message.error('Không thể tải cấu trúc nhánh đấu');
    }
  };

  const handleGenerateBracket = async () => {
    if (approvedTeamsCount < 2) {
      message.warning('Cần ít nhất 2 đội đã được duyệt để tạo nhánh đấu!');
      return;
    }

    confirm({
      title: 'Xác nhận tạo nhánh đấu',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn tạo nhánh đấu với thông tin sau?</p>
          <ul style={{ marginLeft: 20 }}>
            <li>Số đội đã duyệt: <strong>{approvedTeamsCount}</strong></li>
            <li>Thể thức: <strong>{tournamentFormat === 'double-elimination' ? 'Loại đầu đôi' : 'Loại đơn'}</strong></li>
            <li>Thể thức trận: <strong>{matchFormat}</strong></li>
          </ul>
          <Alert 
            type="warning" 
            message="Lưu ý: Nhánh đấu cũ sẽ bị xóa và không thể khôi phục!"
            style={{ marginTop: 16 }}
          />
        </div>
      ),
      okText: 'Tạo nhánh đấu',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        await generateBracket();
      },
    });
  };

  const generateBracket = async () => {
    setGenerating(true);
    try {
      const response = await bracketService.generateBracket(tournamentId, {
        format: tournamentFormat,
        matchFormat,
        matchDuration,
      });

      if (response.success) {
        message.success('Tạo nhánh đấu thành công!');
        
        await loadTournamentBrackets();
        
        onBracketGenerated?.();
      } else {
        message.error(response.message || 'Tạo nhánh đấu thất bại!');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo nhánh đấu');
      console.error('Generate bracket error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const calculateBracketInfo = (structure: BracketStructure) => {
    if (!structure) return;

    let totalMatches = 0;
    let rounds = 0;

    Object.keys(structure.matchesByRound).forEach(round => {
      const roundNum = parseInt(round);
      if (roundNum > rounds) rounds = roundNum;
      totalMatches += structure.matchesByRound[roundNum].length;
    });

    setBracketInfo({
      totalMatches,
      rounds,
      participantsCount: approvedTeamsCount,
      totalBrackets: tournamentBrackets?.brackets?.length || 0,
    });
  };

  const handleViewBracket = async (bracketId: string) => {
    await loadBracketStructure(bracketId);
    setCurrentStep(1);
  };

  const handleEditBracket = () => {
    setCurrentStep(0);
  };

  const handleSaveAndContinue = () => {
    message.success('Nhánh đấu đã được lưu!');
    setCurrentStep(2);
  };

  const renderBracketSelection = () => {
    if (!tournamentBrackets || !tournamentBrackets.brackets || tournamentBrackets.brackets.length === 0) {
      return (
        <Empty
          description="Chưa có nhánh đấu nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => setCurrentStep(0)}>
            Tạo nhánh đấu mới
          </Button>
        </Empty>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {tournamentBrackets.brackets.map((bracket) => (
          <Col key={bracket.id} span={8}>
            <Card
              title={bracket.name}
              extra={
                <Tag color={bracket.isFinal ? 'red' : 'blue'}>
                  {bracket.isFinal ? 'Chung kết' : 'Vòng đấu'}
                </Tag>
              }
              actions={[
                <Button 
                  type="link" 
                  icon={<EyeOutlined />}
                  onClick={() => handleViewBracket(bracket.id)}
                >
                  Xem chi tiết
                </Button>
              ]}
            >
              <Space direction="vertical">
                <Text>Thứ tự: {bracket.bracketOrder}</Text>
                <Text>Trạng thái: {bracket.isFinal ? 'Chung kết' : 'Đang thi đấu'}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const renderBracketPreview = () => {
    if (!selectedBracketStructure) {
      return (
        <Card title="Nhánh đấu">
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <ExclamationCircleOutlined style={{ fontSize: 48, color: '#faad14' }} />
            <Title level={4} style={{ marginTop: 16 }}>Chưa chọn nhánh đấu</Title>
            <Text type="secondary">Vui lòng chọn một nhánh đấu để xem chi tiết</Text>
            <div style={{ marginTop: 24 }}>
              <Button onClick={() => setCurrentStep(0)}>Quay lại chọn nhánh đấu</Button>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>
            Nhánh đấu: {selectedBracketStructure.bracket.name}
            {selectedBracketStructure.bracket.isFinal && (
              <Tag color="red" style={{ marginLeft: 8 }}>Chung kết</Tag>
            )}
          </Title>
          <Button onClick={() => setCurrentStep(0)}>Quay lại danh sách</Button>
        </div>
        
        <Card size="small" title="Thông tin tổng quan" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 8]}>
            <Col span={6}>
              <Text strong>Số đội:</Text>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                {approvedTeamsCount}
              </div>
            </Col>
            <Col span={6}>
              <Text strong>Số vòng đấu:</Text>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                {bracketInfo?.rounds || 0}
              </div>
            </Col>
            <Col span={6}>
              <Text strong>Tổng số trận:</Text>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                {bracketInfo?.totalMatches || 0}
              </div>
            </Col>
            <Col span={6}>
              <Text strong>Trạng thái:</Text>
              <div>
                <Tag color="green">Đã tạo</Tag>
              </div>
            </Col>
          </Row>
        </Card>

        {Object.keys(selectedBracketStructure.matchesByRound)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(round => {
            const roundMatches = selectedBracketStructure.matchesByRound[parseInt(round)];
            
            return (
              <Card 
                key={round} 
                size="small" 
                title={`Vòng ${round}`}
                style={{ marginBottom: 16 }}
              >
                <Row gutter={[8, 8]}>
                  {roundMatches.map(match => (
                    <Col key={match.id} span={8}>
                      <Card 
                        size="small" 
                        type="inner"
                        title={`Trận ${match.order}`}
                        style={{ 
                          backgroundColor: match.status === 'COMPLETED' ? '#f6ffed' : '#fafafa',
                          borderColor: match.status === 'COMPLETED' ? '#b7eb8f' : '#d9d9d9'
                        }}
                      >
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <div>
                            <Text strong>{match.team1?.name || 'Chờ'}</Text>
                            {match.team1 && <Tag style={{ marginLeft: 4 }}>Team</Tag>}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">vs</Text>
                          </div>
                          <div>
                            <Text strong>{match.team2?.name || 'Chờ'}</Text>
                            {match.team2 && <Tag style={{ marginLeft: 4 }}>Team</Tag>}
                          </div>
                          <Divider style={{ margin: '4px 0' }} />
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Trạng thái: <Tag color={
                              match.status === 'COMPLETED' ? 'green' :
                              match.status === 'IN_PROGRESS' ? 'blue' :
                              match.status === 'PENDING' ? 'orange' : 'default'
                            }>
                              {match.status === 'COMPLETED' ? 'Hoàn thành' :
                               match.status === 'IN_PROGRESS' ? 'Đang diễn ra' :
                               match.status === 'PENDING' ? 'Đang chờ' : 'Không xác định'}
                            </Tag>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            );
          })}

        <Space style={{ marginTop: 24 }}>
          <Button onClick={() => setCurrentStep(0)}>Quay lại</Button>
          <Button type="primary" onClick={handleSaveAndContinue}>
            Lưu và tiếp tục
          </Button>
        </Space>
      </div>
    );
  };

  const steps = [
    {
      title: 'Chọn nhánh đấu',
      content: loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Đang tải thông tin nhánh đấu...</div>
        </div>
      ) : (
        <>
          <Card 
            title="Danh sách nhánh đấu" 
            extra={
              <Button type="primary" onClick={() => setCurrentStep(3)}>
                Tạo nhánh đấu mới
              </Button>
            }
          >
            {renderBracketSelection()}
          </Card>
        </>
      ),
    },
    {
      title: 'Xem chi tiết',
      content: renderBracketPreview(),
    },
    {
      title: 'Tạo nhánh đấu',
      content: (
        <Card title="Tạo nhánh đấu tự động" size="small">
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Alert
                  message="Thông tin giải đấu"
                  description={
                    <Space direction="vertical" size="small">
                      <div>
                        <Text>• Thể thức: </Text>
                        <Tag color="blue">
                          {tournamentFormat === 'double-elimination' 
                            ? 'Loại đầu đôi (Double Elimination)' 
                            : 'Loại đơn (Single Elimination)'}
                        </Tag>
                      </div>
                      <div>
                        <Text>• Số đội đã duyệt: </Text>
                        <Tag color={approvedTeamsCount >= 2 ? 'success' : 'error'}>
                          {approvedTeamsCount} / {maxParticipants}
                        </Tag>
                        {approvedTeamsCount < 2 && (
                          <Alert 
                            type="warning" 
                            message="Cần ít nhất 2 đội đã duyệt để tạo nhánh đấu"
                            style={{ marginTop: 8 }}
                          />
                        )}
                      </div>
                      <div>
                        <Text>• Thể thức trận: </Text>
                        <Tag>{matchFormat}</Tag>
                      </div>
                      <div>
                        <Text>• Thời gian trận: </Text>
                        <Tag>{matchDuration} phút</Tag>
                      </div>
                    </Space>
                  }
                  type="info"
                  showIcon
                />
              </Col>

              <Col span={24}>
                <Card size="small" title="Thông báo quan trọng" type="inner">
                  <Paragraph>
                    <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
                    Nhánh đấu sẽ được tạo tự động dựa trên:
                  </Paragraph>
                  <ul>
                    <li>Số đội đã được duyệt tham gia</li>
                    <li>Thể thức giải đấu đã chọn</li>
                    <li>Hệ thống sẽ tự động xếp hạt giống</li>
                    <li>Các trận đấu sẽ được lên lịch tự động</li>
                  </ul>
                  <Alert
                    type="warning"
                    message="Lưu ý: Mọi nhánh đấu cũ sẽ bị xóa khi tạo mới!"
                  />
                </Card>
              </Col>

              <Col span={24}>
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  {generating ? (
                    <>
                      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                      <div style={{ marginTop: 16 }}>
                        <Text>Đang tạo nhánh đấu...</Text>
                        <Progress percent={50} status="active" style={{ width: 300, margin: '0 auto' }} />
                      </div>
                    </>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleGenerateBracket}
                      disabled={approvedTeamsCount < 2}
                      icon={<CheckCircleOutlined />}
                      loading={generating}
                    >
                      Tạo nhánh đấu tự động
                    </Button>
                  )}
                </div>
              </Col>

              <Col span={24}>
                <Button onClick={() => setCurrentStep(0)}>
                  ← Quay lại danh sách
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div>
      <Steps 
        current={currentStep} 
        style={{ marginBottom: 32 }}
        onChange={(current) => setCurrentStep(current)}
      >
        <Step title="Chọn nhánh" description="Chọn nhánh đấu để xem" />
        <Step title="Xem chi tiết" description="Xem cấu trúc nhánh đấu" />
        <Step title="Tạo mới" description="Tạo nhánh đấu mới" />
      </Steps>
      
      <div className="steps-content">
        {steps[currentStep].content}
      </div>
    </div>
  );
};

export default BracketGenerator;
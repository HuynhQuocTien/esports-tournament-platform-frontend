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
  Select,
  InputNumber,
  DatePicker,
  Form,
  Input,
  Divider,
  Popconfirm,
  Switch,
} from 'antd';
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  TeamOutlined,
  TrophyOutlined,
  ScheduleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type {
  TournamentStage,
  Bracket,
  Match,
  Team,
  TournamentStepProps
} from '@/common/types';
import { tournamentService } from '@/services/tournamentService';
import { matchService } from '@/services/matchService';
import TournamentBracketVisualization from '@/components/tournament/TournamentBracketVisualization';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface TournamentStagesProps extends TournamentStepProps {
  onNextStep?: () => void;
}

const TournamentStages: React.FC<TournamentStagesProps> = ({
  data,
  updateData,
  onNextStep
}) => {
  const [form] = Form.useForm();
  const [stageForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('stages');
  const [loading, setLoading] = useState(false);
  const [generatingBracket, setGeneratingBracket] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [editingMatch, setEditingMatch] = useState<{
    matchId: string;
    team1Score?: number;
    team2Score?: number;
    scheduledTime?: Date;
  } | null>(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [stageModalVisible, setStageModalVisible] = useState(false);
  const [editingStage, setEditingStage] = useState<TournamentStage | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (data?.registrations) {
      const approvedTeams = data.registrations
        .filter((reg: any) => reg.status === 'APPROVED')
        .map((reg: any) => reg.team);
      setTeams(approvedTeams);
    }
    
    // Kiểm tra xem đã có stages chưa
    checkFormValidity();
  }, [data]);

  // Kiểm tra validation
  const checkFormValidity = () => {
    const isValid = data.stages && data.stages.length > 0;
    setIsFormValid(isValid);
    return isValid;
  };

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
          await tournamentService.generateBrackets(data?.basicInfo.id, {
            format: data?.basicInfo.format,
            teams: teams
          });
          
          message.success('Đã tạo nhánh đấu thành công!');
          await loadTournamentData();
        } catch (error) {
          message.error('Không thể tạo nhánh đấu');
          console.error('Generate bracket error:', error);
        } finally {
          setGeneratingBracket(false);
        }
      }
    });
  };

  const loadTournamentData = async () => {
    if (!data?.basicInfo.id) return;
    
    setLoading(true);
    try {
      const res = await tournamentService.getForSetup(data.basicInfo.id);
      if (res.success) {
        const updatedData = {
          ...data,
          stages: res.data.stages || []
        };
        updateData('stages', res.data.stages || []);
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu giải đấu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStage = () => {
    setEditingStage(null);
    setStageModalVisible(true);
  };

  const handleEditStage = (stage: TournamentStage) => {
    setEditingStage(stage);
    stageForm.setFieldsValue({
      ...stage,
      startDate: stage.startDate ? dayjs(stage.startDate) : null,
      endDate: stage.endDate ? dayjs(stage.endDate) : null,
    });
    setStageModalVisible(true);
  };

  const handleDeleteStage = async (stageId: string) => {
    try {
      // TODO: Gọi API xóa stage
      const updatedStages = data.stages.filter(stage => stage.id !== stageId);
      updateData('stages', updatedStages);
      message.success('Đã xóa vòng đấu');
    } catch (error) {
      message.error('Không thể xóa vòng đấu');
    }
  };

  const handleStageModalOk = async () => {
    try {
      const values = await stageForm.validateFields();
      
      const stageData: TournamentStage = {
        ...values,
        id: editingStage?.id || `stage-${Date.now()}`,
        stageOrder: editingStage?.stageOrder || data.stages.length + 1,
        brackets: editingStage?.brackets || [],
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        endDate: values.endDate ? values.endDate.toISOString() : undefined,
      };

      let updatedStages: TournamentStage[];
      if (editingStage) {
        updatedStages = data.stages.map(stage =>
          stage.id === editingStage.id ? stageData : stage
        );
      } else {
        updatedStages = [...data.stages, stageData];
      }

      updateData('stages', updatedStages);
      setStageModalVisible(false);
      stageForm.resetFields();
      message.success(editingStage ? 'Cập nhật vòng đấu thành công' : 'Thêm vòng đấu thành công');
      checkFormValidity();
    } catch (error) {
      console.error('Error saving stage:', error);
    }
  };

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
    setIsMatchModalVisible(true);
  };

  const handleScheduleMatch = async (match: Match) => {
    setSelectedMatch(match);
    setEditingMatch({
      matchId: match.id,
      // scheduledTime: match.scheduledTime
    });
    setScheduleModalVisible(true);
  };

  const handleSaveMatchSchedule = async () => {
    if (!selectedMatch || !editingMatch?.scheduledTime) return;

    try {
      await matchService.schedule(selectedMatch.id, {
        scheduledTime: editingMatch.scheduledTime
      });
      message.success('Đã lên lịch trận đấu');
      setScheduleModalVisible(false);
      await loadTournamentData();
    } catch (error) {
      message.error('Không thể lên lịch trận đấu');
    }
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
      await loadTournamentData();
    } catch (error) {
      message.error('Không thể cập nhật kết quả');
    }
  };

  const renderStages = () => {
    if (data.stages.length === 0) {
      return (
        <Empty
          description={
            <div>
              <Title level={4}>Chưa có vòng đấu nào</Title>
              <Text type="secondary">
                Tạo vòng đấu để bắt đầu giải đấu. Cần ít nhất 1 vòng đấu.
              </Text>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button
            type="primary"
            size="large"
            onClick={handleAddStage}
            icon={<PlusOutlined />}
          >
            Thêm vòng đấu
          </Button>
          <Button
            style={{ marginLeft: 16 }}
            size="large"
            onClick={handleGenerateBrackets}
            disabled={teams.length < 2}
            loading={generatingBracket}
            icon={<TrophyOutlined />}
          >
            Tạo nhánh đấu tự động
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
                <Tag>Thứ tự: {stage.stageOrder}</Tag>
              </Space>
            }
            style={{ marginBottom: 24 }}
            extra={
              <Space>
                <Button
                  icon={<ScheduleOutlined />}
                  onClick={() => handleEditStage(stage)}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEditStage(stage)}
                >
                  Chi tiết
                </Button>
                <Popconfirm
                  title="Xác nhận xóa vòng đấu"
                  description="Bạn có chắc chắn muốn xóa vòng đấu này?"
                  onConfirm={() => stage.id && handleDeleteStage(stage.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                  >
                    Xóa
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card size="small" title="Thông tin vòng đấu">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Loại: </Text>
                      <Text>{stage.type}</Text>
                    </div>
                    {stage.format && (
                      <div>
                        <Text strong>Định dạng: </Text>
                        {/* <Text>{JSON.stringify(stage.format).type}</Text> */}
                      </div>
                    )}
                    {stage.startDate && (
                      <div>
                        <Text strong>Bắt đầu: </Text>
                        <Text>{dayjs(stage.startDate).format('DD/MM/YYYY HH:mm')}</Text>
                      </div>
                    )}
                    {stage.endDate && (
                      <div>
                        <Text strong>Kết thúc: </Text>
                        <Text>{dayjs(stage.endDate).format('DD/MM/YYYY HH:mm')}</Text>
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
              
              <Col span={16}>
                {stage.brackets && stage.brackets.length > 0 ? (
                  stage.brackets.map((bracket: Bracket) => (
                    <Card
                      key={bracket.id}
                      size="small"
                      title={
                        <Space>
                          {bracket.name}
                          {bracket.isFinal && (
                            <Tag color="red">
                              <TrophyOutlined /> Chung kết
                            </Tag>
                          )}
                        </Space>
                      }
                      style={{ marginBottom: 16 }}
                    >
                      {bracket.matches && bracket.matches.length > 0 ? (
                        <TournamentBracketVisualization
                          bracket={bracket}
                          onMatchClick={handleMatchClick}
                          onScheduleMatch={handleScheduleMatch}
                        />
                      ) : (
                        <Empty description="Chưa có trận đấu nào" />
                      )}
                    </Card>
                  ))
                ) : (
                  <Card size="small">
                    <Empty description="Chưa có nhánh đấu nào" />
                  </Card>
                )}
              </Col>
            </Row>
          </Card>
        ))}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddStage}
            size="large"
          >
            Thêm vòng đấu mới
          </Button>
        </div>
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
          <Col span={8}>
            <Card size="small">
              <StatisticCard
                title="Số đội"
                value={stats.totalTeams}
                color="#1890ff"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <StatisticCard
                title="Tổng số trận"
                value={stats.totalMatches}
                color="#52c41a"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <StatisticCard
                title="Trận đã hoàn thành"
                value={stats.completedMatches}
                color="#87d068"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <StatisticCard
                title="Trận đang diễn ra"
                value={stats.inProgressMatches}
                color="#faad14"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <StatisticCard
                title="Trận chờ"
                value={stats.pendingMatches}
                color="#d9d9d9"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <StatisticCard
                title="Trận đã lên lịch"
                value={stats.scheduledMatches}
                color="#722ed1"
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const handleSaveAndContinue = () => {
    if (!checkFormValidity()) {
      message.error('Vui lòng thiết lập ít nhất một vòng đấu');
      return;
    }

    message.success('Đã lưu thông tin vòng đấu');
    if (onNextStep) {
      setTimeout(() => {
        onNextStep();
      }, 500);
    }
  };

  return (
    <Spin spinning={loading}>
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
              icon={<TrophyOutlined />}
              onClick={handleGenerateBrackets}
              loading={generatingBracket}
              disabled={teams.length < 2}
            >
              Tạo nhánh đấu tự động
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddStage}
            >
              Thêm vòng đấu
            </Button>
          </Space>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
        >
          <TabPane tab="Vòng đấu" key="stages">
            {renderStages()}
          </TabPane>

          <TabPane tab="Lịch thi đấu" key="schedule">
            {renderMatchSchedule()}
          </TabPane>

          <TabPane tab="Thống kê" key="stats">
            {renderStats()}
          </TabPane>
        </Tabs>

        {/* Validation và nút tiếp tục */}
        <Divider />
        <Card>
          <Row justify="space-between" align="middle">
            <Col>
              {!isFormValid ? (
                <Alert
                  message="Chưa hoàn thành"
                  description="Vui lòng thiết lập ít nhất một vòng đấu để tiếp tục."
                  type="warning"
                  showIcon
                />
              ) : (
                <Alert
                  message="Đã hoàn thành"
                  description="Đã thiết lập đầy đủ vòng đấu. Bạn có thể tiếp tục sang bước tiếp theo."
                  type="success"
                  showIcon
                />
              )}
            </Col>
            <Col>
              <Space>
                <Button onClick={() => form.resetFields()}>
                  ↺ Đặt lại
                </Button>
                <Button
                  type="primary"
                  onClick={handleSaveAndContinue}
                  disabled={!isFormValid}
                  icon={<CheckCircleOutlined />}
                >
                  💾 Lưu và tiếp tục
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Stage Modal */}
        <Modal
          title={editingStage ? 'Chỉnh sửa vòng đấu' : 'Thêm vòng đấu mới'}
          open={stageModalVisible}
          onOk={handleStageModalOk}
          onCancel={() => {
            setStageModalVisible(false);
            stageForm.resetFields();
          }}
          width={600}
        >
          <Form
            form={stageForm}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Tên vòng đấu"
              rules={[{ required: true, message: 'Vui lòng nhập tên vòng đấu' }]}
            >
              <Input placeholder="VD: Vòng bảng, Playoffs, Chung kết" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại vòng đấu"
              rules={[{ required: true, message: 'Vui lòng chọn loại vòng đấu' }]}
            >
              <Select placeholder="Chọn loại vòng đấu">
                <Option value="GROUP_STAGE">Vòng bảng</Option>
                <Option value="SINGLE_ELIMINATION">Loại trực tiếp</Option>
                <Option value="DOUBLE_ELIMINATION">Loại kép</Option>
                <Option value="ROUND_ROBIN">Vòng tròn</Option>
                <Option value="SWISS">Thụy Sĩ</Option>
                <Option value="QUALIFIER">Vòng loại</Option>
                <Option value="FINAL">Chung kết</Option>
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  label="Thời gian bắt đầu"
                >
                  <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY HH:mm"
                    placeholder="Chọn ngày bắt đầu"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label="Thời gian kết thúc"
                >
                  <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY HH:mm"
                    placeholder="Chọn ngày kết thúc"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="numberOfGroups"
              label="Số lượng bảng đấu (nếu có)"
            >
              <InputNumber min={1} max={20} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="teamsPerGroup"
              label="Số đội mỗi bảng"
            >
              <InputNumber min={1} max={20} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="isSeeded"
              label="Xếp hạt giống"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>

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
          {selectedMatch && (
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
          )}
        </Modal>

        {/* Schedule Match Modal */}
        <Modal
          title="Lên lịch trận đấu"
          open={scheduleModalVisible}
          onCancel={() => setScheduleModalVisible(false)}
          onOk={handleSaveMatchSchedule}
        >
          {selectedMatch && (
            <Form layout="vertical">
              <Form.Item label="Thời gian" required>
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
      </div>
    </Spin>
  );
};

const TeamCard: React.FC<{
  team?: Team;
  slot: 1 | 2;
  matchId: string;
}> = ({ team, slot, matchId }) => {
  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
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
            icon={<TeamOutlined />}
            style={{ backgroundColor: '#f0f0f0' }}
          />
          <Text type="secondary" style={{ marginTop: 8 }}>
            Chưa có đội
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
  color: string;
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
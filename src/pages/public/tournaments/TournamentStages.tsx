// src/pages/tournaments/TournamentStages.tsx
import React, { useState, useMemo } from 'react';
import {
  Form,
  Select,
  Input,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Modal,
  message,
  DatePicker,
  Switch,
  Steps,
  Divider,
  Empty,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { TournamentStepProps, TournamentStage, StageType } from '../../../common/types/tournament';
import BracketPreview from '@/components/tournament/BracketPreview';
import StageSchedule from '@/components/tournament/StageSchedule';

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

interface StageConfig {
  type: StageType;
  name: string;
  stageOrder: number;
  format?: any;
  numberOfGroups?: number;
  teamsPerGroup?: number;
  isSeeded?: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface MatchPreview {
  round: number;
  matches: Array<{
    team1?: string;
    team2?: string;
    matchId?: string;
  }>;
}

const TournamentStages: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingStage, setEditingStage] = useState<(TournamentStage & { index: number }) | null>(null);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('config');
  const [currentStep, setCurrentStep] = useState<number>(0);

  const stages = data.stages || [];
  const maxTeams = data.basicInfo?.maxTeams || 16;
  const tournamentType = data.basicInfo?.type || 'SINGLE_ELIMINATION';

  // Danh sách Stage types với mô tả chi tiết
  const stageTypes = [
    { 
      value: 'GROUP', 
      label: 'Vòng bảng', 
      description: 'Các đội chia thành bảng đấu vòng tròn',
      icon: '🏆'
    },
    { 
      value: 'BRACKET', 
      label: 'Nhánh đấu loại', 
      description: 'Đấu loại trực tiếp theo nhánh',
      icon: '⚔️'
    },
    { 
      value: 'QUALIFIER', 
      label: 'Vòng loại', 
      description: 'Chọn đội vào vòng chính',
      icon: '🎯'
    },
    { 
      value: 'SWISS', 
      label: 'Hệ Thụy Sĩ', 
      description: 'Đấu theo hệ số Elo',
      icon: '♟️'
    },
    { 
      value: 'FINAL', 
      label: 'Chung kết', 
      description: 'Trận đấu cuối cùng',
      icon: '🏅'
    }
  ];

  // Tự động tạo bracket dựa trên số đội và loại bracket
  const generateBracketMatches = (stageConfig: StageConfig): MatchPreview[] => {
    const { type, numberOfGroups = 1, teamsPerGroup = 4 } = stageConfig;
    
    if (type === 'BRACKET') {
      // Tạo bracket đấu loại trực tiếp
      const totalTeams = Math.min(maxTeams, numberOfGroups * teamsPerGroup);
      const bracketSize = Math.pow(2, Math.ceil(Math.log2(totalTeams)));
      const rounds = Math.log2(bracketSize);
      
      const matches: MatchPreview[] = [];
      
      // Tạo các trận đấu cho từng round
      for (let round = 1; round <= rounds; round++) {
        const matchesInRound = bracketSize / Math.pow(2, round);
        const roundMatches = [];
        
        for (let i = 0; i < matchesInRound; i++) {
          roundMatches.push({
            matchId: `r${round}m${i}`,
            team1: round === 1 ? `Đội ${i * 2 + 1}` : `Thắng r${round-1}m${i*2}`,
            team2: round === 1 ? `Đội ${i * 2 + 2}` : `Thắng r${round-1}m${i*2+1}`,
          });
        }
        
        matches.push({
          round,
          matches: roundMatches
        });
      }
      
      // Thêm trận chung kết
      if (rounds > 1) {
        matches.push({
          round: rounds + 1,
          matches: [{
            matchId: 'final',
            team1: `Thắng r${rounds}m0`,
            team2: `Thắng r${rounds}m1`,
          }]
        });
      }
      
      return matches;
    }
    
    if (type === 'GROUP') {
      // Tạo lịch đấu vòng bảng
      const groups = numberOfGroups || 1;
      const matches: MatchPreview[] = [];
      
      for (let group = 1; group <= groups; group++) {
        const groupMatches = [];
        const teamsInGroup = teamsPerGroup || 4;
        
        // Tạo tất cả các cặp đấu trong bảng
        for (let i = 1; i <= teamsInGroup; i++) {
          for (let j = i + 1; j <= teamsInGroup; j++) {
            groupMatches.push({
              matchId: `g${group}_t${i}_t${j}`,
              team1: `Bảng ${group} - Đội ${i}`,
              team2: `Bảng ${group} - Đội ${j}`,
            });
          }
        }
        
        matches.push({
          round: group,
          matches: groupMatches
        });
      }
      
      return matches;
    }
    
    return [];
  };

  // Tính toán thông tin stage
  const calculateStageInfo = (config: StageConfig) => {
    const { type, numberOfGroups = 1, teamsPerGroup = 4 } = config;
    
    const totalTeams = Math.min(maxTeams, numberOfGroups * teamsPerGroup);
    const totalMatches = type === 'BRACKET' 
      ? totalTeams - 1 
      : type === 'GROUP' 
        ? numberOfGroups * (teamsPerGroup * (teamsPerGroup - 1)) / 2 
        : 0;
    
    return {
      totalTeams,
      totalMatches,
      estimatedDuration: totalMatches * 45, // phút
      bracketSize: type === 'BRACKET' ? Math.pow(2, Math.ceil(Math.log2(totalTeams))) : 0,
    };
  };

  const columns = [
    {
      title: 'STT',
      key: 'order',
      render: (_: any, __: any, index: any) => index + 1,
      width: 60,
    },
    {
      title: 'Tên vòng đấu',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: TournamentStage) => (
        <div>
          <strong>{name}</strong>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {stageTypes.find(t => t.value === record.type)?.label}
          </div>
        </div>
      ),
    },
    {
      title: 'Cấu hình',
      key: 'config',
      render: (_, record: TournamentStage) => {
        const info = calculateStageInfo(record);
        return (
          <div>
            {record.type === 'GROUP' && (
              <div>Bảng: {record.numberOfGroups} × {record.teamsPerGroup} đội</div>
            )}
            {record.type === 'BRACKET' && (
              <div>Nhánh: {info.bracketSize} đội</div>
            )}
            <div style={{ fontSize: '12px', color: '#666' }}>
              {info.totalMatches} trận
            </div>
          </div>
        );
      },
    },
    {
      title: 'Thời gian',
      key: 'schedule',
      render: (_, record: TournamentStage) => (
        <div>
          {record.startDate && (
            <div>{dayjs(record.startDate).format('DD/MM HH:mm')}</div>
          )}
          {record.endDate && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              → {dayjs(record.endDate).format('DD/MM HH:mm')}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: () => <Tag color="blue">Đã lên lịch</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      render: (_: any, record: any, index: any) => (
        <Space>
          <Tooltip title="Xem nhánh đấu">
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              onClick={() => handlePreview(index)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(index)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(index)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAdd = (): void => {
    setEditingStage(null);
    setCurrentStep(0);
    setActiveTab('config');
    setModalVisible(true);
  };

  const handleEdit = (index: number): void => {
    const stage = stages[index];
    setEditingStage({ ...stage, index });
    setCurrentStep(0);
    setActiveTab('config');
    setModalVisible(true);
    
    // Set form values
    form.setFieldsValue({
      ...stage,
      startDate: stage.startDate ? dayjs(stage.startDate) : null,
      endDate: stage.endDate ? dayjs(stage.endDate) : null,
    });
  };

  const handlePreview = (index: number): void => {
    const stage = stages[index];
    setEditingStage({ ...stage, index });
    setPreviewVisible(true);
  };

  const handleDelete = (index: number): void => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa vòng đấu này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        const newStages = stages.filter((_, i) => i !== index);
        updateData('stages', newStages);
        message.success('Đã xóa vòng đấu');
      },
    });
  };

  const handleModalOk = (): void => {
    form.validateFields().then(values => {
      const stageData: StageConfig = {
        ...values,
        startDate: values.startDate?.toDate(),
        endDate: values.endDate?.toDate(),
        format: values.format ? JSON.parse(values.format) : undefined,
      };

      // Tạo matches preview
      const matchesPreview = generateBracketMatches(stageData);
      const stageInfo = calculateStageInfo(stageData);

      const newStage: TournamentStage = {
        ...stageData,
        id: editingStage?.id || `stage-${Date.now()}`,
        format: stageData.format,
        brackets: stageData.type === 'BRACKET' ? [{
          id: `bracket-${Date.now()}`,
          name: 'Nhánh chính',
          bracketOrder: 1,
          isFinal: false,
          structure: {
            type: stageData.type,
            size: stageInfo.bracketSize,
            matches: matchesPreview,
          }
        }] : [],
        matchesPreview: matchesPreview,
        stageInfo: stageInfo,
      };

      let newStages: TournamentStage[];
      if (editingStage) {
        newStages = stages.map((stage, index) => 
          index === editingStage.index ? newStage : stage
        );
      } else {
        newStages = [...stages, newStage];
      }

      updateData('stages', newStages);
      setModalVisible(false);
      form.resetFields();
      message.success(editingStage ? 'Cập nhật thành công' : 'Thêm vòng đấu thành công');
    }).catch(error => {
      console.error('Validation failed:', error);
    });
  };

  const handleModalCancel = (): void => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleNextStep = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Watch form changes for real-time preview
  const formValues = Form.useWatch([], form);
  const previewData = useMemo(() => {
    if (!formValues?.type) return null;
    
    return {
      ...formValues,
      format: formValues.format ? JSON.parse(formValues.format) : undefined,
    };
  }, [formValues]);

  return (
    <div>
      <Card
        title={
          <div>
            <PlayCircleOutlined style={{ marginRight: 8 }} />
            Quản lý Vòng Đấu
            <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: 16, color: '#666' }}>
              ({stages.length} vòng đấu, Tối đa: {maxTeams} đội)
            </span>
          </div>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm vòng đấu
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={stages.map((stage, index) => ({ ...stage, key: index }))}
          pagination={false}
          locale={{ 
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có vòng đấu nào"
              >
                <Button type="primary" onClick={handleAdd}>
                  Thêm vòng đấu đầu tiên
                </Button>
              </Empty>
            )
          }}
        />
      </Card>

      {/* Modal tạo/chỉnh sửa stage */}
      <Modal
        title={
          <div>
            <SettingOutlined style={{ marginRight: 8 }} />
            {editingStage ? 'Chỉnh sửa vòng đấu' : 'Tạo vòng đấu mới'}
          </div>
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingStage ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="Cấu hình" />
          <Step title="Lịch trình" />
          <Step title="Xem trước" />
        </Steps>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'BRACKET',
            stageOrder: stages.length + 1,
            isSeeded: false,
            numberOfGroups: 1,
            teamsPerGroup: 4,
            format: '{"bestOf": 3}',
          }}
        >
          {currentStep === 0 && (
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên vòng đấu"
                  rules={[{ required: true, message: 'Vui lòng nhập tên vòng đấu' }]}
                >
                  <Input placeholder="VD: Vòng bảng, Playoffs, Chung kết..." />
                </Form.Item>

                <Form.Item
                  name="type"
                  label="Thể thức"
                  rules={[{ required: true, message: 'Vui lòng chọn thể thức' }]}
                >
                  <Select placeholder="Chọn thể thức">
                    {stageTypes.map(type => (
                      <Option key={type.value} value={type.value}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: 8, fontSize: '16px' }}>{type.icon}</span>
                          <div>
                            <div><strong>{type.label}</strong></div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{type.description}</div>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="stageOrder"
                  label="Thứ tự trong giải đấu"
                  rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
                >
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                >
                  {({ getFieldValue }) => {
                    const type = getFieldValue('type');
                    
                    if (type === 'GROUP') {
                      return (
                        <>
                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                name="numberOfGroups"
                                label="Số bảng"
                                rules={[{ required: true, message: 'Vui lòng nhập số bảng' }]}
                              >
                                <InputNumber 
                                  min={1} 
                                  max={8} 
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                name="teamsPerGroup"
                                label="Số đội mỗi bảng"
                                rules={[{ required: true, message: 'Vui lòng nhập số đội' }]}
                              >
                                <InputNumber 
                                  min={2} 
                                  max={8} 
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <div style={{ marginBottom: 16 }}>
                            <Tag color="blue">
                              Tổng: {getFieldValue('numberOfGroups') * getFieldValue('teamsPerGroup') || 0} đội
                            </Tag>
                          </div>
                        </>
                      );
                    }
                    
                    if (type === 'BRACKET') {
                      return (
                        <Form.Item
                          name="format"
                          label="Cấu hình format"
                          tooltip="Định dạng JSON cho cấu hình trận đấu"
                        >
                          <TextArea 
                            rows={4}
                            placeholder='{"bestOf": 3, "pointsPerWin": 3, "pointsPerDraw": 1}'
                          />
                        </Form.Item>
                      );
                    }
                    
                    return null;
                  }}
                </Form.Item>

                <Form.Item
                  name="isSeeded"
                  label="Xếp hạt giống"
                  valuePropName="checked"
                  tooltip="Sắp xếp đội theo hạt giống"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          )}

          {currentStep === 1 && (
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  label="Thời gian bắt đầu"
                >
                  <DatePicker 
                    showTime 
                    format="DD/MM/YYYY HH:mm"
                    style={{ width: '100%' }}
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
                    format="DD/MM/YYYY HH:mm"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {currentStep === 2 && previewData && (
            <div>
              <Card size="small" title="Xem trước cấu hình">
                <Row gutter={16}>
                  <Col span={8}>
                    <div><strong>Tên:</strong> {previewData.name}</div>
                    <div><strong>Thể thức:</strong> {stageTypes.find(t => t.value === previewData.type)?.label}</div>
                  </Col>
                  <Col span={8}>
                    {previewData.type === 'GROUP' && (
                      <>
                        <div><strong>Số bảng:</strong> {previewData.numberOfGroups}</div>
                        <div><strong>Đội mỗi bảng:</strong> {previewData.teamsPerGroup}</div>
                      </>
                    )}
                  </Col>
                  <Col span={8}>
                    <div><strong>Thứ tự:</strong> {previewData.stageOrder}</div>
                    <div><strong>Hạt giống:</strong> {previewData.isSeeded ? 'Có' : 'Không'}</div>
                  </Col>
                </Row>
              </Card>

              <Divider />

              <Card size="small" title="Xem trước nhánh đấu">
                {previewData.type === 'BRACKET' && (
                  <BracketPreview stageConfig={previewData} maxTeams={maxTeams} />
                )}
                {previewData.type === 'GROUP' && (
                  <StageSchedule stageConfig={previewData} maxTeams={maxTeams} />
                )}
              </Card>
            </div>
          )}
        </Form>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={handlePrevStep}>
              Quay lại
            </Button>
          )}
          {currentStep < 2 && (
            <Button type="primary" onClick={handleNextStep}>
              Tiếp tục
            </Button>
          )}
        </div>
      </Modal>

      {/* Modal xem trước bracket */}
      <Modal
        title="Xem trước nhánh đấu"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={1000}
        footer={null}
      >
        {editingStage && (
          <BracketPreview stageConfig={editingStage} maxTeams={maxTeams} />
        )}
      </Modal>
    </div>
  );
};

export default TournamentStages;
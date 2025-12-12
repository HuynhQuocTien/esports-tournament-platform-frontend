import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Button, 
  message, 
  Row, 
  Col,
  Typography,
  Space,
  Steps,
  Spin,
  Modal
} from 'antd';
import { 
  ArrowLeftOutlined,
  EyeOutlined,
  SaveOutlined,
  SettingOutlined,
  TrophyOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TagOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import TournamentBasicSettings from './TournamentSettings';
import TournamentStages from './TournamentStages';
import TournamentRegistration from './TournamentRegistration';
import TournamentRules from './TournamentRules';
import TournamentOverview from './TournamentOverview';
import TournamentBasicInfo from './TournamentBasicInfo';
import { tournamentService } from '@/services/tournamentService';
import type { 
  TournamentData, 
  TournamentDataKey, 
  TournamentApiResponse,
  PublishTournamentRequest 
} from '../../../common/types/tournament';
import { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { Step } = Steps;
const { confirm } = Modal;

const TournamentSetupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [originalData, setOriginalData] = useState<TournamentApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Thêm state để theo dõi đang xử lý API

  useEffect(() => {
    if (id) {
      loadTournamentData();
    } else {
      // Create new tournament
      setTournamentData({
        basicInfo: {
          id: '',
          name: '',
          game: '',
          description: '',
          registrationStart: new Dayjs(),
          registrationEnd: new Dayjs(),
          tournamentStart: new Dayjs(),
          tournamentEnd: new Dayjs(),
        },
        settings: {
          type: 'SINGLE_ELIMINATION',
          maxTeams: 16,
          minTeamSize: 1,
          maxTeamSize: 5,
          allowIndividual: false,
          visibility: 'PUBLIC',
          registrationFee: 0,
          prizePool: 0,
          prizeGuaranteed: false,
        },
        stages: [],
        rules: [],
        registrations: [],
      });
      setInitialLoading(false);
      setHasUnsavedChanges(true); // Tournament mới luôn có thay đổi chưa lưu
    }
  }, [id]);

  const loadTournamentData = async () => {
    setInitialLoading(true);
    try {
      if(!id) return;
      const res = await tournamentService.getForSetup(id);
      // Map API response to TournamentData
      let data;
      if(res.success){
        data = res.data;
      }
      console.log("data: ", data);
      const mappedData: TournamentData = {
        basicInfo: {
          id: data.id,
          name: data.name,
          game: data.game,
          description: data.description || '',
          logoUrl: data.logoUrl || '',
          bannerUrl: data.bannerUrl || '',
          registrationStart: data.registrationStart || '',
          registrationEnd: data.registrationEnd || '',
          tournamentStart: data.tournamentStart || '',
          tournamentEnd: data.tournamentEnd || '',
          maxTeams: data.maxTeams,
          format: data.format,
          type: data.type
        },
        settings: {
          type: data.type as any,
          maxTeams: data.maxTeams,
          minTeamSize: data.minTeamSize,
          maxTeamSize: data.maxTeamSize,
          allowIndividual: data.allowIndividual,
          visibility: data.visibility as any,
          registrationFee: parseFloat(data.registrationFee) || 0,
          prizePool: parseFloat(data.prizePool) || 0,
          prizeGuaranteed: data.prizeGuaranteed,
        },
        stages: data.stages || [],
        rules: data.rules || [],
        registrations: data.registrations || [],
      };
      
      setTournamentData(mappedData);
      // Lưu bản gốc để so sánh
      setOriginalData(data);
      setHasUnsavedChanges(false); // Dữ liệu vừa load, chưa có thay đổi
    } catch (error) {
      message.error('Không tìm thấy dữ liệu giải đấu');
      console.error('Error loading tournament:', error);
      // navigate('/tournaments/create');
    } finally {
      setInitialLoading(false);
    }
  };

  const tabs = [
     {
      key: 'basic',
      label: 'Thông tin cơ bản',
      icon: <TagOutlined />,
      component: TournamentBasicInfo
    },
    {
      key: 'settings',
      label: 'Cài đặt giải đấu',
      icon: <SettingOutlined />,
      component: TournamentBasicSettings
    },
    {
      key: 'stages',
      label: 'Vòng đấu',
      icon: <TrophyOutlined />,
      component: TournamentStages
    },
    {
      key: 'registrations',
      label: 'Đăng ký',
      icon: <TeamOutlined />,
      component: TournamentRegistration
    },
    {
      key: 'rules',
      label: 'Quy định',
      icon: <FileTextOutlined />,
      component: TournamentRules
    },
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: <EyeOutlined />,
      component: TournamentOverview
    }
  ];

  const handleSaveDraft = async () => {
    if (!tournamentData) return;
    
    setLoading(true);
    setIsProcessing(true); // Đang xử lý API
    try {
      if (id) {
        // Update existing tournament
        // Giả định API call thành công
        await tournamentService.saveDraft(id);
      } else {
        // Create new tournament
        // Giả định API call thành công và trả về ID
        // const newTournament = await tournamentService.create(tournamentData);
        // id = newTournament.id; // Cập nhật ID nếu cần
      }
      
      message.success('Đã lưu bản nháp');
      setHasUnsavedChanges(false);
      // Cập nhật originalData sau khi lưu thành công
      if (id && tournamentData) {
        // Cập nhật originalData với dữ liệu hiện tại
        // Đây chỉ là mock, bạn cần lấy dữ liệu từ API response
        setOriginalData({
          ...originalData,
          name: tournamentData.basicInfo.name,
          game: tournamentData.basicInfo.game,
          // ... các trường khác
        } as TournamentApiResponse);
      }
    } catch (error: any) {
      message.error(`Lỗi khi lưu bản nháp: ${error.message}`);
      // Giữ nguyên trạng thái chưa lưu vì lưu thất bại
      setHasUnsavedChanges(true);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (!tournamentData || !id) return;
    
    // Kiểm tra xem có thay đổi chưa lưu không
    if (hasUnsavedChanges) {
      confirm({
        title: 'Có thay đổi chưa lưu',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có thay đổi chưa lưu. Bạn có muốn lưu trước khi xuất bản?',
        okText: 'Lưu và xuất bản',
        cancelText: 'Hủy',
        onOk: async () => {
          await handleSaveDraft();
          await publishTournament();
        },
      });
      return;
    }

    // Validate required fields
    if (!tournamentData.basicInfo?.name || !tournamentData.basicInfo?.game) {
      message.error('Vui lòng điền đầy đủ thông tin cơ bản');
      setActiveTab('basic');
      return;
    }

    if (tournamentData.stages.length === 0) {
      message.error('Vui lòng thiết lập ít nhất một vòng đấu');
      setActiveTab('stages');
      return;
    }

    confirm({
      title: 'Xác nhận xuất bản giải đấu',
      icon: <ExclamationCircleOutlined />,
      content: 'Giải đấu sẽ được hiển thị công khai sau khi xuất bản. Bạn có chắc chắn?',
      onOk: async () => {
        await publishTournament();
      },
    });
  };

  const publishTournament = async () => {
    if (!tournamentData || !id) return;
    
    setLoading(true);
    try {
      const publishData: PublishTournamentRequest = {
        id,
        status: 'PUBLISHED',
      };

      await tournamentService.publishTournament(id, publishData);
      message.success('Giải đấu đã được xuất bản!');
      navigate('/tournaments');
    } catch (error: any) {
      message.error(`Lỗi khi xuất bản giải đấu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateTournamentData = async (key: TournamentDataKey, data: any) => {
    if (!tournamentData) return;
    
    // LUÔN đánh dấu có thay đổi ngay khi dữ liệu được cập nhật
    setHasUnsavedChanges(true);
    
    // Cập nhật state ngay lập tức
    const updatedData = { 
      ...tournamentData, 
      [key]: data 
    };
    setTournamentData(updatedData as TournamentData);
    
    // Nếu đang xử lý API (save/publish), không gọi API update
    if (isProcessing) return;

    // Chỉ gọi API khi có ID và không đang xử lý API khác
    if (id && !isProcessing) {
      setLoading(true);
      try {
        // await tournamentService.updateTournamentSection(id, key, data);
        
        // KHÔNG reset hasUnsavedChanges ở đây vì người dùng có thể tiếp tục thay đổi
        // Chỉ reset khi người dùng chủ động lưu
        message.success('Đã cập nhật thông tin');
      } catch (error: any) {
        message.error(`Lỗi khi cập nhật: ${error.message}`);
        // Giữ nguyên trạng thái chưa lưu
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTabChange = (newTab: string) => {
    // Nếu đang xử lý API, không cho phép chuyển tab
    if (isProcessing) {
      message.warning('Vui lòng đợi hoàn tất thao tác trước khi chuyển tab');
      return;
    }

    if (hasUnsavedChanges) {
      confirm({
        title: 'Có thay đổi chưa lưu',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có thay đổi chưa lưu. Bạn có muốn lưu trước khi chuyển tab?',
        okText: 'Lưu và chuyển',
        cancelText: 'Chuyển không lưu',
        onOk: async () => {
          await handleSaveDraft();
          setActiveTab(newTab);
        },
        onCancel: () => {
          // Cho phép chuyển tab mà không lưu
          setActiveTab(newTab);
        },
      });
    } else {
      setActiveTab(newTab);
    }
  };

  const handleBack = () => {
    // Nếu đang xử lý API, không cho phép quay lại
    if (isProcessing) {
      message.warning('Vui lòng đợi hoàn tất thao tác trước khi rời đi');
      return;
    }

    if (hasUnsavedChanges) {
      confirm({
        title: 'Có thay đổi chưa lưu',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có thay đổi chưa lưu. Bạn có muốn lưu trước khi rời đi?',
        okText: 'Lưu và rời đi',
        cancelText: 'Rời đi không lưu',
        cancelButtonProps: { danger: true },
        onOk: async () => {
          await handleSaveDraft();
          navigate('/tournaments');
        },
        onCancel: () => {
          navigate('/tournaments');
        },
      });
    } else {
      navigate('/tournaments');
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: 16 }}>Đang tải thông tin giải đấu...</Title>
      </div>
    );
  }

  if (!tournamentData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Không tìm thấy giải đấu</Title>
        <Button type="primary" onClick={() => navigate('/tournaments/create')}>
          Tạo giải đấu mới
        </Button>
      </div>
    );
  }

  const CurrentComponent = tabs.find(tab => tab.key === activeTab)?.component;

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handleBack}
                disabled={loading || isProcessing}
              >
                Quay lại
              </Button>
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {tournamentData.basicInfo?.name || 'Chưa có tên'}
                </Title>
                <Text type="secondary">
                  {tournamentData.basicInfo?.game || 'Chưa chọn game'} • 
                  {tournamentData.settings?.type ? ` ${tournamentData.settings.type}` : ' Chưa chọn thể thức'}
                  {id && ` • ID: ${id}`}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              {hasUnsavedChanges && (
                <Text type="warning" style={{ marginRight: 8 }}>
                  Có thay đổi chưa lưu
                </Text>
              )}
              {isProcessing && (
                <Spin size="small" style={{ marginRight: 8 }} />
              )}
              <Button 
                icon={<SaveOutlined />} 
                loading={loading}
                onClick={handleSaveDraft}
                disabled={!hasUnsavedChanges || isProcessing}
              >
                Lưu nháp
              </Button>
              {id && (
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                  loading={loading}
                  onClick={handlePublish}
                  disabled={!id || isProcessing}
                >
                  Xuất bản
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {/* Progress Steps */}
        <div style={{ marginBottom: 24 }}>
          <Steps current={tabs.findIndex(tab => tab.key === activeTab)} size="small">
            {tabs.map(tab => (
              <Step key={tab.key} title={tab.label} />
            ))}
          </Steps>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          items={tabs.map(tab => ({
            key: tab.key,
            label: (
              <span>
                {tab.icon} {tab.label}
              </span>
            ),
            children: CurrentComponent ? (
              <CurrentComponent
                data={tournamentData}
                updateData={updateTournamentData}
                // loading={loading}
              />
            ) : null
          }))}
        />
      </Card>
    </div>
  );
};

export default TournamentSetupPage;
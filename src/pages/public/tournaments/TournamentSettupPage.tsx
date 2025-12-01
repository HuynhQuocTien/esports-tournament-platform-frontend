// src/pages/tournaments/TournamentSetupPage.tsx
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
  Alert,
  Spin
} from 'antd';
import { 
  ArrowLeftOutlined,
  EyeOutlined,
  SaveOutlined,
  SettingOutlined,
  TrophyOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import TournamentSettings from './TournamentSettings';
import TournamentStages from './TournamentStages';
import TournamentPrizes from './TournamentPrizes';
import TournamentRegistration from './TournamentRegistration';
import TournamentRules from './TournamentRules';
import TournamentOverview from './TournamentOverview';
import type {TournamentData} from '../../../common/types/tournament';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

const TournamentSetupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadTournamentData();
     
  }, [id]);
console.log('TournamentData updated:', tournamentData);
  const loadTournamentData = async () => {
    setInitialLoading(true);
    try {
      // Giả lập API call hoặc load từ localStorage
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedTournament = localStorage.getItem('currentTournament');
      if (savedTournament) {
        const parsedData = JSON.parse(savedTournament);
        
        // Đảm bảo cấu trúc data đầy đủ
        const completeData: TournamentData = {
          basicInfo: parsedData.basicInfo || parsedData || {},
          settings: parsedData.settings || {},
          stages: parsedData.stages || [],
          prizes: parsedData.prizes || [],
          rules: parsedData.rules || [],
          registrations: parsedData.registrations || {}
        };
        
        setTournamentData(completeData);
      } else {
        message.error('Không tìm thấy dữ liệu giải đấu');
        navigate('/tournaments/create');
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu giải đấu');
      console.error('Error loading tournament:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const tabs = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: <EyeOutlined />,
      component: TournamentOverview
    },
    {
      key: 'basic',
      label: 'Thông tin cơ bản',
      icon: <SettingOutlined />,
      component: TournamentSettings
    },
    {
      key: 'stages',
      label: 'Vòng đấu',
      icon: <TrophyOutlined />,
      component: TournamentStages
    },
    {
      key: 'prizes',
      label: 'Giải thưởng',
      icon: <TrophyOutlined />,
      component: TournamentPrizes
    },
    {
      key: 'registration',
      label: 'Đăng ký',
      icon: <TeamOutlined />,
      component: TournamentRegistration
    },
    {
      key: 'rules',
      label: 'Quy định',
      icon: <FileTextOutlined />,
      component: TournamentRules
    }
  ];

  const handleSaveDraft = async () => {
    if (!tournamentData) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem('currentTournament', JSON.stringify(tournamentData));
      message.success('Đã lưu bản nháp');
    } catch (error) {
      message.error('Lỗi khi lưu bản nháp');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!tournamentData) return;
    
    setLoading(true);
    try {
      // Validate required fields
      if (!tournamentData.basicInfo?.name || !tournamentData.basicInfo?.game) {
        message.error('Vui lòng điền đầy đủ thông tin cơ bản');
        setActiveTab('basic');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to "published" storage or send to API
      const publishedTournaments = JSON.parse(localStorage.getItem('publishedTournaments') || '[]');
      publishedTournaments.push({
        ...tournamentData,
        id: id || `tournament-${Date.now()}`,
        status: 'published',
        publishedAt: new Date().toISOString()
      });
      localStorage.setItem('publishedTournaments', JSON.stringify(publishedTournaments));
      
      // Remove draft
      localStorage.removeItem('currentTournament');
      
      message.success('Giải đấu đã được xuất bản!');
      navigate('/tournaments');
    } catch (error) {
      message.error('Lỗi khi xuất bản giải đấu');
    } finally {
      setLoading(false);
    }
  };

  const updateTournamentData = (key: keyof TournamentData, data: any): void => {
    if (tournamentData) {
      const updatedData = { 
        ...tournamentData, 
        [key]: data 
      };
      setTournamentData(updatedData);
      
      // Auto-save to localStorage
      localStorage.setItem('currentTournament', JSON.stringify(updatedData));
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
                onClick={() => navigate('/tournaments')}
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
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<SaveOutlined />} 
                loading={loading}
                onClick={handleSaveDraft}
              >
                Lưu nháp
              </Button>
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />}
                loading={loading}
                onClick={handlePublish}
              >
                Xuất bản
              </Button>
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
          onChange={setActiveTab}
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
              />
            ) : null
          }))}
        />
      </Card>
    </div>
  );
};

export default TournamentSetupPage;
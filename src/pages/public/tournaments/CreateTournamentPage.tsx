import React, { useState } from 'react';
import { 
  Card, 
  Steps, 
  Button, 
  Space, 
  message, 
  Divider,
  Typography,
  Row,
  Col 
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SaveOutlined
} from '@ant-design/icons';
import TournamentBasicInfo from './TournamentBasicInfo';
import TournamentSettings from './TournamentSettings';
import TournamentStages from './TournamentStages';
import TournamentPrizes from './TournamentPrizes';
import TournamentRules from './TournamentRules';
import TournamentRegistration from './TournamentRegistration';
import TournamentOverview from './TournamentOverview';
import type { TournamentData } from '../../../common/types/tournament';

const { Title } = Typography;
const { Step } = Steps;

interface StepConfig {
  title: string;
  component: React.ComponentType<any>;
  icon: string;
}

const CreateTournamentPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [tournamentData, setTournamentData] = useState<TournamentData>({
    basicInfo: {},
    settings: {},
    stages: [],
    prizes: [],
    rules: [],
    registrations: [],
  });

  const steps: StepConfig[] = [
    {
      title: 'Thông tin cơ bản',
      component: TournamentBasicInfo,
      icon: '📝'
    },
    {
      title: 'Cài đặt',
      component: TournamentSettings,
      icon: '⚙️'
    },
    {
      title: 'Vòng đấu',
      component: TournamentStages,
      icon: '🏆'
    },
    {
      title: 'Giải thưởng',
      component: TournamentPrizes,
      icon: '💰'
    },
    {
      title: 'Quy định',
      component: TournamentRules,
      icon: '📜'
    },
    {
      title: 'Đăng ký',
      component: TournamentRegistration,
      icon: '👥'
    },
    {
      title: 'Tổng quan',
      component: TournamentOverview,
      icon: '👀'
    }
  ];

  const handleNext = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = (): void => {
    message.success('Đã lưu bản nháp thành công!');
    // API call to save draft
  };

  const handlePublish = (): void => {
    message.success('Giải đấu đã được xuất bản!');
    // API call to publish tournament
  };

  const updateTournamentData = (step: keyof TournamentData, data: any): void => {
    setTournamentData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Title level={2}>Tạo Giải Đấu Mới</Title>
            <Divider />
          </Col>
          
          <Col span={6}>
            <Steps direction="vertical" current={currentStep}>
              {steps.map((step, index) => (
                <Step 
                  key={index}
                  title={step.title}
                  icon={<span>{step.icon}</span>}
                />
              ))}
            </Steps>
          </Col>

          <Col span={18}>
            <Card 
              title={`${steps[currentStep].icon} ${steps[currentStep].title}`}
              extra={
                <Space>
                  <Button onClick={handleSaveDraft} icon={<SaveOutlined />}>
                    Lưu nháp
                  </Button>
                  {currentStep === steps.length - 1 && (
                    <Button type="primary" onClick={handlePublish}>
                      Xuất bản giải đấu
                    </Button>
                  )}
                </Space>
              }
            >
              <CurrentComponent
                data={tournamentData}
                updateData={(data: any) => updateTournamentData(
                  Object.keys(tournamentData)[currentStep] as keyof TournamentData, 
                  data
                )}
              />
              
              <Divider />
              
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button 
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  icon={<ArrowLeftOutlined />}
                >
                  Quay lại
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button 
                    type="primary" 
                    onClick={handleNext}
                    icon={<ArrowRightOutlined />}
                  >
                    Tiếp theo
                  </Button>
                ) : null}
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CreateTournamentPage;
import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Select, 
  message, 
  Row, 
  Col,
  Typography,
  Divider
} from 'antd';
import { 
  RocketOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface QuickTournamentForm {
  name: string;
  game: string;
  type: string;
  maxTeams: number;
  tournamentStart: Date;
}

const CreateTournamentPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const gameOptions = [
    'League of Legends',
    'Valorant', 
    'Counter-Strike 2',
    'Dota 2',
    'PUBG',
    'Mobile Legends',
    'Free Fire',
    'Other'
  ];

  const tournamentTypes = [
    { value: 'single_elimination', label: 'Loại trực tiếp' },
    { value: 'double_elimination', label: 'Loại kép' },
    { value: 'round_robin', label: 'Vòng tròn' },
    { value: 'swiss', label: 'Thụy Sĩ' }
  ];

  const onFinish = async (values: QuickTournamentForm) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const tournamentData = {
        ...values,
        status: 'draft',
        createdAt: new Date(),
        id: `tournament-${Date.now()}`
      };

      // Save to local storage or context
      localStorage.setItem('currentTournament', JSON.stringify(tournamentData));
      
      message.success('Tạo giải đấu thành công!');
      navigate(`/tournaments/${tournamentData.id}/setup`);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo giải đấu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <RocketOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <Title level={2}>Tạo Giải Đấu Mới</Title>
              <Text type="secondary">
                Bắt đầu với thông tin cơ bản, chi tiết có thể thiết lập sau
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                maxTeams: 16,
                type: 'single_elimination'
              }}
            >
              <Form.Item
                name="name"
                label="Tên giải đấu"
                rules={[{ required: true, message: 'Vui lòng nhập tên giải đấu' }]}
              >
                <Input 
                  size="large" 
                  placeholder="VD: Giải đấu Liên Minh Huyền Thoại Mùa Hè 2024"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="game"
                    label="Game"
                    rules={[{ required: true, message: 'Vui lòng chọn game' }]}
                  >
                    <Select 
                      size="large" 
                      placeholder="Chọn game"
                      showSearch
                    >
                      {gameOptions.map(game => (
                        <Option key={game} value={game}>{game}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label="Thể thức"
                    rules={[{ required: true, message: 'Vui lòng chọn thể thức' }]}
                  >
                    <Select size="large" placeholder="Chọn thể thức">
                      {tournamentTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="maxTeams"
                    label="Số đội tối đa"
                    rules={[{ required: true, message: 'Vui lòng nhập số đội' }]}
                  >
                    <Select size="large">
                      <Option value={8}>8 đội</Option>
                      <Option value={16}>16 đội</Option>
                      <Option value={32}>32 đội</Option>
                      <Option value={64}>64 đội</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="tournamentStart"
                    label="Ngày bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                  >
                    <Input type="date" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Mô tả ngắn (tùy chọn)"
              >
                <TextArea 
                  rows={3} 
                  placeholder="Mô tả ngắn gọn về giải đấu..."
                />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  loading={loading}
                  icon={<RocketOutlined />}
                  style={{ width: '100%' }}
                >
                  Tạo Giải Đấu
                </Button>
              </Form.Item>

              <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                Bạn có thể thiết lập chi tiết vòng đấu, giải thưởng, quy định sau khi tạo
              </Text>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateTournamentPage;
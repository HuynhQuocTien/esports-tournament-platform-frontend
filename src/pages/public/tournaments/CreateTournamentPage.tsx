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
  Divider,
  InputNumber,
  DatePicker,
} from 'antd';
import { 
  RocketOutlined,
} from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
import { tournamentService } from '@/services/tournamentService';
import type { TournamentBasicInfo } from '@/common/types';
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface TournamentFormData {
  name: string;
  game: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  registrationStart?: string;
  registrationEnd?: string;
  tournamentStart?: string;
  tournamentEnd?: string;
  maxTeams: number;
  type: string;
}

const CreateTournamentPage: React.FC = () => {
  const [form] = Form.useForm();
  // const navigate = useNavigate();
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

  const tournamentFormat = [
    { value: 'SINGLE_ELIMINATION', label: 'Loại trực tiếp' },
    { value: 'DOUBLE_ELIMINATION', label: 'Loại đấu đôi' },
  ];
  const tournamentTypes = [
    { value: 'team', label: 'Teams' },
    { value: 'solo', label: 'Solo' },
  ];


  const onFinish = async (values: TournamentBasicInfo) => {
    setLoading(true);
    try {
      // Chuyển đổi dữ liệu ngày tháng thành ISO string

      const res = await tournamentService.create(values);
      if (res)
        message.success('Tạo giải đấu thành công!');
      
      // navigate(`/tournaments/setup/${res.data.id}`);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo giải đấu');
      console.log('Error creating tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18}>
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
                type: 'solo'
              }}
            >
              {/* Thông tin cơ bản */}
              <Title level={4} style={{ marginBottom: 16 }}>Thông tin cơ bản</Title>
              
              <Form.Item
                name="name"
                label="Tên giải đấu"
                rules={[{ required: true, message: 'Vui lòng nhập tên giải đấu' }]}
              >
                <Input 
                  size="large" 
                  placeholder="VD: Giải đấu Liên Minh Huyền Thoại Mùa Hè 2026"
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
                <Col span={6}>
                  <Form.Item
                    name="format"
                    label="Thể thức giải đấu"
                    rules={[{ required: true, message: 'Vui lòng chọn' }]}
                  >
                    <Select size="large" placeholder="Chọn thể thức giải đấu">
                      {tournamentFormat.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="type"
                    label="Tham gia dưới dạng"
                    rules={[{ required: true, message: 'Vui lòng chọn' }]}
                  >
                    <Select size="large" placeholder="Chọn loại giải đấu">
                      {tournamentTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="maxTeams"
                label="Số đội/thí sinh tối đa"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng' },
                  { type: 'number', min: 2, message: 'Phải có ít nhất 2' }
                ]}
              >
                <InputNumber 
                  min={2} 
                  max={512} 
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="VD: 8, 16, 32, 64..."
                />
              </Form.Item>

              {/* Thời gian
              <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>Thời gian</Title>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="registrationPeriod"
                    label="Thời gian đăng ký"
                  >
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="tournamentPeriod"
                    label="Thời gian diễn ra giải đấu"
                  >
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row> */}

              {/* Mô tả */}
              <Form.Item
                name="description"
                label="Mô tả chi tiết"
              >
                <TextArea 
                  rows={4} 
                  placeholder="Mô tả chi tiết về giải đấu, thể lệ, giải thưởng, quy định..."
                  maxLength={2000}
                  showCount
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
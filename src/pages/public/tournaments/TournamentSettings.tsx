import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Row,
  Col,
  Card,
  InputNumber,
  Divider,
  message,
  Typography,
  Switch,
  Radio
} from 'antd';
import {
  UploadOutlined
} from '@ant-design/icons';
import type { TournamentStepProps } from '../../../common/types/tournament';
import { TournamentFormatValues } from '../../../common/types/tournament';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const TournamentBasicSettings: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();

  // Reset form khi data thay đổi
  useEffect(() => {
    if (data.basicInfo && Object.keys(data.basicInfo).length > 0) {
      form.setFieldsValue(data.basicInfo);
    }
  }, [data.basicInfo, form]);

  const onFinish = (values: any): void => {
    console.log('Form values:', values);
    updateData('basicInfo', { ...data.basicInfo, ...values });
    message.success('Đã lưu thông tin cơ bản');
  };

  const tournamentFormatOptions = [
    { 
      value: 'SINGLE_ELIMINATION', 
      label: 'Loại trực tiếp (Single Elimination)',
      description: 'Đội thua bị loại ngay lập tức'
    },
    { 
      value: 'DOUBLE_ELIMINATION', 
      label: 'Loại kép (Double Elimination)',
      description: 'Đội thua được thi đấu thêm một cơ hội'
    },
    { 
      value: 'ROUND_ROBIN', 
      label: 'Vòng tròn (Round Robin)',
      description: 'Tất cả đội đấu với nhau'
    },
    { 
      value: 'SWISS_SYSTEM', 
      label: 'Hệ Thụy Sĩ (Swiss System)',
      description: 'Đội có cùng thành tích đấu với nhau'
    },
    { 
      value: 'GROUP_STAGE', 
      label: 'Vòng bảng + Playoffs',
      description: 'Chia bảng đấu vòng tròn sau đó đấu loại trực tiếp'
    },
    { 
      value: 'HYBRID', 
      label: 'Kết hợp (Hybrid)',
      description: 'Kết hợp nhiều thể thức'
    }
  ];

  const visibilityOptions = [
    { 
      value: 'PUBLIC', 
      label: 'Công khai',
      description: 'Hiển thị công khai cho mọi người'
    },
    { 
      value: 'PRIVATE', 
      label: 'Riêng tư',
      description: 'Chỉ người được mời mới có thể tham gia'
    },
    { 
      value: 'INVITE_ONLY', 
      label: 'Chỉ mời',
      description: 'Chỉ tham gia khi có lời mời'
    }
  ];

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

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          type: 'SINGLE_ELIMINATION',
          maxTeams: 16,
          minTeamSize: 1,
          maxTeamSize: 5,
          allowIndividual: false,
          visibility: 'PUBLIC',
          allowDraws: false,
          ...data.basicInfo
        }}
      >
        <Row gutter={[24, 16]}>
          {/* Thông tin cơ bản */}
          <Col span={24}>
            <Card title="Thông tin cơ bản" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên giải đấu"
                    rules={[{ required: true, message: 'Vui lòng nhập tên giải đấu' }]}
                  >
                    <Input placeholder="Nhập tên giải đấu" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="game"
                    label="Game"
                    rules={[{ required: true, message: 'Vui lòng chọn game' }]}
                  >
                    <Select placeholder="Chọn game">
                      {gameOptions.map(game => (
                        <Option key={game} value={game}>{game}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Cài đặt thể thức và đội */}
          <Col span={12}>
            <Card title="Thể thức giải đấu" size="small">
              <Form.Item
                name="type"
                label="Thể thức"
                rules={[{ required: true, message: 'Vui lòng chọn thể thức' }]}
              >
                <Select placeholder="Chọn thể thức">
                  {tournamentFormatOptions.map(format => (
                    <Option key={format.value} value={format.value}>
                      <div>
                        <div><strong>{format.label}</strong></div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {format.description}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="maxTeams"
                label="Số đội tối đa"
                rules={[
                  { required: true, message: 'Vui lòng nhập số đội' },
                  { type: 'number', min: 2, max: 512, message: 'Số đội phải từ 2 đến 512' }
                ]}
              >
                <InputNumber 
                  min={2} 
                  max={512} 
                  style={{ width: '100%' }} 
                  placeholder="VD: 8, 16, 32"
                />
              </Form.Item>

              <Form.Item
                name="allowIndividual"
                label="Cho phép cá nhân tham gia"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="allowDraws"
                label="Cho phép kết quả hòa"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>

          {/* Cài đặt đội */}
          <Col span={12}>
            <Card title="Cài đặt đội" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="minTeamSize"
                    label="Số thành viên tối thiểu"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số thành viên' },
                      { type: 'number', min: 1, max: 50, message: 'Số thành viên phải từ 1 đến 50' }
                    ]}
                  >
                    <InputNumber 
                      min={1} 
                      max={50} 
                      style={{ width: '100%' }} 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="maxTeamSize"
                    label="Số thành viên tối đa"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số thành viên' },
                      { type: 'number', min: 1, max: 50, message: 'Số thành viên phải từ 1 đến 50' }
                    ]}
                  >
                    <InputNumber 
                      min={1} 
                      max={50} 
                      style={{ width: '100%' }} 
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                  <small>Lưu ý: Đội phải có ít nhất Min thành viên và nhiều nhất Max thành viên</small>
                </Text>
              </div>

              <Form.Item
                name="visibility"
                label="Chế độ hiển thị"
                rules={[{ required: true, message: 'Vui lòng chọn chế độ hiển thị' }]}
              >
                <Radio.Group style={{ width: '100%' }}>
                  {visibilityOptions.map(option => (
                    <Radio key={option.value} value={option.value} style={{ display: 'block', marginBottom: 8 }}>
                      <div>
                        <div><strong>{option.label}</strong></div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {option.description}
                        </div>
                      </div>
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Card>
          </Col>

          {/* Phí và giải thưởng */}
          {/* <Col span={12}>
            <Card title="Phí đăng ký và giải thưởng" size="small">
              <Form.Item
                name="registrationFee"
                label="Phí đăng ký (VNĐ)"
              >
                <InputNumber 
                  min={0}
                  style={{ width: '100%' }} 
                  placeholder="Nhập số tiền phí đăng ký"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                name="prizePool"
                label="Tổng giải thưởng (VNĐ)"
              >
                <InputNumber 
                  min={0}
                  style={{ width: '100%' }} 
                  placeholder="Nhập tổng giải thưởng"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                name="prizeGuaranteed"
                label="Giải thưởng đảm bảo"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col> */}

          {/* Cài đặt trận đấu */}
          <Col span={12}>
            <Card title="Cài đặt trận đấu mặc định" size="small">
              <Form.Item
                name="defaultBestOf"
                label="Thể thức (Best Of)"
                tooltip="Số trận thắng cần thiết để chiến thắng loạt đấu"
              >
                <Select placeholder="Chọn thể thức">
                  <Option value={1}>BO1 (1 trận thắng)</Option>
                  <Option value={2}>BO2 (2 trận thắng)</Option>
                  <Option value={3}>BO3 (3 trận thắng)</Option>
                  <Option value={5}>BO5 (5 trận thắng)</Option>
                  <Option value={7}>BO7 (7 trận thắng)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="defaultMatchTime"
                label="Thời gian mỗi trận (phút)"
                tooltip="Thời gian dự kiến cho mỗi trận đấu"
              >
                <InputNumber 
                  min={5}
                  max={180}
                  style={{ width: '100%' }} 
                  placeholder="VD: 30, 45, 60"
                />
              </Form.Item>
            </Card>
          </Col>
          {/* Nút lưu */}
          <Col span={24}>
            <Divider />
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" size="large">
                Lưu cài đặt
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TournamentBasicSettings;
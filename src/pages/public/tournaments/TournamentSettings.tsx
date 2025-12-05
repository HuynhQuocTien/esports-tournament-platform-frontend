import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Row,
  Col,
  Card,
  InputNumber,
  Divider,
  message,
  Typography
} from 'antd';
import {
  UploadOutlined
} from '@ant-design/icons';
import type { TournamentStepProps } from '../../../common/types/tournament';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const TournamentBasicSettings: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();

  console.log('TournamentBasicSettings data:', data);
  console.log('BasicInfo:', data.basicInfo);

  // Reset form khi data thay đổi
  useEffect(() => {
    console.log('useEffect triggered, basicInfo:', data.basicInfo);
    if (data.basicInfo && Object.keys(data.basicInfo).length > 0) {
      form.setFieldsValue(data.basicInfo);
      console.log('Form fields set with:', data.basicInfo);
    }
  }, [data.basicInfo, form]);

  const onFinish = (values: any): void => {
    console.log('Form values:', values);
    updateData('basicInfo', { ...data.basicInfo, ...values });
    message.success('Đã lưu thông tin cơ bản');
  };

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
    { value: 'swiss', label: 'Thụy Sĩ' },
    { value: 'group_stage', label: 'Vòng bảng + Playoffs' }
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Công khai' },
    { value: 'private', label: 'Riêng tư' },
    { value: 'unlisted', label: 'Không công khai' }
  ];

  return (
    <div>
      {/* Debug info */}
      <div style={{ 
        marginBottom: 16, 
        padding: 12, 
        background: '#f0f8ff', 
        borderRadius: 6,
        border: '1px solid #91d5ff'
      }}>
        <Text type="secondary">
          Debug: basicInfo keys - {data.basicInfo ? Object.keys(data.basicInfo).join(', ') : 'empty'}
        </Text>
      </div>

      <Form
        key={JSON.stringify(data.basicInfo)} // Force re-render
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={data.basicInfo || {}}
      >
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Card title="Thông tin chính" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên giải đấu"
                    rules={[{ required: true, message: 'Vui lòng nhập tên giải đấu' }]}
                  >
                    <Input placeholder="Tên giải đấu" />
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

              {/* <Form.Item
                name="description"
                label="Mô tả"
              >
                <TextArea rows={3} placeholder="Mô tả về giải đấu..." />
              </Form.Item>

              <Form.Item
                name="shortDescription"
                label="Mô tả ngắn"
              >
                <Input placeholder="Mô tả ngắn gọn (hiển thị ở trang chủ)" />
              </Form.Item> */}
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Thời gian" size="small">
              <Form.Item
                name="registrationStart"
                label="Bắt đầu đăng ký"
              >
                <DatePicker 
                  showTime 
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }} 
                  placeholder="Chọn ngày giờ"
                />
              </Form.Item>

              <Form.Item
                name="registrationEnd"
                label="Kết thúc đăng ký"
              >
                <DatePicker 
                  showTime 
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }} 
                  placeholder="Chọn ngày giờ"
                />
              </Form.Item>

              <Form.Item
                name="tournamentStart"
                label="Bắt đầu giải đấu"
              >
                <DatePicker 
                  showTime 
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }} 
                  placeholder="Chọn ngày giờ"
                />
              </Form.Item>

              <Form.Item
                name="tournamentEnd"
                label="Kết thúc giải đấu"
              >
                <DatePicker 
                  showTime 
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }} 
                  placeholder="Chọn ngày giờ"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Cài đặt" size="small">
              <Form.Item
                name="type"
                label="Thể thức"
                rules={[{ required: true, message: 'Vui lòng chọn thể thức' }]}
              >
                <Select placeholder="Chọn thể thức">
                  {tournamentTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="maxTeams"
                label="Số đội tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập số đội' }]}
              >
                <InputNumber 
                  min={2} 
                  max={512} 
                  style={{ width: '100%' }} 
                  placeholder="VD: 16, 32, 64"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="minTeamSize"
                    label="Số thành viên tối thiểu"
                  >
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="maxTeamSize"
                    label="Số thành viên tối đa"
                  >
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="visibility"
                label="Hiển thị"
              >
                <Select placeholder="Chọn chế độ hiển thị">
                  {visibilityOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Hình ảnh" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="logo" label="Logo giải đấu">
                    <Upload 
                      beforeUpload={() => false} 
                      maxCount={1}
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>Tải lên logo</Button>
                    </Upload>
                    {data.basicInfo?.logoUrl && (
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">Current logo: {data.basicInfo.logoUrl}</Text>
                        <img 
                          src={data.basicInfo.logoUrl} 
                          alt="Logo" 
                          style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 8 }}
                        />
                      </div>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="banner" label="Banner giải đấu">
                    <Upload 
                      beforeUpload={() => false} 
                      maxCount={1}
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>Tải lên banner</Button>
                    </Upload>
                    {data.basicInfo?.bannerUrl && (
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">Current banner: {data.basicInfo.bannerUrl}</Text>
                        <img 
                          src={data.basicInfo.bannerUrl} 
                          alt="Banner" 
                          style={{ width: 200, height: 100, objectFit: 'cover', marginTop: 8 }}
                        />
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Divider />
            <Button type="primary" htmlType="submit" size="large">
              Lưu thông tin cơ bản
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TournamentBasicSettings;
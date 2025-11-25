import React from 'react';
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
} from 'antd';
import {
  UploadOutlined
} from '@ant-design/icons';
import type { TournamentStepProps } from '../../../common/types/tournament';
import type { UploadProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const TournamentBasicInfo: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any): void => {
    updateData(values);
  };

  const gameOptions: string[] = [
    'League of Legends',
    'Valorant', 
    'Counter-Strike 2',
    'Dota 2',
    'PUBG',
    'Mobile Legends',
    'Free Fire',
    'Other'
  ];

  const uploadProps: UploadProps = {
    beforeUpload: () => false,
    listType: "picture" as const,
    maxCount: 1
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={data.basicInfo || {}}
    >
      <Row gutter={[24, 16]}>
        <Col span={24}>
          <Card title="Thông tin chung" size="small">
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên giải đấu"
                  rules={[{ required: true, message: 'Vui lòng nhập tên giải đấu' }]}
                >
                  <Input placeholder="VD: Giải đấu Liên Minh Huyền Thoại Mùa Hè 2024" />
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

            <Form.Item
              name="description"
              label="Mô tả giải đấu"
            >
              <TextArea 
                rows={4} 
                placeholder="Mô tả chi tiết về giải đấu, thể lệ, mục tiêu..."
              />
            </Form.Item>

            <Form.Item
              name="shortDescription"
              label="Mô tả ngắn"
            >
              <Input placeholder="Mô tả ngắn gọn về giải đấu" />
            </Form.Item>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Hình ảnh" size="small">
            <Form.Item name="logo" label="Logo giải đấu">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Tải lên logo</Button>
              </Upload>
            </Form.Item>

            <Form.Item name="banner" label="Banner giải đấu">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Tải lên banner</Button>
              </Upload>
            </Form.Item>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Thời gian" size="small">
            <Form.Item
              name="registrationStart"
              label="Bắt đầu đăng ký"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="registrationEnd"
              label="Kết thúc đăng ký"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="tournamentStart"
              label="Bắt đầu giải đấu"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Card>
        </Col>

        <Col span={24}>
          <Button type="primary" htmlType="submit">
            Lưu và tiếp tục
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default TournamentBasicInfo;
import React from 'react';
import {
    Form,
    Card,
    Row,
    Col,
    InputNumber,
    Switch,
    DatePicker,
    Input,
    Select,
    Divider,
    Typography,
    Button,
} from 'antd';
const { Text } = Typography;
import type { TournamentStepProps } from '../../../common/types/tournament';

const { Option } = Select;
const { TextArea } = Input;

const TournamentRegistration: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any): void => {
    updateData({ registrations: values });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={data.registrations || {}}
    >
      <Row gutter={[24, 16]}>
        <Col span={24}>
          <Card title="Cài đặt Đăng ký" size="small">
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  name="requireApproval"
                  label="Yêu cầu phê duyệt"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Text type="secondary">
                  Khi bật, đăng ký cần được phê duyệt thủ công
                </Text>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="allowWaitlist"
                  label="Cho phép danh sách chờ"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Text type="secondary">
                  Tự động chuyển sang danh sách chờ khi đủ số đội
                </Text>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 0]}>
              <Col span={8}>
                <Form.Item
                  name="maxTeams"
                  label="Số đội tối đa"
                >
                  <InputNumber 
                    min={2} 
                    max={512} 
                    style={{ width: '100%' }}
                    placeholder="VD: 16, 32, 64"
                  />
                </Form.Item>
              </Col>
              
              <Col span={8}>
                <Form.Item
                  name="minTeamSize"
                  label="Số thành viên tối thiểu"
                >
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              
              <Col span={8}>
                <Form.Item
                  name="maxTeamSize"
                  label="Số thành viên tối đa"
                >
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Thời gian Check-in" size="small">
            <Form.Item
              name="checkinEnabled"
              label="Bật check-in"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="checkinStart"
              label="Bắt đầu check-in"
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="checkinEnd"
              label="Kết thúc check-in"
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="checkinDuration"
              label="Thời gian check-in (phút)"
            >
              <InputNumber min={5} max={120} style={{ width: '100%' }} />
            </Form.Item>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Yêu cầu bổ sung" size="small">
            <Form.Item
              name="requireRank"
              label="Yêu cầu rank"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="minRank"
              label="Rank tối thiểu"
            >
              <Select placeholder="Chọn rank tối thiểu">
                <Option value="iron">Iron</Option>
                <Option value="bronze">Bronze</Option>
                <Option value="silver">Silver</Option>
                <Option value="gold">Gold</Option>
                <Option value="platinum">Platinum</Option>
                <Option value="diamond">Diamond</Option>
                <Option value="master">Master</Option>
                <Option value="grandmaster">Grandmaster</Option>
                <Option value="challenger">Challenger</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="requireDiscord"
              label="Yêu cầu Discord"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="requireSteam"
              label="Yêu cầu Steam"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Form đăng ký tùy chỉnh" size="small">
            <Form.Item
              name="customFields"
              label="Trường tùy chỉnh"
            >
              <TextArea 
                rows={4} 
                placeholder={`VD: [
  {
    "field": "team_captain",
    "label": "Đội trưởng",
    "type": "text",
    "required": true
  },
  {
    "field": "team_experience", 
    "label": "Kinh nghiệm thi đấu",
    "type": "textarea",
    "required": false
  }
]`}
              />
            </Form.Item>
            <Text type="secondary">
              Thêm các trường tùy chỉnh cho form đăng ký (JSON format)
            </Text>
          </Card>
        </Col>

        <Col span={24}>
          <Button type="primary" htmlType="submit">
            Lưu cài đặt đăng ký
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default TournamentRegistration;
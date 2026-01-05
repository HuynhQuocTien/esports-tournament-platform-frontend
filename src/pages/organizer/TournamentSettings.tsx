import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Card,
  InputNumber,
  Divider,
  Typography,
  Switch,
} from 'antd';
import type { TournamentStepProps } from '@/common/types/tournament';

const { Option } = Select;
const { Text } = Typography;

const TournamentBasicSettings: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data.settings && Object.keys(data.settings).length > 0) {
      form.setFieldsValue(data.settings);
    }
  }, [data.settings, form]);
  console.log(data.settings);
  const onFinish = (values: any): void => {
    updateData('settings', { ...data.settings, ...values });
  };

  const tournamentFormat = data.basicInfo || 'SINGLE_ELIMINATION';

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          allowTeamRegistration: true,
          requireApproval: false,
          
          allowDraws: false,
          defaultBestOf: 1,
          autoSchedule: false,
          defaultMatchTime: 30,
          
          notifyMatchStart: true,
          notifyRegistration: true,
          notifyResults: true,
          
          ...data.settings
        }}
      >
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Card title="Cài đặt đăng ký" size="small">
              <Form.Item
                name="allowTeamRegistration"
                label="Cho phép đăng ký đội"
                valuePropName="checked"
                tooltip="Cho phép các đội đăng ký tham gia giải đấu"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="requireApproval"
                label="Yêu cầu phê duyệt đăng ký"
                valuePropName="checked"
                tooltip="Các đội đăng ký cần được phê duyệt trước khi tham gia"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Cài đặt trận đấu" size="small">
              <Form.Item
                name="allowDraws"
                label="Cho phép kết quả hòa"
                valuePropName="checked"
                tooltip="Cho phép các trận đấu kết thúc với tỷ số hòa"
              >
                <Switch />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="defaultBestOf"
                    label="Thể thức mặc định"
                    tooltip="Số trận thắng cần thiết để chiến thắng loạt đấu"
                  >
                    <Select style={{ width: '100%' }}>
                      <Option value={1}>BO1</Option>
                      <Option value={2}>BO2</Option>
                      <Option value={3}>BO3</Option>
                      <Option value={5}>BO5</Option>
                      <Option value={7}>BO7</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="defaultMatchTime"
                    label="Thời gian trận (phút)"
                    tooltip="Thời gian dự kiến cho mỗi trận đấu"
                  >
                    <InputNumber 
                      min={5}
                      max={180}
                      style={{ width: '100%' }} 
                      placeholder="VD: 30"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="autoSchedule"
                label="Tự động lên lịch"
                valuePropName="checked"
                tooltip="Tự động sắp xếp lịch thi đấu cho các trận"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Cài đặt thông báo" size="small">
              <Row gutter={[24, 16]}>
                <Col span={8}>
                  <Form.Item
                    name="notifyMatchStart"
                    label="Thông báo khi trận đấu bắt đầu"
                    valuePropName="checked"
                    tooltip="Gửi thông báo khi trận đấu sắp bắt đầu"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="notifyRegistration"
                    label="Thông báo đăng ký"
                    valuePropName="checked"
                    tooltip="Thông báo khi có đội đăng ký mới"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="notifyResults"
                    label="Thông báo kết quả"
                    valuePropName="checked"
                    tooltip="Thông báo khi có kết quả trận đấu mới"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">
                  <small>Thông báo sẽ được gửi cho quản trị viên và người tham gia giải đấu</small>
                </Text>
              </div>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Cài đặt bổ sung" size="small">
              <Row gutter={[24, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="matchFormat"
                    label="Định dạng trận đấu tùy chỉnh"
                    tooltip="Các tùy chỉnh đặc biệt cho định dạng trận đấu (JSON)"
                  >
                    <Input.TextArea 
                      rows={4}
                      placeholder='VD: {"rounds": 3, "timePerRound": 300, "overtime": true}'
                    />
                  </Form.Item>
                  <div style={{ marginTop: -10, marginBottom: 10 }}>
                    <Text type="secondary">
                      <small>Nhập dữ liệu JSON để tùy chỉnh định dạng trận đấu</small>
                    </Text>
                  </div>
                </Col>
                
                <Col span={12}>
                  <div style={{ padding: '8px 0' }}>
                    <Text strong>Ghi chú về cài đặt:</Text>
                    <ul style={{ marginTop: 8, paddingLeft: 20, color: '#666' }}>
                      <li><small>BO (Best Of): Số trận thắng cần thiết để thắng loạt đấu</small></li>
                      <li><small>Tự động lên lịch: Hệ thống sẽ tự sắp xếp lịch thi đấu dựa trên số đội</small></li>
                      <li><small>Phê duyệt đăng ký: Quản trị viên cần duyệt từng đội đăng ký</small></li>
                      <li><small>Định dạng JSON: Dành cho các tùy chỉnh nâng cao về trận đấu</small></li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

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
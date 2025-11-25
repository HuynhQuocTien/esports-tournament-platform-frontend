import React from 'react';
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Row,
  Col,
  Card,
  Radio,
  Button,
} from 'antd';
import type { TournamentStepProps } from '../../../common/types/tournament';

const { Option } = Select;
interface TournamentType {
  value: string;
  label: string;
}

interface VisibilityOption {
  value: string;
  label: string;
}

const TournamentSettings: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any): void => {
    updateData(values);
  };

  const tournamentTypes: TournamentType[] = [
    { value: 'single_elimination', label: 'Loại trực tiếp' },
    { value: 'double_elimination', label: 'Loại kép' },
    { value: 'round_robin', label: 'Vòng tròn' },
    { value: 'swiss', label: 'Thụy Sĩ' },
    { value: 'group_stage', label: 'Vòng bảng + Playoffs' }
  ];

  const visibilityOptions: VisibilityOption[] = [
    { value: 'public', label: 'Công khai' },
    { value: 'private', label: 'Riêng tư' },
    { value: 'unlisted', label: 'Không công khai' }
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={data.settings || {}}
    >
      <Row gutter={[24, 16]}>
        <Col span={12}>
          <Card title="Thể thức & Quy mô" size="small">
            <Form.Item
              name="type"
              label="Thể thức giải đấu"
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
                placeholder="VD: 16, 32, 64..."
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
              name="allowIndividual"
              label="Cho phép đăng ký cá nhân"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Cài đặt bổ sung" size="small">
            <Form.Item
              name="visibility"
              label="Chế độ hiển thị"
            >
              <Radio.Group>
                {visibilityOptions.map(option => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="requireCheckin"
              label="Yêu cầu check-in"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="registrationFee"
              label="Phí đăng ký (VND)"
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value?.toString().replace(/\D/g, '') || '0'}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="prizePool"
              label="Tổng giải thưởng (VND)"
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value?.toString().replace(/₫\s?|(,*)/g, '') || '0'}
                min={0}
              />
            </Form.Item>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Cài đặt trận đấu" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="defaultBestOf"
                  label="Format mặc định (BO)"
                >
                  <Select defaultValue={1}>
                    <Option value={1}>BO1</Option>
                    <Option value={3}>BO3</Option>
                    <Option value={5}>BO5</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="defaultMatchTime"
                  label="Thời gian trận mặc định (phút)"
                >
                  <InputNumber min={5} max={120} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="allowDraws"
                  label="Cho phép hòa"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
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

export default TournamentSettings;
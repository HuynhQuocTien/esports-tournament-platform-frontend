import React, { useEffect, useState } from 'react';
import {
  Form,
  Row,
  Col,
  Card,
  Switch,
  Select,
  InputNumber,
  Input,
  Button,
  Divider,
  Tag,
  Checkbox,
  Alert,
  message
} from 'antd';
import type { TournamentStepProps } from '@/common/types/tournament';
import type { TournamentSetting } from '@/common/types/tournament';

const { Option } = Select;
const { TextArea } = Input;

const STREAM_PLATFORMS = [
  'Twitch',
  'YouTube',
  'Facebook Gaming',
  'TikTok Live',
  'Douyu',
  'Nimo TV',
  'Other'
];

const TournamentBasicSettings: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm<TournamentSetting>();
  const [requireStream, setRequireStream] = useState<boolean>(false);
  const [jsonError, setJsonError] = useState<string>('');

  useEffect(() => {
    if (data.settings) {
      const settings = data.settings;
      form.setFieldsValue({
        ...settings,
        // Parse JSON fields if they are strings
        matchFormat: typeof settings.matchFormat === 'string' 
          ? settings.matchFormat 
          : JSON.stringify(settings.matchFormat || {}, null, 2),
        streamPlatforms: settings.streamPlatforms || []
      });
      setRequireStream(settings.requireStream || false);
    }
  }, [data.settings, form]);

  const validateJSON = (value: string) => {
    if (!value || value.trim() === '') return true;
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  };

  const onFinish = (values: any): void => {
    try {
      // Parse matchFormat if it exists
      let parsedMatchFormat = null;
      if (values.matchFormat && values.matchFormat.trim() !== '') {
        parsedMatchFormat = JSON.parse(values.matchFormat);
      }

      const updatedSettings: TournamentSetting = {
        ...data.settings,
        ...values,
        matchFormat: parsedMatchFormat,
        requireStream,
        streamPlatforms: values.streamPlatforms || []
      };

      updateData('settings', updatedSettings);
      message.success('Cài đặt đã được lưu thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu cài đặt!');
      console.error('Error saving settings:', error);
    }
  };

  const handleStreamToggle = (checked: boolean) => {
    setRequireStream(checked);
    form.setFieldValue('requireStream', checked);
  };

  return (
    <div>
      <Alert
        message="Lưu ý quan trọng"
        description="Các cài đặt này sẽ ảnh hưởng đến cách vận hành giải đấu. Hãy đảm bảo cài đặt đúng trước khi bắt đầu."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

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
          requireStream: false,
          streamPlatforms: []
        }}
        onValuesChange={(changedValues) => {
          if ('matchFormat' in changedValues) {
            const isValid = validateJSON(changedValues.matchFormat);
            setJsonError(isValid ? '' : 'Định dạng JSON không hợp lệ');
          }
        }}
      >
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Card 
              title="📝 Cài đặt đăng ký" 
              size="small"
              extra={<Tag color="blue">Bắt buộc</Tag>}
            >
              <Form.Item
                name="allowTeamRegistration"
                label="Cho phép đăng ký đội"
                valuePropName="checked"
                rules={[{ required: true, message: 'Vui lòng chọn tùy chọn!' }]}
                tooltip="Cho phép các đội đăng ký tham gia giải đấu"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <Form.Item
                name="requireApproval"
                label="Yêu cầu phê duyệt đăng ký"
                valuePropName="checked"
                tooltip="Các đội đăng ký cần được phê duyệt trước khi tham gia"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>

              <div style={{ padding: '8px 12px', background: '#f6ffed', borderRadius: 6, marginTop: 16 }}>
                <small style={{ color: '#389e0d' }}>
                  💡 <strong>Gợi ý:</strong> Bật "Yêu cầu phê duyệt" để kiểm soát chất lượng đội tham gia.
                </small>
              </div>
            </Card>
          </Col>

          <Col span={12}>
            <Card 
              title="⚔️ Cài đặt trận đấu" 
              size="small"
              extra={<Tag color="green">Thi đấu</Tag>}
            >
              <Form.Item
                name="allowDraws"
                label="Cho phép kết quả hòa"
                valuePropName="checked"
                tooltip="Cho phép các trận đấu kết thúc với tỷ số hòa"
              >
                <Switch checkedChildren="Cho phép" unCheckedChildren="Không" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="defaultBestOf"
                    label="Thể thức mặc định"
                    tooltip="Số trận thắng cần thiết để chiến thắng loạt đấu"
                    rules={[{ required: true, message: 'Vui lòng chọn thể thức!' }]}
                  >
                    <Select style={{ width: '100%' }}>
                      <Option value={1}>BO1 (1 trận thắng)</Option>
                      <Option value={3}>BO3 (2/3 trận)</Option>
                      <Option value={5}>BO5 (3/5 trận)</Option>
                      <Option value={7}>BO7 (4/7 trận)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="defaultMatchTime"
                    label="Thời gian trận (phút)"
                    tooltip="Thời gian dự kiến cho mỗi trận đấu"
                    rules={[
                      { required: true, message: 'Vui lòng nhập thời gian!' },
                      { type: 'number', min: 5, max: 180, message: 'Thời gian phải từ 5-180 phút' }
                    ]}
                  >
                    <InputNumber 
                      min={5}
                      max={180}
                      style={{ width: '100%' }} 
                      placeholder="VD: 30"
                      addonAfter="phút"
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
                <Switch checkedChildren="Tự động" unCheckedChildren="Thủ công" />
              </Form.Item>
            </Card>
          </Col>

          <Col span={24}>
            <Card 
              title="🔔 Cài đặt thông báo" 
              size="small"
              extra={<Tag color="orange">Thông báo</Tag>}
            >
              <Row gutter={[24, 16]}>
                <Col span={8}>
                  <Form.Item
                    name="notifyMatchStart"
                    label="Thông báo khi trận đấu bắt đầu"
                    valuePropName="checked"
                    tooltip="Gửi thông báo khi trận đấu sắp bắt đầu"
                  >
                    <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="notifyRegistration"
                    label="Thông báo đăng ký"
                    valuePropName="checked"
                    tooltip="Thông báo khi có đội đăng ký mới"
                  >
                    <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="notifyResults"
                    label="Thông báo kết quả"
                    valuePropName="checked"
                    tooltip="Thông báo khi có kết quả trận đấu mới"
                  >
                    <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                  </Form.Item>
                </Col>
              </Row>
              
              <div style={{ 
                marginTop: 16, 
                padding: '12px', 
                background: '#f0f0f0', 
                borderRadius: 6 
              }}>
                <small style={{ color: '#595959' }}>
                  📢 Thông báo sẽ được gửi cho: Quản trị viên, Đội trưởng, Người tham gia giải đấu
                </small>
              </div>
            </Card>
          </Col>

          <Col span={12}>
            <Card 
              title="📡 Cài đặt stream" 
              size="small"
              extra={<Switch checked={requireStream} onChange={handleStreamToggle} />}
            >
              <Form.Item
                name="requireStream"
                label="Yêu cầu stream trận đấu"
                valuePropName="checked"
                hidden
              >
                <Input type="hidden" />
              </Form.Item>

              {requireStream && (
                <Form.Item
                  name="streamPlatforms"
                  label="Nền tảng stream được phép"
                  tooltip="Chọn các nền tảng stream được chấp nhận"
                >
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row gutter={[8, 8]}>
                      {STREAM_PLATFORMS.map(platform => (
                        <Col span={12} key={platform}>
                          <Checkbox value={platform}>{platform}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              )}

              {!requireStream && (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#8c8c8c' }}>
                  <small>Stream trận đấu không bắt buộc</small>
                </div>
              )}
            </Card>
          </Col>

          <Col span={12}>
            <Card 
              title="⚙️ Cài đặt nâng cao" 
              size="small"
              extra={<Tag color="purple">Nâng cao</Tag>}
            >
              <Form.Item
                name="matchFormat"
                label="Định dạng trận đấu tùy chỉnh (JSON)"
                tooltip="Các tùy chỉnh đặc biệt cho định dạng trận đấu"
                validateStatus={jsonError ? 'error' : ''}
                help={jsonError || 'VD: {"rounds": 3, "timePerRound": 300, "overtime": true}'}
              >
                <TextArea 
                  rows={4}
                  placeholder='Nhập định dạng JSON tùy chỉnh...'
                />
              </Form.Item>

              <div style={{ 
                padding: '12px', 
                background: '#fff7e6', 
                borderRadius: 6, 
                marginTop: 8 
              }}>
                <small style={{ color: '#d46b08' }}>
                  ⚠️ <strong>Lưu ý:</strong> Chỉ chỉnh sửa JSON nếu bạn hiểu rõ cấu trúc. 
                  Sai cú pháp có thể gây lỗi hệ thống.
                </small>
              </div>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="📋 Tổng quan cài đặt" size="small">
              <Row gutter={[24, 16]}>
                <Col span={12}>
                  <h4>Các cài đặt quan trọng:</h4>
                  <ul style={{ marginTop: 8, paddingLeft: 20, color: '#595959' }}>
                    <li><small><strong>BO (Best Of):</strong> Số trận thắng cần thiết để thắng loạt đấu</small></li>
                    <li><small><strong>Tự động lên lịch:</strong> Hệ thống tự sắp xếp lịch thi đấu</small></li>
                    <li><small><strong>Phê duyệt đăng ký:</strong> Quản trị viên duyệt từng đội đăng ký</small></li>
                    <li><small><strong>Stream bắt buộc:</strong> Đội tham gia phải stream trận đấu</small></li>
                  </ul>
                </Col>
                <Col span={12}>
                  <h4>Ảnh hưởng đến giải đấu:</h4>
                  <ul style={{ marginTop: 8, paddingLeft: 20, color: '#595959' }}>
                    <li><small>Cài đặt <strong>không thể thay đổi</strong> khi giải đấu đã bắt đầu</small></li>
                    <li><small>Các thay đổi sẽ áp dụng ngay lập tức</small></li>
                    <li><small>Kiểm tra kỹ trước khi lưu cài đặt</small></li>
                  </ul>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Divider />
            <div style={{ 
              textAlign: 'right', 
              padding: '16px', 
              background: '#fafafa', 
              borderRadius: 6 
            }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                style={{ minWidth: 150 }}
              >
                💾 Lưu cài đặt
              </Button>
              <Button 
                style={{ marginLeft: 12 }} 
                size="large"
                onClick={() => form.resetFields()}
              >
                ↺ Đặt lại
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TournamentBasicSettings;
// components/MatchScoreModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Row, Col, Typography, Avatar, Space, Tag } from 'antd';
import type { Match } from '@/common/types';

const { Text } = Typography;

interface MatchScoreModalProps {
  visible: boolean;
  match: Match | null;
  onCancel: () => void;
  onOk: (matchId: string, team1Score: number, team2Score: number) => Promise<void>;
}

const MatchScoreModal: React.FC<MatchScoreModalProps> = ({
  visible,
  match,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match) {
      form.setFieldsValue({
        team1Score: match.team1Score || 0,
        team2Score: match.team2Score || 0,
      });
    }
  }, [match, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onOk(match!.id, values.team1Score, values.team2Score);
      onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!match) return null;

  return (
    <Modal
      title="Cập nhật tỷ số trận đấu"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Cập nhật"
      cancelText="Hủy"
      width={600}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Text strong>Vòng {match.round} • Trận {match.order}</Text>
      </div>

      <Row gutter={24} align="middle" justify="center">
        <Col span={10}>
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="middle">
              {match.team1 ? (
                <>
                  <Avatar
                    size={64}
                    src={match.team1.logoUrl}
                    style={{ margin: '0 auto' }}
                  >
                    {match.team1.name.charAt(0)}
                  </Avatar>
                  <Text strong style={{ fontSize: 16 }}>
                    {match.team1.name}
                  </Text>
                  {match.team1.seed && (
                    <Tag color="gold">Hạt giống #{match.team1.seed}</Tag>
                  )}
                </>
              ) : (
                <Text type="secondary">Chưa có đội</Text>
              )}
            </Space>
          </div>
        </Col>

        <Col span={4} style={{ textAlign: 'center' }}>
          <Text strong style={{ fontSize: 24, color: '#ff4d4f' }}>
            VS
          </Text>
        </Col>

        <Col span={10}>
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="middle">
              {match.team2 ? (
                <>
                  <Avatar
                    size={64}
                    src={match.team2.logoUrl}
                    style={{ margin: '0 auto' }}
                  >
                    {match.team2.name.charAt(0)}
                  </Avatar>
                  <Text strong style={{ fontSize: 16 }}>
                    {match.team2.name}
                  </Text>
                  {match.team2.seed && (
                    <Tag color="gold">Hạt giống #{match.team2.seed}</Tag>
                  )}
                </>
              ) : (
                <Text type="secondary">Chưa có đội</Text>
              )}
            </Space>
          </div>
        </Col>
      </Row>

      <Form form={form} layout="vertical" style={{ marginTop: 32 }}>
        <Row gutter={24}>
          <Col span={10}>
            <Form.Item
              name="team1Score"
              label="Tỷ số đội 1"
              rules={[{ required: true, message: 'Vui lòng nhập tỷ số' }]}
            >
              <InputNumber
                min={0}
                max={999}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={4} style={{ textAlign: 'center', marginTop: 40 }}>
            <Text type="secondary">:</Text>
          </Col>
          <Col span={10}>
            <Form.Item
              name="team2Score"
              label="Tỷ số đội 2"
              rules={[{ required: true, message: 'Vui lòng nhập tỷ số' }]}
            >
              <InputNumber
                min={0}
                max={999}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default MatchScoreModal;
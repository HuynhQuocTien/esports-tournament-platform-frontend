// src/pages/tournaments/TournamentStages.tsx
import React, { useState } from 'react';
import {
  Form,
  Select,
  Input,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Modal,
  message,
} from 'antd';
import type { TableColumnsType } from 'antd/es/';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { TournamentStepProps, TournamentStage } from '../../../common/types/tournament';

const { Option } = Select;
const { TextArea } = Input;

interface StageType {
  value: string;
  label: string;
}

const TournamentStages: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingStage, setEditingStage] = useState<(TournamentStage & { index: number }) | null>(null);

  const stages = data.stages || [];

  const stageTypes: StageType[] = [
    { value: 'qualifier', label: 'Vòng loại' },
    { value: 'group', label: 'Vòng bảng' },
    { value: 'bracket', label: 'Vòng loại trực tiếp' },
    { value: 'swiss', label: 'Thụy Sĩ' },
    { value: 'final', label: 'Chung kết' }
  ];

  const columns: TableColumnsType<TournamentStage & { key: number }> = [
    {
      title: 'Tên vòng đấu',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thể thức',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = stageTypes.find(t => t.value === type);
        return <Tag color="blue">{typeConfig?.label || type}</Tag>;
      }
    },
    {
      title: 'Thứ tự',
      dataIndex: 'stageOrder',
      key: 'stageOrder',
    },
    {
      title: 'Số bảng',
      dataIndex: 'numberOfGroups',
      key: 'numberOfGroups',
      render: (value: number) => value || '-'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record, index) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(index)}
          >
            Sửa
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(index)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = (): void => {
    setEditingStage(null);
    setModalVisible(true);
  };

  const handleEdit = (index: number): void => {
    setEditingStage({ ...stages[index], index });
    setModalVisible(true);
  };

  const handleDelete = (index: number): void => {
    const newStages = stages.filter((_, i) => i !== index);
    updateData({stages: newStages});
    message.success('Đã xóa vòng đấu');
  };

  const handleModalOk = (): void => {
    form.validateFields().then(values => {
      const newStage: TournamentStage = {
        ...values,
        id: editingStage?.id || `stage-${Date.now()}`
      };

      let newStages: TournamentStage[];
      if (editingStage) {
        newStages = stages.map((stage, index) => 
          index === editingStage.index ? newStage : stage
        );
      } else {
        newStages = [...stages, newStage];
      }

      updateData({stages: newStages});
      setModalVisible(false);
      form.resetFields();
      message.success(editingStage ? 'Cập nhật thành công' : 'Thêm vòng đấu thành công');
    });
  };

  const handleModalCancel = (): void => {
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Card
        title="Quản lý Vòng Đấu"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm vòng đấu
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={stages.map((stage, index) => ({ ...stage, key: index }))}
          pagination={false}
          locale={{ emptyText: 'Chưa có vòng đấu nào' }}
        />
      </Card>

      <Modal
        title={editingStage ? 'Chỉnh sửa vòng đấu' : 'Thêm vòng đấu mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingStage || {}}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên vòng đấu"
                rules={[{ required: true, message: 'Vui lòng nhập tên vòng đấu' }]}
              >
                <Input placeholder="VD: Vòng bảng, Playoffs, Chung kết..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stageOrder"
                label="Thứ tự"
                rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
              >
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="type"
            label="Thể thức"
            rules={[{ required: true, message: 'Vui lòng chọn thể thức' }]}
          >
            <Select placeholder="Chọn thể thức vòng đấu">
              {stageTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="numberOfGroups"
                label="Số bảng"
              >
                <InputNumber min={1} max={16} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="teamsPerGroup"
                label="Số đội mỗi bảng"
              >
                <InputNumber min={2} max={16} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="format"
            label="Cấu hình format"
          >
            <TextArea 
              rows={3} 
              placeholder='VD: {"bestOf": 3, "pointsPerWin": 3, "pointsPerDraw": 1}'
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TournamentStages;
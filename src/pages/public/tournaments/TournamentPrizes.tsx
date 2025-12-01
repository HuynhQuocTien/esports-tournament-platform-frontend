import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Table,
  Space,
  Modal,
  message,
  Tag,
} from 'antd';
import type { TableColumnsType } from 'antd/es/';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { TournamentStepProps, TournamentPrize } from '../../../common/types/tournament';

const { Option } = Select;
const { TextArea } = Input;

interface PrizeType {
  value: string;
  label: string;
  color: string;
}

const TournamentPrizes: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingPrize, setEditingPrize] = useState<(TournamentPrize & { index: number }) | null>(null);

  const prizes = data.prizes || [];

  const prizeTypes: PrizeType[] = [
    { value: 'cash', label: 'Tiền mặt', color: 'green' },
    { value: 'product', label: 'Sản phẩm', color: 'blue' },
    { value: 'service', label: 'Dịch vụ', color: 'orange' },
    { value: 'other', label: 'Khác', color: 'gray' }
  ];

  const columns: TableColumnsType<TournamentPrize & { key: number }> = [
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      render: (position: number) => `Hạng ${position}`
    },
    {
      title: 'Loại giải',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = prizeTypes.find(t => t.value === type);
        return <Tag color={typeConfig?.color}>{typeConfig?.label}</Tag>;
      }
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Giá trị',
      dataIndex: 'cashValue',
      key: 'cashValue',
      render: (value: number) => value ? `₫${value.toLocaleString()}` : '-'
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
    setEditingPrize(null);
    setModalVisible(true);
  };

  const handleEdit = (index: number): void => {
    setEditingPrize({ ...prizes[index], index });
    setModalVisible(true);
  };

  const handleDelete = (index: number): void => {
    const newPrizes = prizes.filter((_, i) => i !== index);
    updateData('prizes', newPrizes);
    message.success('Đã xóa giải thưởng');
  };

  const handleModalOk = (): void => {
    form.validateFields().then(values => {
      const newPrize: TournamentPrize = {
        ...values,
        id: editingPrize?.id || `prize-${Date.now()}`
      };

      let newPrizes: TournamentPrize[];
      if (editingPrize) {
        newPrizes = prizes.map((prize, index) => 
          index === editingPrize.index ? newPrize : prize
        );
      } else {
        newPrizes = [...prizes, newPrize];
      }

      updateData('prizes', newPrizes);
      setModalVisible(false);
      form.resetFields();
      message.success(editingPrize ? 'Cập nhật thành công' : 'Thêm giải thưởng thành công');
    });
  };

  return (
    <div>
      <Card
        title="Quản lý Giải Thưởng"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm giải thưởng
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={prizes.map((prize, index) => ({ ...prize, key: index }))}
          pagination={false}
          locale={{ emptyText: 'Chưa có giải thưởng nào' }}
        />
      </Card>

      <Modal
        title={editingPrize ? 'Chỉnh sửa giải thưởng' : 'Thêm giải thưởng mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingPrize || {}}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="position"
                label="Vị trí"
                rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
              >
                <InputNumber 
                  min={1} 
                  max={100} 
                  style={{ width: '100%' }}
                  placeholder="VD: 1, 2, 3..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại giải thưởng"
                rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
              >
                <Select placeholder="Chọn loại giải thưởng">
                  {prizeTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả giải thưởng"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input placeholder="VD: Quán quân, Á quân, Giải ba..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cashValue"
                label="Giá trị (VND)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                //   parser={value => value?.toString().replace(/₫\s?|(,*)/g, '') || '0'}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Số lượng"
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="sponsor"
            label="Nhà tài trợ"
          >
            <Input placeholder="Tên nhà tài trợ (nếu có)" />
          </Form.Item>

          <Form.Item
            name="prizeDetails"
            label="Chi tiết bổ sung"
          >
            <TextArea 
              rows={3} 
              placeholder='VD: {"product": "Gaming Mouse", "brand": "Razer"}'
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TournamentPrizes;
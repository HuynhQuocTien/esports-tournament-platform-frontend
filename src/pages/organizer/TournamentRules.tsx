import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Table,
  Space,
  Modal,
  message,
  Switch,
} from 'antd';
import type { TableColumnsType } from 'antd/es/';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { TournamentStepProps, TournamentRule } from '../../../common/types/tournament';

const { TextArea } = Input;
const { confirm } = Modal;

const TournamentRules: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<(TournamentRule & { index: number }) | null>(null);

  const rules = data.rules || [];

  const columns: TableColumnsType<TournamentRule & { key: number }> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '25%'
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <div style={{ 
          maxHeight: '100px', 
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {content}
        </div>
      )
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      key: 'order',
      width: '80px'
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'isRequired',
      key: 'isRequired',
      width: '100px',
      render: (isRequired: boolean) => isRequired ? 'Có' : 'Không'
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '120px',
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
    setEditingRule(null);
    setModalVisible(true);
  };

  const handleEdit = (index: number): void => {
    setEditingRule({ ...rules[index], index });
    setModalVisible(true);
  };

  const handleDelete = (index: number): void => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa quy định này?',
      onOk() {
        const newRules = rules.filter((_, i) => i !== index);
        updateData('rules', newRules);
        message.success('Đã xóa quy định');
      }
    });
  };

  const handleModalOk = (): void => {
    form.validateFields().then(values => {
      const newRule: TournamentRule = {
        ...values,
        id: editingRule?.id || `rule-${Date.now()}`
      };

      let newRules: TournamentRule[];
      if (editingRule) {
        newRules = rules.map((rule, index) => 
          index === editingRule.index ? newRule : rule
        );
      } else {
        newRules = [...rules, newRule];
      }

      newRules.sort((a, b) => a.order - b.order);

      updateData('rules', newRules);
      setModalVisible(false);
      form.resetFields();
      message.success(editingRule ? 'Cập nhật thành công' : 'Thêm quy định thành công');
    });
  };

  return (
    <div>
      <Card
        title="Quy Định Giải Đấu"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm quy định
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={rules.map((rule, index) => ({ ...rule, key: index }))}
          pagination={false}
          locale={{ emptyText: 'Chưa có quy định nào' }}
        />
      </Card>

      <Modal
        title={editingRule ? 'Chỉnh sửa quy định' : 'Thêm quy định mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingRule || { order: 1, isRequired: true }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề quy định"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="VD: Thể lệ tham gia, Quy định về độ tuổi..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Nhập nội dung quy định chi tiết..."
            />
          </Form.Item>

          <Form.Item
            name="order"
            label="Thứ tự hiển thị"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
          >
            <Input type="number" min={1} max={100} />
          </Form.Item>

          <Form.Item
            name="isRequired"
            label="Bắt buộc"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TournamentRules;
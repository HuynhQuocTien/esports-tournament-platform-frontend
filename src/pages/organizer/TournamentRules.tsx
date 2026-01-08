import React, { useState, useEffect } from 'react';
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
  Spin,
} from 'antd';
import type { TableColumnsType } from 'antd/es/';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { TournamentRule, TournamentStepProps } from '@/common/types';
import { tournamentService } from '@/services/tournamentService';

const { TextArea } = Input;
const { confirm } = Modal;

interface TournamentRuleWithKey extends TournamentRule {
  key: string;
}

const TournamentRules: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<TournamentRule | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (data?.basicInfo?.id) {
      loadRules();
    }
  }, [data?.basicInfo?.id]);

  const loadRules = async () => {
    if (!data?.basicInfo?.id) return;
    
    try {
      setLoading(true);
      const response = await tournamentService.getTournamentRules(data.basicInfo.id);
      console.log('Loaded rules:', response.data);
      const rules = response.data.data || [];
      
      // Update local state with API data
      updateData('rules', rules);
    } catch (error: any) {
      console.error('Error loading rules:', error);
      message.error(error.response?.data?.message || 'Không thể tải danh sách quy định');
    } finally {
      setLoading(false);
    }
  };

  const rules = data.rules || [];

  const columns: TableColumnsType<TournamentRuleWithKey> = [
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
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={!!deleting}
          >
            Sửa
          </Button>
          <Button 
            type="link" 
            danger 
            icon={deleting === record.id ? <Spin size="small" /> : <DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.title)}
            disabled={!!deleting}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = (): void => {
    setEditingRule(null);
    form.resetFields();
    form.setFieldsValue({
      order: (rules.length > 0 ? Math.max(...rules.map(r => r.order || 0)) : 0) + 1,
      isRequired: true,
    });
    setModalVisible(true);
  };

  const handleEdit = (rule: TournamentRule): void => {
    setEditingRule(rule);
    form.setFieldsValue({
      title: rule.title,
      content: rule.content,
      order: rule.order,
      isRequired: rule.isRequired,
    });
    setModalVisible(true);
  };

  const handleDelete = (ruleId: string, ruleTitle: string): void => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa quy định "${ruleTitle}"?`,
      onOk: async () => {
        if (!data?.basicInfo?.id) return;
        
        try {
          setDeleting(ruleId);
          await tournamentService.deleteTournamentRule(data.basicInfo.id, ruleId);
          
          // Refresh rules from API
          await loadRules();
          message.success('Đã xóa quy định');
        } catch (error: any) {
          console.error('Error deleting rule:', error);
          message.error(error.response?.data?.message || 'Không thể xóa quy định');
        } finally {
          setDeleting(null);
        }
      }
    });
  };

  const handleModalOk = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      
      if (!data?.basicInfo?.id) {
        message.error('Không tìm thấy ID giải đấu');
        return;
      }

      setSaving(true);
      
      const ruleData = {
        title: values.title,
        content: values.content,
        order: values.order,
        isRequired: values.isRequired,
      };

      if (editingRule?.id) {
        // Update existing rule
        await tournamentService.updateTournamentRule(
          data.basicInfo.id, 
          editingRule.id, 
          ruleData
        );
        message.success('Cập nhật quy định thành công');
      } else {
        // Create new rule
        await tournamentService.createTournamentRule(
          data.basicInfo.id, 
          ruleData
        );
        message.success('Thêm quy định thành công');
      }

      // Refresh rules from API
      await loadRules();
      
      setModalVisible(false);
      form.resetFields();
      setEditingRule(null);
    } catch (error: any) {
      console.error('Error saving rule:', error);
      
      if (error.errorFields) {
        // Form validation errors
        message.error('Vui lòng kiểm tra lại thông tin nhập');
      } else {
        // API errors
        message.error(error.response?.data?.message || 'Không thể lưu quy định');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleModalCancel = (): void => {
    setModalVisible(false);
    form.resetFields();
    setEditingRule(null);
  };

  return (
    <div>
      <Card
        title="Quy Định Giải Đấu"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
            disabled={loading}
          >
            Thêm quy định
          </Button>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin tip="Đang tải danh sách quy định..." />
          </div>
        ) : (
          <Table 
            columns={columns} 
            dataSource={rules.map(rule => ({ 
              ...rule, 
              key: rule.id || `rule-${Date.now()}` 
            }))}
            pagination={false}
            locale={{ emptyText: 'Chưa có quy định nào' }}
          />
        )}
      </Card>

      <Modal
        title={editingRule ? 'Chỉnh sửa quy định' : 'Thêm quy định mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        confirmLoading={saving}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            order: 1,
            isRequired: true,
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề quy định"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề' },
              { max: 200, message: 'Tiêu đề không được quá 200 ký tự' }
            ]}
          >
            <Input 
              placeholder="VD: Thể lệ tham gia, Quy định về độ tuổi..." 
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung chi tiết"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung' },
              { max: 2000, message: 'Nội dung không được quá 2000 ký tự' }
            ]}
          >
            <TextArea 
              rows={6} 
              placeholder="Nhập nội dung quy định chi tiết..."
              maxLength={2000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="order"
            label="Thứ tự hiển thị"
            rules={[
              { required: true, message: 'Vui lòng nhập thứ tự' },
              { type: 'number', min: 1, message: 'Thứ tự phải lớn hơn 0' },
              { type: 'number', max: 100, message: 'Thứ tự không được quá 100' }
            ]}
          >
            <Input type="number" min={1} max={100} />
          </Form.Item>

          <Form.Item
            name="isRequired"
            label="Bắt buộc"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bắt buộc" unCheckedChildren="Không bắt buộc" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TournamentRules;
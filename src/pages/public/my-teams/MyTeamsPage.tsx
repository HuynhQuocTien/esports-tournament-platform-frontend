import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Typography, Space, Tag, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Team {
  id: string;
  name: string;
  game: string;
  members: number;
  maxMembers: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

export const MyTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Team Phoenix',
      game: 'Valorant',
      members: 5,
      maxMembers: 6,
      status: 'active',
      joinDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Team Alpha',
      game: 'League of Legends',
      members: 4,
      maxMembers: 5,
      status: 'active',
      joinDate: '2024-01-10',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newTeam: Team = {
        id: Date.now().toString(),
        ...values,
        members: 1,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
      };
      setTeams([...teams, newTeam]);
      setIsModalOpen(false);
      message.success('Tạo đội thành công!');
      form.resetFields();
    });
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    form.setFieldsValue(team);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      setTeams(teams.map(team => 
        team.id === editingTeam?.id ? { ...team, ...values } : team
      ));
      setIsModalOpen(false);
      setEditingTeam(null);
      message.success('Cập nhật đội thành công!');
      form.resetFields();
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đội này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        setTeams(teams.filter(team => team.id !== id));
        message.success('Xóa đội thành công!');
      },
    });
  };

  const columns = [
    {
      title: 'Tên đội',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Team) => (
        <Space>
          <TeamOutlined />
          <Text strong>{name}</Text>
          <Tag>{record.game}</Tag>
        </Space>
      ),
    },
    {
      title: 'Thành viên',
      dataIndex: 'members',
      key: 'members',
      render: (members: number, record: Team) => (
        <Text>
          {members}/{record.maxMembers} <UserOutlined />
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_ : any, record: Team) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Đội của tôi
          </Title>
          <Text type="secondary">Quản lý các đội bạn đã tạo hoặc tham gia</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => {
            setEditingTeam(null);
            setIsModalOpen(true);
            form.resetFields();
          }}
        >
          Tạo đội mới
        </Button>
      </div>

      <Card
        style={{
          borderRadius: 12,
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table
          dataSource={teams}
          columns={columns}
          rowKey="id"
        />
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TeamOutlined />
            {editingTeam ? 'Chỉnh sửa đội' : 'Tạo đội mới'}
          </div>
        }
        open={isModalOpen}
        onOk={editingTeam ? handleUpdate : handleAdd}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTeam(null);
          form.resetFields();
        }}
        okText={editingTeam ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item 
            name="name" 
            label="Tên đội" 
            rules={[{ required: true, message: 'Vui lòng nhập tên đội!' }]}
          >
            <Input placeholder="Nhập tên đội" />
          </Form.Item>
          <Form.Item 
            name="game" 
            label="Game" 
            rules={[{ required: true, message: 'Vui lòng chọn game!' }]}
          >
            <Input placeholder="Nhập tên game" />
          </Form.Item>
          <Form.Item 
            name="maxMembers" 
            label="Số thành viên tối đa" 
            rules={[{ required: true, message: 'Vui lòng nhập số thành viên tối đa!' }]}
          >
            <Input type="number" placeholder="Nhập số thành viên tối đa" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
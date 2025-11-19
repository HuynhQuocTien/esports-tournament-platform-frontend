import React, { useState } from "react";
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Card, 
  Typography, 
  Space, 
  Tag,
  Avatar,
  Tooltip,
  InputNumber
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface Team {
  id: string;
  name: string;
  members: number;
  captain: string;
  status: 'active' | 'inactive';
  joinDate: string;
  avatar: string;
}

export const AdminTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    { 
      id: "1", 
      name: "Team Phoenix", 
      members: 5, 
      captain: "Nguyễn Văn A",
      status: 'active',
      joinDate: "2024-01-15",
      avatar: "https://picsum.photos/seed/team1/60/60"
    },
    { 
      id: "2", 
      name: "Team Alpha", 
      members: 6, 
      captain: "Trần Văn B",
      status: 'active',
      joinDate: "2024-01-10",
      avatar: "https://picsum.photos/seed/team2/60/60"
    },
    { 
      id: "3", 
      name: "Team Storm", 
      members: 4, 
      captain: "Lê Văn C",
      status: 'inactive',
      joinDate: "2024-01-08",
      avatar: "https://picsum.photos/seed/team3/60/60"
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
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://picsum.photos/seed/team${Date.now()}/60/60`
      };
      setTeams([...teams, newTeam]);
      setIsModalOpen(false);
      message.success("Thêm đội thành công!");
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
      message.success("Cập nhật đội thành công!");
      form.resetFields();
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa đội này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        setTeams(teams.filter(team => team.id !== id));
        message.success("Xóa đội thành công!");
      },
    });
  };

  const columns = [
    {
      title: "Đội",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Team) => (
        <Space>
          <Avatar src={record.avatar} size="large" />
          <div>
            <Text strong style={{ fontSize: 14, display: 'block' }}>{name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Đội trưởng: {record.captain}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Thành viên",
      dataIndex: "members",
      key: "members",
      render: (members: number) => (
        <Tag 
          icon={<UserOutlined />} 
          color="blue"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          {members} thành viên
        </Tag>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (date: string) => (
        <Text style={{ fontSize: 12 }}>{date}</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag 
          color={status === 'active' ? 'green' : 'red'}
          style={{ fontWeight: 600 }}
        >
          {status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Team) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ 
            margin: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            🏃 Quản lý đội tham gia
          </Title>
          <Text type="secondary">Quản lý thông tin các đội tham gia giải đấu</Text>
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
          Thêm đội mới
        </Button>
      </div>

      <Card
        style={{
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "white",
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
            {editingTeam ? "Chỉnh sửa đội" : "Thêm đội mới"}
          </div>
        }
        open={isModalOpen}
        onOk={editingTeam ? handleUpdate : handleAdd}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTeam(null);
          form.resetFields();
        }}
        okText={editingTeam ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item 
            name="name" 
            label="Tên đội" 
            rules={[{ required: true, message: 'Vui lòng nhập tên đội!' }]}
          >
            <Input placeholder="Nhập tên đội" size="large" />
          </Form.Item>
          <Form.Item 
            name="captain" 
            label="Đội trưởng" 
            rules={[{ required: true, message: 'Vui lòng nhập tên đội trưởng!' }]}
          >
            <Input placeholder="Nhập tên đội trưởng" size="large" />
          </Form.Item>
          <Form.Item 
            name="members" 
            label="Số thành viên" 
            rules={[{ required: true, message: 'Vui lòng nhập số thành viên!' }]}
          >
            <InputNumber 
              placeholder="Nhập số thành viên" 
              style={{ width: '100%' }} 
              min={1}
              max={10}
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
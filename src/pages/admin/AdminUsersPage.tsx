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
  Tooltip,
  Select,
  Avatar,
  Switch
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UserOutlined,
  MailOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive';
  joinDate: string;
  avatar: string;
}

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { 
      id: "1", 
      username: "admin", 
      email: "admin@esports.vn",
      role: 'admin',
      status: 'active',
      joinDate: "2024-01-01",
      avatar: "https://picsum.photos/seed/admin/60/60"
    },
    { 
      id: "2", 
      username: "moderator01", 
      email: "mod@esports.vn",
      role: 'moderator',
      status: 'active',
      joinDate: "2024-01-05",
      avatar: "https://picsum.photos/seed/moderator/60/60"
    },
    { 
      id: "3", 
      username: "player01", 
      email: "player@esports.vn",
      role: 'user',
      status: 'inactive',
      joinDate: "2024-01-10",
      avatar: "https://picsum.photos/seed/player/60/60"
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newUser: User = {
        id: Date.now().toString(),
        ...values,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://picsum.photos/seed/user${Date.now()}/60/60`
      };
      setUsers([...users, newUser]);
      setIsModalOpen(false);
      message.success("Thêm người dùng thành công!");
      form.resetFields();
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      setUsers(users.map(user => 
        user.id === editingUser?.id ? { ...user, ...values } : user
      ));
      setIsModalOpen(false);
      setEditingUser(null);
      message.success("Cập nhật người dùng thành công!");
      form.resetFields();
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        setUsers(users.filter(user => user.id !== id));
        message.success("Xóa người dùng thành công!");
      },
    });
  };

  const handleStatusChange = (checked: boolean, userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: checked ? 'active' : 'inactive' } : user
    ));
    message.success(`Đã ${checked ? 'kích hoạt' : 'vô hiệu hóa'} người dùng!`);
  };

  const getRoleTag = (role: string) => {
    const config = {
      admin: { color: 'red', text: 'Quản trị viên' },
      moderator: { color: 'orange', text: 'Điều hành viên' },
      user: { color: 'blue', text: 'Người dùng' }
    };
    const roleConfig = config[role as keyof typeof config];
    return <Tag color={roleConfig.color}>{roleConfig.text}</Tag>;
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "username",
      key: "username",
      render: (username: string, record: User) => (
        <Space>
          <Avatar src={record.avatar} size="large" />
          <div>
            <Text strong style={{ fontSize: 14, display: 'block' }}>{username}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <MailOutlined /> {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => getRoleTag(role),
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
      render: (status: string, record: User) => (
        <Switch 
          checked={status === 'active'}
          onChange={(checked) => handleStatusChange(checked, record.id)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Khóa"
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_ : any, record: User) => (
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
            👥 Quản lý người dùng
          </Title>
          <Text type="secondary">Quản lý tài khoản và phân quyền người dùng hệ thống</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
            form.resetFields();
          }}
        >
          Thêm người dùng
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
          dataSource={users}
          columns={columns}
          rowKey="id"
        />
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined />
            {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </div>
        }
        open={isModalOpen}
        onOk={editingUser ? handleUpdate : handleAdd}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
        okText={editingUser ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item 
            name="username" 
            label="Tên đăng nhập" 
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input placeholder="Nhập tên đăng nhập" size="large" />
          </Form.Item>
          <Form.Item 
            name="email" 
            label="Email" 
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" size="large" />
          </Form.Item>
          <Form.Item 
            name="role" 
            label="Vai trò" 
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            initialValue="user"
          >
            <Select placeholder="Chọn vai trò" size="large">
              <Option value="user">Người dùng</Option>
              <Option value="moderator">Điều hành viên</Option>
              <Option value="admin">Quản trị viên</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="status" 
            label="Trạng thái"
            initialValue="active"
          >
            <Select size="large">
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Khóa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
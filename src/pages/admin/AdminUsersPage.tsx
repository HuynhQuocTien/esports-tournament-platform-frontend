import React, { useState, useEffect, useCallback } from "react";
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
  Switch,
  Row,
  Col,
  Input as AntdInput,
  Popconfirm,
  Spin,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { userService } from "../../services/userService";
import dayjs from "dayjs";
import type { User, UserCreateData } from "@/common/types/user";

const { Title, Text } = Typography;
const { Option } = Select;

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await userService.getUsers(page, 10, search);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      message.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(1, searchText);
  }, [fetchUsers, searchText]);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const userData: UserCreateData = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone,
        avatarUrl: values.avatarUrl,
      };
      
      await userService.createUser(userData);
      message.success("User created successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers(pagination.page, searchText);
    } catch (error) {
      message.error("Failed to create user");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.fullname,
      email: user.email,
      role: user.role.name,
      phone: user.phone,
      avatarUrl: user.avatar,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (!editingUser) return;
      
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone,
        avatarUrl: values.avatarUrl,
      };
      
      await userService.updateUser(editingUser.id, userData);
      message.success("User updated successfully!");
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers(pagination.page, searchText);
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      message.success("User deleted successfully!");
      fetchUsers(pagination.page, searchText);
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleStatusChange = async (checked: boolean, userId: string) => {
    try {
      if (checked) {
        await userService.activateUser(userId);
        message.success("User activated successfully!");
      } else {
        await userService.deactivateUser(userId);
        message.success("User deactivated successfully!");
      }
      fetchUsers(pagination.page, searchText);
    } catch (error) {
      message.error("Failed to update user status");
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchUsers(1, value);
  };

  const handleRefresh = () => {
    fetchUsers(pagination.page, searchText);
  };

  const handleTableChange = (pagination: any) => {
    fetchUsers(pagination.current, searchText);
  };

  const getRoleTag = (role: string) => {
    const config = {
      ADMIN: { color: "red", text: "Admin" },
      ORGANIZER: { color: "orange", text: "Organizer" },
      TEAM_MANAGER: { color: "blue", text: "Team Manager" },
    };
    const roleConfig = config[role as keyof typeof config] || { color: "default", text: role };
    return <Tag color={roleConfig.color}>{roleConfig.text}</Tag>;
  };

  const columns = [
    {
      title: "User",
      dataIndex: "fullname",
      key: "fullname",
      render: (fullname: string, record: User) => (
        <Space>
          <Badge 
            dot 
            status={record.isActive ? "success" : "error"}
            offset={[-5, 40]}
          >
            <Avatar 
              src={record.avatar || `https://ui-avatars.com/api/?name=${fullname}&background=random`}
              size="large"
              icon={!record.avatar && <UserOutlined />}
            />
          </Badge>
          <div>
            <Text strong style={{ fontSize: 14, display: "block" }}>
              {fullname}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <MailOutlined /> {record.email}
            </Text>
            {record.phone && (
              <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                <PhoneOutlined /> {record.phone}
              </Text>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: ["role", "name"],
      key: "role",
      render: (role: string) => getRoleTag(role),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: User) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleStatusChange(checked, record.id)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Text style={{ fontSize: 12 }}>
          {dayjs(date).format("DD/MM/YYYY HH:mm")}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this user?"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title
            level={2}
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            👥 User Management
          </Title>
          <Text type="secondary">
            Manage user accounts and system permissions
          </Text>
        </Col>
        <Col>
          <Space>
            <AntdInput
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => handleSearch(searchText)}
              style={{ width: 250 }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingUser(null);
                setIsModalOpen(true);
                form.resetFields();
              }}
            >
              Add User
            </Button>
          </Space>
        </Col>
      </Row>

      <Card
        style={{
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        <Spin spinning={loading}>
          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} users`,
            }}
            onChange={handleTableChange}
          />
        </Spin>
      </Card>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UserOutlined />
            {editingUser ? "Edit User" : "Add New User"}
          </div>
        }
        open={isModalOpen}
        onOk={editingUser ? handleUpdate : handleAdd}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
        okText={editingUser ? "Update" : "Create"}
        cancelText="Cancel"
        width={500}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: !editingUser, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select placeholder="Select role">
              <Option value="ADMIN">Admin</Option>
              <Option value="ORGANIZER">Organizer</Option>
              <Option value="TEAM_MANAGER">Team Manager</Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="avatarUrl" label="Avatar URL">
            <Input placeholder="Enter avatar URL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
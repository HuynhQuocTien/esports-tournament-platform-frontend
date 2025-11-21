import React from "react";
import {
  Table,
  Button,
  Switch,
  Card,
  Typography,
  Tag,
  Space,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export const AdminPermissionsPage: React.FC = () => {
  const permissions = [
    {
      id: 1,
      name: "Quản lý giải đấu",
      description: "Tạo, sửa, xóa và quản lý các giải đấu",
      enabled: true,
      users: 3,
    },
    {
      id: 2,
      name: "Quản lý người dùng",
      description: "Thêm, sửa, xóa và phân quyền người dùng",
      enabled: false,
      users: 1,
    },
    {
      id: 3,
      name: "Quản lý đội tham gia",
      description: "Quản lý các đội và thành viên",
      enabled: true,
      users: 2,
    },
    {
      id: 4,
      name: "Xem báo cáo",
      description: "Truy cập và xuất báo cáo hệ thống",
      enabled: true,
      users: 5,
    },
  ];

  const columns = [
    {
      title: "Tên quyền",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: any) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>
            {name}
          </Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled: boolean) => (
        <Switch
          checked={enabled}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
          style={{ background: enabled ? "#52c41a" : "#d9d9d9" }}
        />
      ),
    },
    {
      title: "Người dùng",
      dataIndex: "users",
      key: "users",
      render: (users: number) => <Tag color="blue">{users} người dùng</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🔐 Quản lý phân quyền
          </Title>
          <Text type="secondary">
            Quản lý và phân quyền truy cập cho người dùng hệ thống
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Thêm quyền mới
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
          dataSource={permissions}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

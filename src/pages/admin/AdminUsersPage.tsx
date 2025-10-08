import { Table, Button } from "antd";

export const AdminUsersPage: React.FC = () => {
  const users = [
    { id: 1, username: "admin", role: "Administrator" },
    { id: 2, username: "player01", role: "User" },
  ];

  return (
    <div>
      <h2>👤 Quản lý người dùng</h2>
      <Button type="primary" style={{ marginBottom: 16 }}>
        Thêm người dùng
      </Button>
      <Table
        dataSource={users}
        rowKey="id"
        columns={[
          { title: "Tên đăng nhập", dataIndex: "username" },
          { title: "Vai trò", dataIndex: "role" },
          {
            title: "Hành động",
            render: () => (
              <>
                <Button type="link">Sửa</Button>
                <Button type="link" danger>
                  Xóa
                </Button>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};
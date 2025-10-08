import { Table, Button, Switch } from "antd";

export const AdminPermissionsPage: React.FC = () => {
  const permissions = [
    { id: 1, name: "Quản lý giải đấu", enabled: true },
    { id: 2, name: "Quản lý người dùng", enabled: false },
  ];

  return (
    <div>
      <h2>🔐 Quản lý phân quyền</h2>
      <Table
        dataSource={permissions}
        rowKey="id"
        columns={[
          { title: "Tên quyền", dataIndex: "name" },
          {
            title: "Kích hoạt",
            dataIndex: "enabled",
            render: (val) => <Switch defaultChecked={val} />,
          },
          {
            title: "Hành động",
            render: () => (
              <Button type="link" danger>
                Xóa
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};
import React from "react";
import { Layout, Button } from "antd";

const { Header } = Layout;

const AdminHeader: React.FC = () => {
  return (
    <Header
      style={{
        background: "#001529",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      <h2 style={{ color: "#fff", margin: 0 }}>Bảng điều khiển quản trị</h2>
      <Button type="primary" danger>
        Đăng xuất
      </Button>
    </Header>
  );
};

export default AdminHeader;

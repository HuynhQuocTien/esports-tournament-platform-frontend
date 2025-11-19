import React from "react";
import { Layout} from "antd";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const { Content, Sider } = Layout;

const AdminLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Sider 
        width={260} 
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <AdminSidebar />
      </Sider>

      <Layout>
        <AdminHeader />
        <Content
          style={{
            margin: "24px",
            padding: 0,
            minHeight: 280,
            background: "transparent",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
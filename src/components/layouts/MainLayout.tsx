import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <div style={{ position: "relative", zIndex: 0 }}>
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <HeaderBar />

        <Content>
          <Outlet />
        </Content>

        <Footer />
      </Layout>
    </div>
  );
};

export default MainLayout;

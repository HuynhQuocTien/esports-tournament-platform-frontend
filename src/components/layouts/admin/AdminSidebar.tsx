import React from "react";
import { Menu, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  TeamOutlined,
  TrophyOutlined,
  CrownOutlined,
  UserOutlined,
  KeyOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { 
      key: "/admin", 
      icon: <DashboardOutlined style={{ fontSize: 16 }} />, 
      label: "Tổng quan" 
    },
    { 
      key: "/admin/tournaments", 
      icon: <TrophyOutlined style={{ fontSize: 16 }} />, 
      label: "Quản lý giải đấu" 
    },
    { 
      key: "/admin/teams", 
      icon: <TeamOutlined style={{ fontSize: 16 }} />, 
      label: "Quản lý đội" 
    },
    { 
      key: "/admin/ranking", 
      icon: <CrownOutlined style={{ fontSize: 16 }} />, 
      label: "Bảng xếp hạng" 
    },
    { 
      key: "/admin/users", 
      icon: <UserOutlined style={{ fontSize: 16 }} />, 
      label: "Quản lý người dùng" 
    },
    { 
      key: "/admin/permissions", 
      icon: <KeyOutlined style={{ fontSize: 16 }} />, 
      label: "Phân quyền hệ thống" 
    },
    { 
      key: "/admin/analytics", 
      icon: <BarChartOutlined style={{ fontSize: 16 }} />, 
      label: "Thống kê & Báo cáo" 
    },
    { 
      key: "/admin/settings", 
      icon: <SettingOutlined style={{ fontSize: 16 }} />, 
      label: "Cài đặt hệ thống" 
    },
  ];

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Sidebar Header */}
      <div style={{ padding: "0 24px 20px 24px", textAlign: "center" }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          marginBottom: 12 
        }}>
          <img
            src="/logo-removebg.png"
            alt="ESports Arena Logo"
            style={{
              width: 36,
              height: 36,
              objectFit: "contain",
              filter: "drop-shadow(0 2px 8px rgba(114, 46, 209, 0.3))",
            }}
          />
        </div>
        <Text style={{ 
          color: "#ffffff", 
          fontSize: 16, 
          fontWeight: 600,
          background: "linear-gradient(135deg, #ffffff 0%, #a8a8a8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          ESports Arena
        </Text>
        <div style={{ 
          background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
          height: 2,
          marginTop: 8,
          borderRadius: 1,
        }} />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
        style={{
          background: "transparent",
          border: "none",
          fontSize: 14,
          fontWeight: 500,
        }}
        className="admin-sidebar-menu"
      />

      <style>
        {`
          
        `}
      </style>
    </div>
  );
};

export default AdminSidebar;
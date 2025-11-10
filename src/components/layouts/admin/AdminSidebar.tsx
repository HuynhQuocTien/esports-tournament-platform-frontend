import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  TeamOutlined,
  TrophyOutlined,
  CrownOutlined,
  UserOutlined,
  KeyOutlined,
} from "@ant-design/icons";

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/admin/tournaments", icon: <TrophyOutlined />, label: "Giải đấu" },
    { key: "/admin/teams", icon: <TeamOutlined />, label: "Đội" },
    { key: "/admin/ranking", icon: <CrownOutlined />, label: "Bảng xếp hạng" },
    { key: "/admin/users", icon: <UserOutlined />, label: "Người dùng" },
    { key: "/admin/permissions", icon: <KeyOutlined />, label: "Phân quyền" },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={items}
      onClick={({ key }) => navigate(key)}
    />
  );
};

export default AdminSidebar;

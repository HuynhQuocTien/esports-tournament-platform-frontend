import React from "react";
import {
  Layout,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Badge,
} from "antd";
import type { MenuProps } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";

const { Header } = Layout;
const { Text } = Typography;

const AdminHeader: React.FC = () => {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    window.location.href = "/";
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 32px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        height: 70,
      }}
    >
      {/* Page Title */}
      <div>
        <Text
          style={{
            color: "#ffffff",
            fontSize: 20,
            fontWeight: 600,
            background: "linear-gradient(135deg, #ffffff 0%, #a8a8a8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Bảng điều khiển quản trị
        </Text>
      </div>

      {/* Right Section */}
      <Space size="middle">
        {/* Notifications */}
        <Badge count={5} size="small" offset={[-2, 2]}>
          <Button
            type="text"
            icon={
              <BellOutlined
                style={{ fontSize: 18, color: "rgba(255, 255, 255, 0.8)" }}
              />
            }
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
            }}
          />
        </Badge>

        {/* User Profile */}
        <Dropdown
          menu={{ items: userMenuItems }}
          overlayStyle={{
            background: "#1a1a2e",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 12,
            padding: 8,
          }}
          placement="bottomRight"
          arrow
        >
          <Button
            type="text"
            style={{
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 10,
              padding: "8px 12px",
              height: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Avatar
              size={32}
              style={{
                background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
                fontWeight: 600,
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </Avatar>
            <div style={{ textAlign: "left" }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: 14,
                  display: "block",
                }}
              >
                {user?.username || "Admin"}
              </Text>
              <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}>
                Quản trị viên
              </Text>
            </div>
            <DownOutlined
              style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}
            />
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AdminHeader;

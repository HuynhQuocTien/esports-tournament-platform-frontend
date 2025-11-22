import {
  Button,
  Layout,
  Menu,
  Dropdown,
  Modal,
  message,
  Avatar,
  Space,
  Typography,
  Badge,
} from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserOutlined,
  ProfileOutlined,
  TrophyOutlined,
  TeamOutlined,
  ScheduleOutlined,
  HomeOutlined,
  BarChartOutlined,
  BellOutlined,
  MessageOutlined,
  LogoutOutlined,
  SettingOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";
import { AuthModal } from "../../auth";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/common/interfaces/payload/jwt-payload";

type MenuItem = {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type MenuDivider = {
  type: "divider";
};

type MenuItemType = MenuItem | MenuDivider;

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar: React.FC = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<"login" | "register">("login");
  const { user, setUser, setRole } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      okButtonProps: {
        danger: true,
        style: {
          background: "linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)",
          border: "none",
          borderRadius: 6,
        },
      },
      cancelButtonProps: {
        style: {
          borderColor: "#d9d9d9",
          borderRadius: 6,
        },
      },
      onOk: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        message.success("Đăng xuất thành công!");
      },
    });
  };

  const handleLoginClick = () => {
    setAuthStep("login");
    setAuthOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthStep("register");
    setAuthOpen(true);
  };

  const menuItems = [
    {
      key: "1",
      label: <Link to="/">Trang chủ</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "2",
      label: <Link to="/tournaments">Giải đấu</Link>,
      icon: <TrophyOutlined />,
    },
    {
      key: "3",
      label: <Link to="/teams">Đội tham gia</Link>,
      icon: <TeamOutlined />,
    },
    {
      key: "4",
      label: <Link to="/results">Kết quả</Link>,
      icon: <BarChartOutlined />,
    },
    {
      key: "5",
      label: <Link to="/ranking">Xếp hạng</Link>,
      icon: <ScheduleOutlined />,
    },
    {
      key: "6",
      label: <Link to="/schedule">Lịch thi đấu</Link>,
      icon: <ScheduleOutlined />,
    },
  ];

  const userMenuItems: MenuItemType[] = [
    {
      key: "profile",
      label: <Link to="/profile">Hồ sơ cá nhân</Link>,
      icon: <ProfileOutlined />,
    },
    {
      key: "settings",
      label: <Link to="/settings">Cài đặt</Link>,
      icon: <SettingOutlined />,
    },
    {
      key: "my_tournaments",
      label: <Link to="/my_tournaments">Giải đấu của tôi</Link>,
      icon: <TrophyOutlined />,
    },
    {
      key: "my_teams",
      label: <Link to="/my_teams">Đội của tôi</Link>,
      icon: <TeamOutlined />,
    },
    { type: "divider" },
    {
      key: "logout",
      label: <span>Đăng xuất</span>,
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const getActiveKey = () => {
    const path = location.pathname;
    if (path === "/") return ["1"];
    if (path.includes("/tournaments")) return ["2"];
    if (path.includes("/teams")) return ["3"];
    if (path.includes("/results")) return ["4"];
    if (path.includes("/ranking")) return ["5"];
    if (path.includes("/schedule")) return ["6"];
    return ["1"];
  };

  const getUserAvatar = () => {
    if (user?.avatar) return <Avatar size={32} src={user.avatar} />;
    if (user?.username)
      return (
        <Avatar
          size={32}
          style={{
            background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
            fontWeight: 600,
          }}
        >
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
      );
    return (
      <Avatar
        size={32}
        icon={<UserOutlined />}
        style={{
          background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
        }}
      />
    );
  };

  const getDisplayName = () => user?.username || "Người dùng";

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: 70,
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          marginRight: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/logo-removebg.png"
            alt="ESports Arena Logo"
            style={{
              width: 42,
              height: 42,
              objectFit: "contain",
              filter: "drop-shadow(0 2px 8px rgba(114, 46, 209, 0.3))",
            }}
          />
          <Text
            style={{
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: 24,
              letterSpacing: 0.5,
              background: "linear-gradient(135deg, #ffffff 0%, #a8a8a8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            ESports Arena
          </Text>
        </div>
      </Link>

      {/* Navigation Menu */}
      <Menu
        mode="horizontal"
        selectedKeys={getActiveKey()}
        items={menuItems}
        style={{
          flex: 1,
          background: "transparent",
          borderBottom: "none",
          fontSize: 15,
          fontWeight: 500,
          color: "rgba(255, 255, 255, 0.8)",
        }}
        className="custom-header-menu"
      />

      {/* Right Section - Notifications & User */}
      <Space size="middle" style={{ marginLeft: "auto" }}>
        {user?.userType ? (
          <>
            {/* Notifications */}
            <Badge count={3} size="small" offset={[-2, 2]}>
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

            {/* Messages */}
            <Badge count={5} size="small" offset={[-2, 2]}>
              <Button
                type="text"
                icon={
                  <MessageOutlined
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

            {/* User Profile Dropdown */}
            <Dropdown
              menu={{
                items: userMenuItems,
                style: {
                  background: "#1a1a2e",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 12,
                  padding: 8,
                },
              }}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
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
                  transition: "all 0.3s ease",
                }}
                className="user-profile-button"
              >
                {getUserAvatar()}
                <div style={{ textAlign: "left" }}>
                  <Text
                    style={{ color: "#ffffff", fontWeight: 600, fontSize: 14 }}
                  >
                    {getDisplayName()}
                  </Text>
                  <br />
                  <Text
                    style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}
                  >
                    Thành viên
                  </Text>
                </div>
              </Button>
            </Dropdown>
          </>
        ) : (
          <Space size="small">
            <Button
              type="default"
              icon={<LoginOutlined />}
              onClick={handleLoginClick}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "rgba(255, 255, 255, 0.9)",
                borderRadius: 8,
                fontWeight: 500,
                padding: "8px 16px",
                height: 40,
              }}
            >
              Đăng nhập
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={handleRegisterClick}
              style={{
                background: "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                padding: "8px 20px",
                height: 40,
                boxShadow: "0 4px 12px rgba(114, 46, 209, 0.4)",
              }}
            >
              Đăng ký
            </Button>
          </Space>
        )}
      </Space>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(userData) => {
          if (userData.access_token)
            localStorage.setItem("access_token", userData.access_token);
          const decoded: JwtPayload = jwtDecode(userData.access_token);
          setUser(decoded);
          setRole(decoded.userType === null ? "admin" : "client");
          setAuthOpen(false);
          if (decoded.userType === null) {
            window.location.href = "/admin";
          }
        }}
        initialStep={authStep}
      />
    </Header>
  );
};

export default HeaderBar;

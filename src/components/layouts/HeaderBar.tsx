// frontend/src/components/layouts/HeaderBar.tsx
import { Button, Layout, Menu, Dropdown, Modal, message, Avatar, Space, Typography } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  UserOutlined,  
  ProfileOutlined,
  TrophyOutlined,
  TeamOutlined,
  ScheduleOutlined,
  HomeOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "../../hooks/useAuth";

type MenuItem = {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
};


type MenuDivider = {
  type: 'divider';
};

type MenuItemType = MenuItem | MenuDivider;

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar: React.FC = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, setUser } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    console.log("HÀM HANDLELOGOUT ĐÃ ĐƯỢC GỌI");
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        message.success("Đăng xuất thành công!");
      },
    });
  };

  const menuItems = [
    { 
      key: "1", 
      label: <Link to="/">Trang chủ</Link>,
      icon: <HomeOutlined />
    },
    { 
      key: "2", 
      label: <Link to="/tournaments">Giải đấu</Link>,
      icon: <TrophyOutlined />
    },
    { 
      key: "3", 
      label: <Link to="/teams">Đội tham gia</Link>,
      icon: <TeamOutlined />
    },
    { 
      key: "4", 
      label: <Link to="/results">Kết quả</Link>,
      icon: <BarChartOutlined />
    },
    { 
      key: "5", 
      label: <Link to="/ranking">Lịch thi đấu</Link>,
      icon: <ScheduleOutlined />
    },
  ];

  const userMenuItems : MenuItemType[] = [
    { 
      key: "profile", 
      label: <Link to="/profile">Hồ sơ</Link>,
      icon: <ProfileOutlined />
    },
    { type: "divider" },
    { 
      key: "logout", 
      label: <span style={{ color: '#ff4d4f' }}> Đăng xuất</span>,
      onClick: handleLogout
    },
  ];

  const getActiveKey = () => {
    const path = location.pathname;
    if (path === "/") return ["1"];
    if (path.includes("/tournaments")) return ["2"];
    if (path.includes("/teams")) return ["3"];
    if (path.includes("/results")) return ["4"];
    if (path.includes("/ranking")) return ["5"];
    return ["1"];
  };

  const getUserAvatar = () => {
    if (user?.avatar) {
      return <Avatar size="small" src={user?.avatar} />;
    }
    if (user?.username) {
      return <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
        {user.username.charAt(0).toUpperCase()}
      </Avatar>;
    }
    return <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />;
  };

  const getDisplayName = () => {
    return user?.username || 'Người dùng';
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8 
        }}>
          <div style={{ 
            fontSize: 24,
            background: "linear-gradient(45deg, #ff6b6b, #feca57)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold"
          }}>
          </div>
          <Text style={{ 
            color: "#fff", 
            fontWeight: "bold", 
            fontSize: 20,
            background: "linear-gradient(45deg, #fff, #f0f0f0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            ESports Arena
          </Text>
        </div>
      </Link>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={getActiveKey()}
        items={menuItems}
        style={{ 
          flex: 1, 
          marginLeft: 32,
          background: "transparent",
          borderBottom: "none",
          fontSize: 15,
          fontWeight: 500
        }}
        className="custom-menu"
      />

      <Space>
        {user ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Button 
              type="text" 
              style={{ 
                color: "#fff",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 8,
                padding: "8px 16px",
                height: "auto",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              {getUserAvatar()}
              <Text style={{ color: "#fff", fontWeight: 500 }}>
                {getDisplayName()}
              </Text>
            </Button>
          </Dropdown>
        ) : (
          <Button 
            type="primary" 
            onClick={() => setAuthOpen(true)}
            style={{
              background: "linear-gradient(45deg, #1890ff, #722ed1)",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              padding: "8px 20px",
              height: "auto",
              boxShadow: "0 2px 6px rgba(24, 144, 255, 0.4)"
            }}
          >
            Đăng nhập / Đăng ký
          </Button>
        )}
      </Space>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(userData: any) => {
          if (userData.token) {
            localStorage.setItem("access_token", userData.token);
          }
          if (userData.user) {
            setUser(userData.user);
          }
          setAuthOpen(false);
        }}
      />

      <style>
        {`
          .custom-menu .ant-menu-item {
            margin: 0 8px;
            border-radius: 6px;
            transition: all 0.3s ease;
          }
          
          .custom-menu .ant-menu-item:hover {
            background: rgba(255, 255, 255, 0.1) !important;
          }
          
          .custom-menu .ant-menu-item-selected {
            background: linear-gradient(45deg, #1890ff, #722ed1) !important;
          }
          
          .ant-dropdown-menu {
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
    </Header>
  );
};

export default HeaderBar;
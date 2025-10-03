import { Button, Layout, Menu } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthModal from "../auth/AuthModal";

const { Header } = Layout;

const HeaderBar: React.FC = () => {
  const [authOpen, setAuthOpen] = useState(false);

  const items = [
    { key: "1", label: <Link to="/">Trang chủ</Link> },
    { key: "2", label: <Link to="/tournaments">Giải đấu</Link> },
    { key: "3", label: <Link to="/teams">Đội tham gia</Link> },
    { key: "4", label: <Link to="/results">Kết quả</Link> },
    { key: "5", label: <Link to="/ranking">Lịch thi đấu</Link> },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
        🎮 ESports Arena
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        items={items}
        style={{ flex: 1, marginLeft: 32 }}
      />
      <Button type="primary" onClick={() => setAuthOpen(true)}>
        Đăng nhập / Đăng ký
      </Button>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </Header>
  );
};

export default HeaderBar;

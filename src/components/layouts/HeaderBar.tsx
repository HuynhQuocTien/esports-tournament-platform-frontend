import { Button, Layout, Menu } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const HeaderBar: React.FC = () => {
  const location = useLocation();

  const items = [
    { key: "/", label: <Link to="/">Trang chủ</Link> },
    { key: "/tournaments", label: <Link to="/tournaments">Giải đấu</Link> },
    { key: "/teams", label: <Link to="/teams">Đội tham gia</Link> },
    { key: "/results", label: <Link to="/results">Kết quả</Link> },
    { key: "/ranking", label: <Link to="/ranking">Bảng xếp hạng</Link> },
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
        selectedKeys={[location.pathname]}
        items={items}
      />
      <Button type="primary">Đăng ký</Button>
    </Header>
  );
};

export default HeaderBar;

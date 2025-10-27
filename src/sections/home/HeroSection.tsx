import React from "react";
import { Typography, Button, Space } from "antd";

const { Title, Paragraph } = Typography;

export const HeroSection: React.FC = () => {
  return (
    <div
      style={{
        background: "url('/banner.jpg') center/cover no-repeat",
        textAlign: "center",
        padding: "120px 20px",
        color: "#fff",
      }}
    >
      <Title style={{ color: "#fff", fontSize: 48 }}>GIẢI ĐẤU ESPORTS CHAMPIONSHIP 2025</Title>
      <Paragraph style={{ fontSize: 18 }}>
        Tham gia giải đấu esports lớn nhất năm với tổng giải thưởng lên đến 1 tỷ VNĐ.
      </Paragraph>
      <Space>
        <Button type="primary" size="large">Đăng ký ngay</Button>
        <Button size="large">Xem Highlight</Button>
        <Button size="large">Lịch thi đấu</Button>
      </Space>
    </div>
  );
};
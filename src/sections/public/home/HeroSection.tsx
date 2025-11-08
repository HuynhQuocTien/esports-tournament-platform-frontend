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
      <Title
        style={{
          color: " rgba(0,0,0,0.5)",
          fontSize: 48,
          textShadow: "1px 1px 4px rgba(255,255,255,0.95)",
        }}
      >
        GIẢI ĐẤU ESPORTS CHAMPIONSHIP 2025
      </Title>
      <Paragraph
        style={{
          fontSize: 18,
          color: " rgba(0,0,0,0.5)",
          textShadow: "1px 1px 2px rgba(255, 255, 255, 0.85)",
        }}
      >
        Tham gia giải đấu esports lớn nhất năm với tổng giải thưởng lên đến 1 tỷ
        VNĐ.
      </Paragraph>
      <Space>
        <Button type="primary" size="large">
          Đăng ký ngay
        </Button>
        <Button size="large">
          Xem Highlight
        </Button>
        <Button size="large">
          Lịch thi đấu
        </Button>
      </Space>
    </div>
  );
};
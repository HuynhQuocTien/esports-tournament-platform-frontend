import React from "react";
import { Typography, Button, Space } from "antd";
import { PlayCircleOutlined, CalendarOutlined, RocketOutlined } from "@ant-design/icons";
import DecryptedText from "../../../components/Textanimate/DecryptedText";

const { Title, Paragraph } = Typography;

export const HeroSection: React.FC = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        textAlign: "center",
        padding: "100px 20px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%)
          `,
        }}
      />
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <Title
          style={{
            color: "#ffffff",
            fontSize: "3.5rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ marginTop: '2rem' }}>
            <DecryptedText
              text="GIẢI ĐẤU ESPORTS CHAMPIONSHIP 2025"
              animateOn="view"
              revealDirection="center"
              sequential={true}
              speed={50}
            />
          </div>
        </Title>
        
        <Paragraph
          style={{
            fontSize: "1.3rem",
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "3rem",
            maxWidth: "600px",
            margin: "0 auto 3rem auto",
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Tham gia giải đấu esports lớn nhất năm với tổng giải thưởng lên đến 
          <span style={{ color: "#ffd700", fontWeight: "bold", margin: "0 4px" }}>1 TỶ VNĐ</span>
          và cơ hội trở thành nhà vô địch.
        </Paragraph>
        
        <Space size="large" style={{ marginBottom: "2rem" }}>
          <Button 
            type="primary" 
            size="large"
            icon={<RocketOutlined />}
            style={{
              height: "50px",
              padding: "0 30px",
              fontSize: "16px",
              fontWeight: 600,
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 8px 25px rgba(255, 107, 107, 0.4)",
            }}
          >
            Đăng ký ngay
          </Button>
          <Button 
            size="large"
            icon={<PlayCircleOutlined />}
            style={{
              height: "50px",
              padding: "0 30px",
              fontSize: "16px",
              fontWeight: 600,
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              borderRadius: "8px",
            }}
          >
            Xem Highlight
          </Button>
          <Button 
            size="large"
            icon={<CalendarOutlined />}
            style={{
              height: "50px",
              padding: "0 30px",
              fontSize: "16px",
              fontWeight: 600,
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              borderRadius: "8px",
            }}
          >
            Lịch thi đấu
          </Button>
        </Space>

        {/* Stats Preview */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "500px",
            margin: "2rem auto 0 auto",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {[
            { number: "500+", label: "Đội" },
            { number: "1B VNĐ", label: "Giải thưởng" },
            { number: "30", label: "Ngày" }
          ].map((stat, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <div style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "bold" }}>
                {stat.number}
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
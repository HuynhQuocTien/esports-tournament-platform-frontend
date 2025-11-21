import React from "react";
import { Layout, Row, Col, Typography, Divider, Space, Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  InstagramOutlined,
  DiscordOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  RocketOutlined,
  TrophyOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "white",
        padding: "60px 0 20px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        {/* Main Footer Content */}
        <Row gutter={[40, 30]} justify="space-between">
          {/* Company Info */}
          <Col xs={24} md={8}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src="/logo-removebg.png"
                  alt="ESports Arena Logo"
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "contain",
                    marginRight: 12,
                  }}
                />
                <Title level={3} style={{ color: "white", margin: 0 }}>
                  ESports Arena
                </Title>
              </div>

              <Text
                style={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6 }}
              >
                Nền tảng tổ chức giải đấu Esports hàng đầu Việt Nam. Kết nối
                cộng đồng game thủ và mang đến những trải nghiệm thi đấu chuyên
                nghiệp.
              </Text>

              <Space size="middle">
                <Button
                  type="primary"
                  size="small"
                  style={{
                    background:
                      "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  Tham gia ngay
                </Button>
                <Button
                  size="small"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    borderRadius: 6,
                  }}
                >
                  Liên hệ
                </Button>
              </Space>
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={8} md={4}>
            <Title level={4} style={{ color: "white", marginBottom: 20 }}>
              Giải đấu
            </Title>
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              {[
                "VALORANT Champions",
                "League of Legends",
                "Counter-Strike 2",
                "DOTA 2",
                "PUBG Mobile",
                "Arena of Valor",
              ].map((item) => (
                <Link
                  key={item}
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    display: "block",
                    transition: "color 0.3s",
                  }}
                  href="#"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#722ed1")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")
                  }
                >
                  {item}
                </Link>
              ))}
            </Space>
          </Col>

          {/* Resources */}
          <Col xs={24} sm={8} md={4}>
            <Title level={4} style={{ color: "white", marginBottom: 20 }}>
              Tài nguyên
            </Title>
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              {[
                "Thể lệ giải đấu",
                "Hướng dẫn đăng ký",
                "Livestream",
                "Highlight",
                "Tin tức Esports",
                "Cộng đồng",
              ].map((item) => (
                <Link
                  key={item}
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    display: "block",
                    transition: "color 0.3s",
                  }}
                  href="#"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#722ed1")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")
                  }
                >
                  {item}
                </Link>
              ))}
            </Space>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={8} md={6}>
            <Title level={4} style={{ color: "white", marginBottom: 20 }}>
              Liên hệ
            </Title>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <MailOutlined style={{ color: "#722ed1", fontSize: 16 }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  contact@esports-arena.vn
                </Text>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <PhoneOutlined style={{ color: "#722ed1", fontSize: 16 }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  +84 123 456 789
                </Text>
              </div>

              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <EnvironmentOutlined
                  style={{ color: "#722ed1", fontSize: 16, marginTop: 4 }}
                />
                <Text style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Tòa nhà Esports, Quận 5,
                  <br />
                  TP. Hồ Chí Minh, Việt Nam
                </Text>
              </div>
            </Space>

            {/* Social Media */}
            <div style={{ marginTop: 24 }}>
              <Text
                strong
                style={{ color: "white", display: "block", marginBottom: 12 }}
              >
                Theo dõi chúng tôi
              </Text>
              <Space size="middle">
                {[
                  { icon: <FacebookOutlined />, color: "#1877f2", url: "#" },
                  { icon: <TwitterOutlined />, color: "#1da1f2", url: "#" },
                  { icon: <YoutubeOutlined />, color: "#ff0000", url: "#" },
                  { icon: <InstagramOutlined />, color: "#e4405f", url: "#" },
                  { icon: <DiscordOutlined />, color: "#5865f2", url: "#" },
                ].map((social, index) => (
                  <Button
                    key={index}
                    type="text"
                    icon={social.icon}
                    style={{
                      color: "white",
                      background: social.color,
                      border: "none",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    href={social.url}
                    target="_blank"
                  />
                ))}
              </Space>
            </div>
          </Col>
        </Row>

        <Divider
          style={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            margin: "40px 0 20px 0",
          }}
        />

        {/* Bottom Footer */}
        <Row justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <Text style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              © {new Date().getFullYear()}{" "}
              <strong style={{ color: "white" }}>ESports Arena</strong>. All
              rights reserved.
            </Text>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <Link style={{ color: "rgba(255, 255, 255, 0.6)" }} href="#">
                Điều khoản sử dụng
              </Link>
              <Link style={{ color: "rgba(255, 255, 255, 0.6)" }} href="#">
                Chính sách bảo mật
              </Link>
              <Link style={{ color: "rgba(255, 255, 255, 0.6)" }} href="#">
                Cookie Policy
              </Link>
            </div>
          </Col>
        </Row>

        {/* Stats Bar */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: 12,
            padding: "20px",
            marginTop: 30,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Row gutter={[20, 20]} justify="space-around">
            {[
              { icon: <TrophyOutlined />, number: "50+", text: "Giải đấu" },
              { icon: <TeamOutlined />, number: "10,000+", text: "Tuyển thủ" },
              { icon: <RocketOutlined />, number: "5M+", text: "Lượt xem" },
              { icon: <EnvironmentOutlined />, number: "3", text: "Quốc gia" },
            ].map((stat, index) => (
              <Col key={index} xs={12} sm={6} style={{ textAlign: "center" }}>
                <div
                  style={{ color: "#722ed1", fontSize: 24, marginBottom: 8 }}
                >
                  {stat.icon}
                </div>
                <Text
                  strong
                  style={{ color: "white", fontSize: 18, display: "block" }}
                >
                  {stat.number}
                </Text>
                <Text
                  style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}
                >
                  {stat.text}
                </Text>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;

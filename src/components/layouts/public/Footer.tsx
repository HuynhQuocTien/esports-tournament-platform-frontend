import React from "react";
import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter
      style={{
        textAlign: "center",
        background: "#f5f7fa",
        color: "#555",
        borderTop: "1px solid #e0e0e0",
        padding: "16px 0",
        fontSize: 15,
      }}
    >
      © {new Date().getFullYear()} 🎮 <strong>ESports Arena</strong>. All rights reserved.
    </AntFooter>
  );
};

export default Footer;

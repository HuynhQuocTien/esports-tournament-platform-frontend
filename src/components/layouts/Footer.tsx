import React from "react";
import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter style={{ textAlign: "center", background: "#001529", color: "#fff" }}>
      © {new Date().getFullYear()} 🎮 ESports Arena. All rights reserved.
    </AntFooter>
  );
};

export default Footer;

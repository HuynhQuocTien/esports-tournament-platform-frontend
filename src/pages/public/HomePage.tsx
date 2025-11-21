import React from "react";
import { Layout, ConfigProvider } from "antd";
import { Content } from "antd/es/layout/layout";
import {
  HeroSection,
  RankingSection,
  StatsSection,
  TeamsSection,
  TopPlayersSection,
  TournamentSection,
} from "../../sections/public/home";

const THEME_PRIMARY_COLOR = "#722ed1";
const PAGE_BACKGROUND_COLOR = "#f5f7fa";
const CARD_BACKGROUND_COLOR = "#e6f7ff";
const CARD_BORDER_COLOR = "#bae0ff";

export const HomePage: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_PRIMARY_COLOR,
          colorBgContainer: CARD_BACKGROUND_COLOR,
          colorBorderSecondary: CARD_BORDER_COLOR,
          colorWarning: "#faad14",
          colorError: "#f5222d",
          colorSuccess: "#52c41a",
        },
      }}
    >
      <Layout style={{ background: PAGE_BACKGROUND_COLOR, minHeight: "100vh" }}>
        <HeroSection />

        <Content
          style={{
            padding: "40px 80px",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <StatsSection />
          <TournamentSection />
          <TopPlayersSection />
          <TeamsSection />
          <RankingSection />
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

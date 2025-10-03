import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import Footer from "../components/layouts/Footer";
import TournamentSection from "../components/sections/TournamentSection";
import TopPlayersSection from "../components/sections/TopPlayersSection";
import TeamsSection from "../components/sections/TeamsSection";
import RankingSection from "../components/sections/RankingSection";
import HeroSection from "../components/sections/HeroSection";
import StatsSection from "../components/sections/StatsSection";

export const HomePage: React.FC = () => {
  return (
     <Layout>
      <Content style={{ background: "#000", padding: "40px 80px" }}>
        <HeroSection />
        <StatsSection />
        <TournamentSection />
        <TopPlayersSection />
        <TeamsSection />
        <RankingSection />
      </Content>
      <Footer />
    </Layout>
  );
};

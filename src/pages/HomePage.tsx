import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import Footer from "../components/layouts/Footer";
import { HeroSection, RankingSection, StatsSection, TeamsSection, TopPlayersSection, TournamentSection } from "../sections/home";


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

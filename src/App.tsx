import React from "react";
import { Layout } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import MainLayout from "./components/layouts/MainLayout";
import TeamsPage from "./pages/TeamsPage";
import RankingPage from "./pages/RankingPage";

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="ranking" element={<RankingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

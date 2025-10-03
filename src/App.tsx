import React from "react";
import { Layout } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import { HomePage, RankingPage, ResultsPage, TeamsPage, TournamentDetailPage, TournamentsPage } from "./pages";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tournaments" element={<TournamentsPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="tournaments/:id" element={<TournamentDetailPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="ranking" element={<RankingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

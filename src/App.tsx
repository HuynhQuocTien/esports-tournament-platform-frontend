import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/public/PublicLayout";
import AdminLayout from "./components/layouts/admin/AdminLayout";
import {
  HomePage,
  RankingPage,
  ResultsPage,
  TeamsPage,
  TournamentDetailPage,
  TournamentsPage,
} from "./pages";
import {
  AdminTournamentsPage,
  AdminTeamsPage,
  AdminRankingPage,
  AdminUsersPage,
  AdminPermissionsPage,
} from "./pages/admin";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tournaments" element={<TournamentsPage />} />
          <Route path="tournaments/:id" element={<TournamentDetailPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="ranking" element={<RankingPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="tournaments" element={<AdminTournamentsPage />} />
          <Route path="teams" element={<AdminTeamsPage />} />
          <Route path="ranking" element={<AdminRankingPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="permissions" element={<AdminPermissionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

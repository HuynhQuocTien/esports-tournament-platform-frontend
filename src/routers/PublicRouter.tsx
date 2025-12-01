import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layouts/public/PublicLayout";
import {
  HomePage,
  RankingPage,
  ResultsPage,
  SchedulePage,
  TeamsPage,
  TournamentDetailPage,
  TournamentsPage,
} from "../pages/public";
import CreateTournamentPage from "@/pages/public/tournaments/CreateTournamentPage";
import { UserProfilePage } from "@/pages/public/user-profile/UserProfilePage";
import { MyTeamsPage } from "@/pages/public/my-teams/MyTeamsPage";
import MyTournamentPage from "@/pages/public/tournaments/MyTournamentPage";
import { ProtectedRoute } from "./ProtectedRoute";
import TournamentSetupPage from "@/pages/public/tournaments/TournamentSettupPage";

export const PublicRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route
          path="tournaments/create-league"
          element={<CreateTournamentPage />}
        />
        <Route path="tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="tournaments/:id/setup" element={<TournamentSetupPage/>} />
        <Route path="tournaments/mine" element={<MyTournamentPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="my_teams" element={<MyTeamsPage />} />
      </Route>
    </Routes>
  );
};

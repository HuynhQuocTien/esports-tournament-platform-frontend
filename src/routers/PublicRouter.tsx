import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layouts/public/PublicLayout";
import {
  HomePage,
  RankingPage,
  ResultsPage,
  SchedulePage,
  TeamsPage,
  TournamentsPage,
} from "../pages/public";
import CreateTournamentPage from "@/pages/organizer/CreateTournamentPage";
import { UserProfilePage } from "@/pages/public/user-profile/UserProfilePage";
import { MyTeamsPage } from "@/pages/public/my-teams/MyTeamsPage";
import MyTournamentPage from "@/pages/organizer/MyTournamentPage";
import TournamentSetupPage from "@/pages/organizer/TournamentSettupPage";
import { TeamMembersPage } from "@/pages/public/my-teams/TeamMembersPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { TournamentDetailPage } from "@/pages/public/tournaments/TournamentDetail";
export const PublicRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="schedule" element={<SchedulePage />} />

        
        {/* Protected routes */}
        <Route path="profile" element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="my-teams" element={
          <ProtectedRoute>
            <MyTeamsPage />
          </ProtectedRoute>
        } />
        
        <Route path="team/:teamId/members" element={
          <ProtectedRoute>
            <TeamMembersPage />
          </ProtectedRoute>
        } />
        
        <Route path="tournaments/create-league" element={
          <ProtectedRoute>
            <CreateTournamentPage />
          </ProtectedRoute>
        } />
        
        <Route path="tournaments/mine" element={
          <ProtectedRoute>
            <MyTournamentPage />
          </ProtectedRoute>
        } />
        
        <Route path="tournaments/setup/:id" element={
          <ProtectedRoute>
            <TournamentSetupPage />
          </ProtectedRoute>
        } />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
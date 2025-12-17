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

        <Route index element={<HomePage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        
        <Route path="profile" element={
          <ProtectedRoute excludedRoles={['TEAM_MANAGER', 'ORGANIZER', 'ADMIN']}>
            <UserProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="my-teams" element={
          <ProtectedRoute excludedRoles={['TEAM_MANAGER']}>
            <MyTeamsPage />
          </ProtectedRoute>
        } />
        
        <Route path="team/:teamId/members" element={
          <ProtectedRoute excludedRoles={['TEAM_MANAGER']}>
            <TeamMembersPage />
          </ProtectedRoute>
        } />
        
        <Route path="tournaments/create-league" element={
          <ProtectedRoute allowedRoles={['TEAM_MANAGER', 'ORGANIZER']}>
            <CreateTournamentPage />
          </ProtectedRoute>
        } />
        
        <Route path="tournaments/mine" element={
          // <ProtectedRoute allowedRoles={['TEAM_MANAGER', 'ORGANIZER']}>
            <MyTournamentPage />
          // </ProtectedRoute>
        } />
        
        <Route path="tournaments/setup/:id" element={
          // <ProtectedRoute allowedRoles={['TEAM_MANAGER', 'ORGANIZER']}>
            <TournamentSetupPage />
          // </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
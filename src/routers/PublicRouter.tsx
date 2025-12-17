import { Routes, Route, Navigate } from "react-router-dom";
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
import CreateTournamentPage from "@/pages/organizer/CreateTournamentPage";
import { UserProfilePage } from "@/pages/public/user-profile/UserProfilePage";
import { MyTeamsPage } from "@/pages/public/my-teams/MyTeamsPage";
import MyTournamentPage from "@/pages/organizer/MyTournamentPage";
import TournamentSetupPage from "@/pages/organizer/TournamentSettupPage";
import { TeamMembersPage } from "@/pages/public/my-teams/TeamMembersPage";
import { TournamentRegistrationPage } from "@/pages/public/TournamentRegistrationPage";

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

        <Route path="profile" element={<UserProfilePage />} />

        <Route path="my-teams" element={<MyTeamsPage />} />

        <Route path="team/:teamId/members" element={<TeamMembersPage />} />

        <Route
          path="tournaments/create-league"
          element={<CreateTournamentPage />}
        />
        <Route path="tournaments/:id/register" element={<TournamentRegistrationPage />} />

        <Route path="tournaments/mine" element={<MyTournamentPage />} />

        <Route path="tournaments/setup/:id" element={<TournamentSetupPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

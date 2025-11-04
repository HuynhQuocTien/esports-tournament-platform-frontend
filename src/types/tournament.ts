import type { MatchSchedule } from "./match";

export interface TournamentDetail {
  id: string;
  name: string;
  description: string;
  schedule: MatchSchedule[];
}

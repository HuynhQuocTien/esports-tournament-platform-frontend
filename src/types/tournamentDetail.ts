import type { MatchSchedule } from "./matchSchedule";

export interface TournamentDetail {
  id: string;
  name: string;
  description: string;
  schedule: MatchSchedule[];
}

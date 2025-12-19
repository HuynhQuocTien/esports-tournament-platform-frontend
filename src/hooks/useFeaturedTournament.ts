import { useEffect, useRef, useState } from "react";
import { tournamentService } from "@/services/tournamentService";

export interface Tournament {
  id: string;
  name: string;
  description: string;
  game: string;
  type: string;
  format: string;
  status: string;
  bannerUrl?: string;
  tournamentStart?: string;
  maxTeams: number;
  registrationFee: number;
  prizePool: number;
  city?: string;
  approvedTeamsCount: number;
  registrationProgress: number;
  registrationStatus: string;
}

export const useFeaturedTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 👉 chặn StrictMode gọi effect 2 lần
  const fetchedRef = useRef(false);

  const fetchFeaturedTournaments = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await tournamentService.getFeature();

      if (res.data?.success) {
        setTournaments(res.data.data);
      } else {
        setTournaments(res.data?.data || res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải giải đấu nổi bật");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetchFeaturedTournaments();
  }, []);

  return {
    tournaments,
    loading,
    error,
    refetch: fetchFeaturedTournaments,
  };
};

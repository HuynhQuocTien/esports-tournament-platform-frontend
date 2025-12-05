import { useState, useCallback } from 'react';
import { tournamentService } from '@/services/tournamentService';
import type { TournamentData, TournamentDataKey } from '../common/types/tournament';

export const useTournament = (initialId?: string) => {
  const [tournamentId, setTournamentId] = useState<string | undefined>(initialId);
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadTournament = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await tournamentService.getForSetup(id);
      
      // Map and set data...
      setTournamentId(id);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSection = useCallback(async (
    key: TournamentDataKey, 
    data: any,
    immediateSave: boolean = false
  ) => {
    if (!tournamentData) return;

    // Update local state
    const updatedData = { ...tournamentData, [key]: data };
    setTournamentData(updatedData);
    setHasUnsavedChanges(true);

    // Save immediately if requested
    if (immediateSave && tournamentId) {
      await tournamentService.updateTournamentSection(tournamentId, key, data);
      setHasUnsavedChanges(false);
    }
  }, [tournamentData, tournamentId]);

  return {
    tournamentId,
    tournamentData,
    loading,
    hasUnsavedChanges,
    loadTournament,
    updateSection,
    setTournamentData,
    setHasUnsavedChanges,
  };
};
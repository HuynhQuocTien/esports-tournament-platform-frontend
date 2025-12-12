import { useState, useCallback } from 'react';
import { message } from 'antd';
import { teamService } from '@/services/teamService';
import type { Team, CreateTeamDto, UpdateTeamDto, PaginationParams } from '@/common/types/team';

export const useTeam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTeam = useCallback(async (data: CreateTeamDto): Promise<Team | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const team = await teamService.createTeam(data);
      message.success('Tạo đội thành công!');
      return team;
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTeam = useCallback(async (id: string, data: UpdateTeamDto): Promise<Team | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const team = await teamService.updateTeam(id, data);
      message.success('Cập nhật đội thành công!');
      return team;
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTeam = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await teamService.deleteTeam(id);
      message.success('Xóa đội thành công!');
      return true;
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTeamStatus = useCallback(async (id: string, status: 'active' | 'inactive' | 'recruiting'): Promise<Team | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const team = await teamService.updateTeamStatus(id, status);
      message.success('Cập nhật trạng thái thành công!');
      return team;
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    updateTeamStatus,
  };
};
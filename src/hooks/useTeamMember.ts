import { useState, useCallback } from 'react';
import { message, Modal } from 'antd';
import { teamMemberService } from '@/services/team-memberService';
import type { TeamMember, CreateTeamMemberDto, UpdateTeamMemberDto } from '@/common/types/team';

export const useTeamMember = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMember = useCallback(async (teamId: string, data: CreateTeamMemberDto): Promise<TeamMember | null> => {
    setLoading(true);
    setError(null);

    try {
      const member = await teamMemberService.addMember(teamId, data);
      message.success('Thêm thành viên thành công!');
      return member;
    } catch (err: any) {
      setError(err.message);

      // Xử lý trường hợp thành viên đã có trong đội khác
      if (err.message.includes('đã là thành viên của đội khác')) {
        Modal.confirm({
          title: 'Thành viên đã có trong đội khác',
          content: err.message + ' Bạn vẫn muốn thêm?',
          okText: 'Thêm',
          cancelText: 'Hủy',
          onOk: async () => {
            // TODO: Xử lý logic thêm thành viên có thể tham gia nhiều đội
            // Hoặc hiển thị thông báo chi tiết hơn
          },
        });
      } else {
        message.error(err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMember = useCallback(async (teamId: string, memberId: string, data: UpdateTeamMemberDto): Promise<TeamMember | null> => {
    setLoading(true);
    setError(null);

    try {
      const member = await teamMemberService.updateMember(teamId, memberId, data);
      message.success('Cập nhật thành viên thành công!');
      return member;
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveMember = useCallback(async (teamId: string, memberId: string): Promise<TeamMember | null> => {
    setLoading(true);
    setError(null);

    try {
      const member = await teamMemberService.approveMember(teamId, memberId);
      message.success('Phê duyệt thành viên thành công!');
      return member;
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectMember = useCallback(async (teamId: string, memberId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await teamMemberService.rejectMember(teamId, memberId);
      message.success('Từ chối thành viên thành công!');
      return true;
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMember = useCallback(async (teamId: string, memberId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await teamMemberService.removeMember(teamId, memberId);
      message.success('Xóa thành viên thành công!');
      return true;
    } catch (err: any) {
      setError(err.message);

      // Xử lý trường hợp không thể xóa đội trưởng
      if (err.message.includes('Không thể xóa đội trưởng')) {
        Modal.warning({
          title: 'Không thể xóa đội trưởng',
          content: err.message,
          okText: 'Đã hiểu',
        });
      } else {
        message.error(err.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const leaveTeam = useCallback(async (teamId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await teamMemberService.leaveTeam(teamId);
      message.success('Rời đội thành công!');
      return true;
    } catch (err: any) {
      setError(err.message);

      // Xử lý trường hợp đội trưởng không thể rời đội
      if (err.message.includes('Đội trưởng không thể rời đội')) {
        Modal.warning({
          title: 'Không thể rời đội',
          content: err.message,
          okText: 'Đã hiểu',
        });
      } else {
        message.error(err.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const transferCaptain = useCallback(async (teamId: string, newCaptainId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await teamMemberService.transferCaptain(teamId, newCaptainId);
      message.success('Chuyển quyền đội trưởng thành công!');
      return true;
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPermission = useCallback(async (teamId: string): Promise<boolean> => {
    try {
      return await teamMemberService.checkTeamPermission(teamId);
    } catch (err) {
      return false;
    }
  }, []);

  return {
    loading,
    error,
    addMember,
    updateMember,
    approveMember,
    rejectMember,
    removeMember,
    leaveTeam,
    transferCaptain,
    checkPermission,
  };
};
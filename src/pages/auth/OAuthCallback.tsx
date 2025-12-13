import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, message, Result } from 'antd';
import { handleOAuthCallback } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleOAuthCallback();
        await refetchUser();
        message.success('Đăng nhập thành công!');
        navigate('/', { replace: true });
      } catch (error: any) {
        console.error('OAuth error:', error);
        message.error(error.response?.data?.message || 'Đăng nhập thất bại');
        navigate('/login', { replace: true });
      }
    };

    processCallback();
  }, [navigate, refetchUser]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Spin size="large">
        <div style={{ padding: 50, background: 'white', borderRadius: 8 }}>
          <Result
            status="info"
            title="Đang xử lý đăng nhập"
            subTitle="Vui lòng chờ trong giây lát..."
          />
        </div>
      </Spin>
    </div>
  );
};

export default OAuthCallback;
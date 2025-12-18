import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Progress,
  Timeline,
  Statistic,
  Divider,
  Button,
  Spin,
  Alert,
  Tabs,
  List,
  Badge,
  Space,
  Modal,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  EyeOutlined,
  FlagOutlined,
  ScheduleOutlined,
  BankOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { tournamentService } from "@/services/tournamentService";
import { formatDate, formatCurrency } from "@/utils/formatters";
import type { TournamentBasicInfo } from "@/common/types";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const PAGE_BACKGROUND_COLOR = "#f8fafc";
const CARD_BACKGROUND_COLOR = "#ffffff";

const useAuthGuard = () => {
  const navigate = useNavigate();

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem("access_token");
    return !!token;
  }, []);

  const requireLogin = useCallback((action: () => void, customMessage?: string) => {
    if (isAuthenticated()) {
      action();
    } else {
      Modal.confirm({
        title: "Yêu cầu đăng nhập",
        content: customMessage || "Bạn cần đăng nhập để thực hiện hành động này",
        okText: "Đăng nhập",
        cancelText: "Hủy",
        okType: "primary",
        centered: true,
        onOk: () => {
          const currentPath = window.location.pathname;
          localStorage.setItem("redirect_url", currentPath);
          navigate("/login");
        },
        onCancel: () => {},
      });
    }
  }, [isAuthenticated, navigate]);

  return {
    isAuthenticated,
    requireLogin,
  };
};

interface ProtectedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  style?: React.CSSProperties;
  block?: boolean;
  icon?: React.ReactNode;
  size?: "large" | "middle" | "small";
  disabled?: boolean;
  authMessage?: string;
  requireAuth?: boolean;
}

const ProtectedButton: React.FC<ProtectedButtonProps> = ({
  children,
  onClick,
  type = "primary",
  style,
  block,
  icon,
  size,
  disabled,
  authMessage = "Bạn cần đăng nhập để thực hiện hành động này",
  requireAuth = true,
}) => {
  const { isAuthenticated, requireLogin } = useAuthGuard();

  const handleClick = () => {
    if (disabled) return;
    
    if (requireAuth && !isAuthenticated()) {
      requireLogin(() => {
        onClick();
      }, authMessage);
    } else {
      onClick();
    }
  };

  return (
    <Button
      type={type}
      style={style}
      block={block}
      icon={icon}
      size={size}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState<TournamentBasicInfo | null>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const isAuthenticated = useMemo(() => {
    const token = localStorage.getItem("access_token");
    return !!token;
  }, []);

  const toDate = (d: any) => (d && typeof (d as any).toDate === "function" ? (d as any).toDate() : d);

  useEffect(() => {
    const loadTournamentDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await tournamentService.getById(id);
        setTournament(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Không thể tải thông tin giải đấu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTournamentDetails();
  }, [id]);

  // useEffect(() => {
  //   const checkEligibility = async () => {
  //     if (!id || !isAuthenticated) return;
      
  //     try {
  //       const response = await tournamentService.checkEligibility(id);
  //       setEligibility(response.data);
  //     } catch (err) {
  //       console.error("Không thể kiểm tra điều kiện:", err);
  //     }
  //   };

  //   checkEligibility();
  // }, [id, isAuthenticated]);

  const getStatusConfig = (status?: string) => {
    const config = {
      DRAFT: { color: "default", text: "Bản nháp", icon: <ClockCircleOutlined /> },
      UPCOMING: { color: "blue", text: "Sắp diễn ra", icon: <ClockCircleOutlined /> },
      REGISTRATION: { color: "green", text: "Đang đăng ký", icon: <CheckCircleOutlined /> },
      LIVE: { color: "orange", text: "Đang diễn ra", icon: <PlayCircleOutlined /> },
      COMPLETED: { color: "default", text: "Đã kết thúc", icon: <TrophyOutlined /> },
    };
    return config[status as keyof typeof config] || config.UPCOMING;
  };

  const getStatusTag = useCallback((status?: string) => {
    const config = getStatusConfig(status);
    return (
      <Tag color={config.color} icon={config.icon} style={{ margin: 0 }}>
        {config.text}
      </Tag>
    );
  }, []);

  const getMatchStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "ongoing":
        return <PlayCircleOutlined style={{ color: "#1890ff" }} />;
      default:
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
    }
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      localStorage.setItem('redirect_url', `/tournaments/${id}/register`);
    }
    navigate(`/tournaments/${id}/register`);
  };

  const renderRegisterButton = useCallback(() => {
    if (!isAuthenticated) {
      return (
        <ProtectedButton
          type="primary"
          size="large"
          block
          style={{
            marginTop: 16,
            background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
            border: "none",
            borderRadius: 8,
            height: 40,
          }}
          onClick={handleRegisterClick}
          authMessage="Đăng nhập để đăng ký tham gia giải đấu"
        >
          <LockOutlined style={{ marginRight: 8 }} />
          Đăng nhập để đăng ký
        </ProtectedButton>
      );
    }

    if (eligibility?.eligible === false) {
      return (
        <Button
          type="default"
          size="large"
          block
          disabled
          style={{ marginTop: 16, height: 40 }}
        >
          Không đủ điều kiện đăng ký
        </Button>
      );
    }

    const canRegister = eligibility?.canRegister !== false;

    return (
      <Button
        type="primary"
        size="large"
        block
        style={{
          marginTop: 16,
          background: canRegister 
            ? "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)"
            : "linear-gradient(135deg, #faad14 0%, #d48806 100%)",
          border: "none",
          borderRadius: 8,
          height: 40,
        }}
        onClick={() => navigate(`/tournaments/${id}/register`)}
        disabled={!canRegister}
      >
        {canRegister ? "Đăng ký tham gia ngay" : "Đã đủ đội"}
      </Button>
    );
  }, [isAuthenticated, eligibility, id, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div style={{ padding: 32, background: PAGE_BACKGROUND_COLOR, minHeight: "100vh" }}>
        <Alert
          message="Lỗi"
          description={error || "Không tìm thấy giải đấu"}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  const scheduleData = [
    {
      match: "Team Phoenix vs Dragon Warriors",
      time: "2025-10-05 18:00",
      stage: "Bán kết",
      status: "completed",
      score: "2-1",
    },
    {
      match: "Thunder Storm vs Shadow Hunters",
      time: "2025-10-06 20:00",
      stage: "Bán kết",
      status: "upcoming",
      score: null,
    },
  ];

  const participants = [
    "Team Phoenix", "Dragon Warriors", "Thunder Storm", "Shadow Hunters",
    "Ice Breakers", "Fire Starters", "Wind Riders", "Earth Shakers"
  ];

  return (
    <div style={{ padding: 24, background: PAGE_BACKGROUND_COLOR, minHeight: "100vh" }}>
      {/* Tournament Header */}
      <Card
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 16,
          border: "none",
          color: "white",
          marginBottom: 24,
        }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              {tournament.logoUrl && (
                <img 
                  src={tournament.logoUrl} 
                  alt="Logo" 
                  style={{ width: 64, height: 64, borderRadius: 8 }} 
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <Title level={2} style={{ color: "white", margin: 0 }}>
                    {tournament.name}
                  </Title>
                  {getStatusTag(tournament.status)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                    <TrophyOutlined style={{ marginRight: 8 }} />
                    {tournament.game}
                  </Text>
                  {tournament.organizer && (
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                      <UserOutlined style={{ marginRight: 8 }} />
                      {tournament.organizer.name}
                    </Text>
                  )}
                </div>
              </div>
            </div>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 16,
                marginBottom: 0,
              }}
            >
              {tournament.description}
            </Paragraph>
          </Col>
          
          <Col xs={24} md={8}>
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Statistic
                  title="Tổng giải thưởng"
                  value={formatCurrency(tournament.prizePool || 0)}
                  valueStyle={{ color: "white", fontSize: 20 }}
                  prefix={<DollarOutlined />}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Đội đã đăng ký"
                  value={tournament.approvedTeamsCount || 0}
                  suffix={`/ ${tournament.maxTeams || 0}`}
                  valueStyle={{ color: "white", fontSize: 20 }}
                  prefix={<TeamOutlined />}
                />
              </Col>
            </Row>
            {renderRegisterButton()}
            
            {eligibility && eligibility.remainingSlots !== undefined && (
              <div style={{ marginTop: 8 }}>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                  Còn {eligibility.remainingSlots} suất đăng ký
                </Text>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* Tabs Section */}
      <Card
        style={{
          background: CARD_BACKGROUND_COLOR,
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: 24,
        }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tổng quan" key="overview">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card 
                  title={
                    <Space>
                      <CalendarOutlined style={{ color: "#1890ff" }} />
                      <Text strong>Thời gian giải đấu</Text>
                    </Space>
                  }
                  style={{ height: '100%' }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Thời gian đăng ký:</Text>
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">
                          {tournament.registrationStart 
                            ? `${formatDate(toDate(tournament.registrationStart))} - ${formatDate(toDate(tournament.registrationEnd))}`
                            : 'Chưa có thông tin'
                          }
                        </Text>
                      </div>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div>
                      <Text strong>Thời gian thi đấu:</Text>
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">
                          {tournament.tournamentStart 
                            ? `${formatDate(toDate(tournament.tournamentStart))} - ${formatDate(toDate(tournament.tournamentEnd))}`
                            : 'Chưa có thông tin'
                          }
                        </Text>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card 
                  title={
                    <Space>
                      <TeamOutlined style={{ color: "#52c41a" }} />
                      <Text strong>Thông tin đăng ký</Text>
                    </Space>
                  }
                  style={{ height: '100%' }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text>Số đội tối đa:</Text>
                        <Text strong>{tournament.maxTeams} đội</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text>Số đội đã đăng ký:</Text>
                        <Text strong>{tournament.approvedTeamsCount || 0} đội</Text>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <Progress 
                          percent={tournament.registrationProgress ?? 0} 
                          size="small" 
                          status={(tournament.registrationProgress ?? 0) >= 100 ? "exception" : "active"}
                        />
                      </div>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div>
                      <Text strong>Phí tham gia:</Text>
                      <div style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 20, color: "#1890ff", fontWeight: 'bold' }}>
                          {(tournament as any).registrationFee ? `$${(tournament as any).registrationFee}` : 'Miễn phí'}
                        </Text>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Lịch thi đấu" key="schedule">
            <Card
              title={
                <Space>
                  <ScheduleOutlined style={{ color: "#1890ff" }} />
                  <Text strong>Lịch Thi Đấu</Text>
                </Space>
              }
            >
              {scheduleData.length > 0 ? (
                <Timeline>
                  {scheduleData.map((match, index) => (
                    <Timeline.Item
                      key={index}
                      dot={getMatchStatusIcon(match.status)}
                      color={
                        match.status === "completed"
                          ? "#52c41a"
                          : match.status === "ongoing"
                          ? "#1890ff"
                          : "#faad14"
                      }
                    >
                      <div style={{ padding: "8px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Text strong style={{ fontSize: 14 }}>
                            {match.match}
                          </Text>
                          {match.score && (
                            <Badge count={match.score} style={{ backgroundColor: '#52c41a' }} />
                          )}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                          {match.stage}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {match.time}
                        </Text>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <ClockCircleOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                  <Text type="secondary">Lịch thi đấu sẽ được cập nhật sớm</Text>
                </div>
              )}
            </Card>
          </TabPane>

          <TabPane tab="Đội tham gia" key="participants">
            <Card
              title={
                <Space>
                  <TeamOutlined style={{ color: "#52c41a" }} />
                  <Text strong>Đội Tham Gia ({participants.length})</Text>
                </Space>
              }
            >
              <Row gutter={[8, 8]}>
                {participants.map((participant, index) => (
                  <Col xs={12} sm={8} md={6} key={index}>
                    <div
                      style={{
                        padding: "12px",
                        background: "#fafafa",
                        borderRadius: 8,
                        textAlign: "center",
                        border: "1px solid #f0f0f0",
                        height: '100%',
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>{participant}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </TabPane>

          <TabPane tab="Thể lệ" key="rules">
            <Card
              title={
                <Space>
                  <FlagOutlined style={{ color: "#faad14" }} />
                  <Text strong>Thể lệ giải đấu</Text>
                </Space>
              }
            >
              {(Array.isArray((tournament as any).rules) && (tournament as any).rules.length > 0) ? (
                <List
                  dataSource={(tournament as any).rules}
                  renderItem={(rule: any, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Text strong>{index + 1}.</Text>}
                        title={<Text strong>{rule.title}</Text>}
                        description={rule.content}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <FlagOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                  <Text type="secondary">Thể lệ giải đấu sẽ được cập nhật sớm</Text>
                </div>
              )}
            </Card>
          </TabPane>

          <TabPane tab="Bảng đấu" key="brackets">
            <Card
              title={
                <Space>
                  <BankOutlined style={{ color: "#faad14" }} />
                  <Text strong>Bảng Đấu & Kết Quả</Text>
                </Space>
              }
            >
              {!isAuthenticated ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <LockOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
                  <Title level={4} style={{ marginBottom: 16 }}>
                    Nội dung bị khóa
                  </Title>
                  <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
                    Vui lòng đăng nhập để xem bảng đấu và kết quả chi tiết
                  </Text>
                  <ProtectedButton
                    type="primary"
                    size="large"
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                    }}
                    onClick={() => {}}
                    authMessage="Đăng nhập để xem bảng đấu và kết quả"
                  >
                    <LockOutlined style={{ marginRight: 8 }} />
                    Đăng nhập để xem
                  </ProtectedButton>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                  <Text type="secondary">Bảng đấu sẽ được cập nhật khi giải đấu bắt đầu</Text>
                </div>
              )}
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* Quick Stats */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Định dạng"
              value={tournament.format || 'Single Elimination'}
              prefix={<BankOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ fontSize: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Trạng thái đăng ký"
              value={tournament.registrationStatus || 'Đang mở'}
              prefix={<EyeOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ fontSize: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Loại giải đấu"
              value={tournament.type || 'Elimination'}
              prefix={<EnvironmentOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ fontSize: 16 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Actions for Authenticated Users */}
      {isAuthenticated && (
        <Card
          style={{
            marginTop: 24,
            borderRadius: 16,
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={16}>
              <Title level={4} style={{ margin: 0 }}>
                Đã sẵn sàng tham gia?
              </Title>
              <Text type="secondary">
                Hoàn tất đăng ký để chính thức tham gia giải đấu này
              </Text>
            </Col>
            <Col xs={24} md={8}>
              {renderRegisterButton()}
            </Col>
          </Row>
        </Card>
      )}

      {/* Login Prompt for Non-Authenticated Users */}
      {!isAuthenticated && (
        <Card
          style={{
            marginTop: 24,
            borderRadius: 16,
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={16}>
              <Space direction="vertical" size={8}>
                <Title level={4} style={{ margin: 0 }}>
                  🔓 Mở khóa toàn bộ tính năng
                </Title>
                <Text>
                  Đăng nhập để:
                </Text>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Xem bảng đấu và kết quả chi tiết</li>
                  <li>Đăng ký tham gia giải đấu</li>
                  <li>Theo dõi trận đấu yêu thích</li>
                  <li>Nhận thông báo khi có kết quả mới</li>
                </ul>
              </Space>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <ProtectedButton
                type="primary"
                size="large"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: 8,
                  padding: '0 32px',
                }}
                onClick={() => {
                  localStorage.setItem('redirect_url', window.location.pathname);
                }}
                authMessage="Đăng nhập để truy cập tất cả tính năng"
              >
                <LockOutlined style={{ marginRight: 8 }} />
                Đăng nhập ngay
              </ProtectedButton>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};
import React, { useState, useEffect } from "react";
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Tag, 
  Button, 
  Space, 
  Spin, 
  Alert, 
  Progress, 
  Tabs, 
  Badge,
  Statistic,
  List,
  Avatar,
  Divider,
  Modal,
  Form,
  Select,
  message,
  Steps,
  Descriptions
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  EyeOutlined,
  TeamOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TrophyOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  SettingOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  SafetyOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowLeftOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { Tournament } from "@/common/interfaces/tournament/tournament";
import { formatCurrency, formatDate, formatDateShort, getFormatText, getGameIcon, getMatchStatus, getStatusColor, getStatusText } from "@/helper/tournament/tournament";
import { tournamentService } from "@/services/tournamentService";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Step } = Steps;
const { Countdown: AntdCountdown } = Statistic;

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [countdownTarget, setCountdownTarget] = useState<number>();

  // Mock user data - in real app, get from auth context
  const currentUser = { id: "user1", name: "Người dùng", isAuthenticated: true };

  useEffect(() => {
    fetchTournament();
    fetchUserTeams();
    console.log(tournament);
  }, [id]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      if (id) {
        const response = await tournamentService.getById(id);
        setTournament(response.data.data || response.data);
        if (response.data.data?.registrationEnd) {
          const endTime = new Date(response.data.data.registrationEnd).getTime();
          setCountdownTarget(endTime);
        }
        console.log(`Tải giải đấu thành công!`);
        console.log(tournament);
      }
      else
        message.error(`Không thể đọc được id: ${id}`);
      
    } catch (err: any) {
      console.error("Error fetching tournament:", err);
      setError(err.response?.data?.message || "Không thể tải thông tin giải đấu");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTeams = async () => {
    // Mock API call to get user's teams
    setUserTeams([
      { id: "team1", name: "Team Alpha", tag: "ALP", members: 5, maxMembers: 5 },
      { id: "team2", name: "Team Bravo", tag: "BRV", members: 3, maxMembers: 5 },
      { id: "team3", name: "Team Charlie", tag: "CHL", members: 1, maxMembers: 1 },
    ]);
  };

  const handleRegister = async () => {
    if (!selectedTeam) {
      message.warning("Vui lòng chọn đội để đăng ký");
      return;
    }

    setRegisterLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success("Đã gửi đăng ký tham gia giải đấu!");
      setRegisterModalVisible(false);
      
      // Refresh tournament data
      fetchTournament();
    } catch (err) {
      message.error("Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? "Đã bỏ theo dõi giải đấu" : "Đã theo dõi giải đấu");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tournament?.name,
        text: tournament?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success("Đã sao chép link vào clipboard!");
    }
  };

  const renderStatusBadge = () => {
    if (!tournament) return null;
    
    return (
      <Badge 
        status="processing" 
        text={
          <Tag color={getStatusColor(tournament.status)} style={{ fontWeight: 600 }}>
            {getStatusText(tournament.status)}
          </Tag>
        }
      />
    );
  };

  const renderCountdown = () => {
    if (!tournament || !countdownTarget) return null;
    
    const now = Date.now();
    const registrationEnd = new Date(tournament.registrationEnd || "").getTime();
    
    if (now > registrationEnd) return null;
    
    return (
      <Card 
        style={{ 
          marginBottom: 24,
          background: "linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)",
          border: "1px solid #91d5ff"
        }}
      >
        <Row align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Title level={5} style={{ margin: 0 }}>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              Thời gian đăng ký còn lại
            </Title>
            <Text type="secondary">
              Đăng ký trước {formatDate(tournament.registrationEnd)}
            </Text>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ textAlign: "center" }}>
              <AntdCountdown
                title=""
                value={countdownTarget}
                onFinish={() => {
                  message.info("Đã hết thời gian đăng ký!");
                  fetchTournament();
                }}
                format="D ngày H giờ m phút"
                style={{ fontSize: "18px", fontWeight: "bold" }}
              />
              <Progress
                percent={tournament.registrationProgress}
                status={tournament.registrationProgress >= 100 ? "exception" : "active"}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
              />
              <Text type="secondary">
                {tournament.approvedTeamsCount}/{tournament.maxTeams} đội đã đăng ký
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  const renderOverviewTab = () => {
    if (!tournament) return null;
    
    return (
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Thông tin chi tiết" style={{ marginBottom: 24 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Thể thức">
                {getFormatText(tournament.format)}
              </Descriptions.Item>
              <Descriptions.Item label="Số đội tối đa">
                {tournament.maxTeams} đội
              </Descriptions.Item>
              <Descriptions.Item label="Quy mô đội">
                {tournament.minTeamSize}-{tournament.maxTeamSize} người/đội
                {tournament.allowIndividual && " (Cho phép cá nhân)"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">
                {tournament.venue || tournament.city || "Online"}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {formatDate(tournament.tournamentStart)} - {formatDate(tournament.tournamentEnd)}
              </Descriptions.Item>
              <Descriptions.Item label="Đăng ký">
                {formatDate(tournament.registrationStart)} - {formatDate(tournament.registrationEnd)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Mô tả" style={{ marginBottom: 24 }}>
            <div style={{ whiteSpace: "pre-line" }}>
              {tournament.description || "Không có mô tả chi tiết."}
            </div>
          </Card>

          {tournament.rules && (
            <Card title="Luật lệ giải đấu">
              <div style={{ whiteSpace: "pre-line" }}>
                {tournament.rules}
              </div>
            </Card>
          )}
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Giải thưởng" style={{ marginBottom: 24 }}>
            <div style={{ textAlign: "center" }}>
              <TrophyOutlined style={{ fontSize: 48, color: "#faad14", marginBottom: 16 }} />
              <Title level={2} style={{ color: "#faad14" }}>
                {formatCurrency(tournament.prizePool)}
              </Title>
              {tournament.prizeGuaranteed && (
                <Tag color="gold" style={{ marginTop: 8 }}>
                  <CheckCircleOutlined /> Giải thưởng được đảm bảo
                </Tag>
              )}
            </div>
            
            <Divider />
            
            <Title level={5}>Phân bổ giải thưởng</Title>
            <List
              size="small"
              dataSource={[
                { rank: "1st", prize: tournament.prizePool * 0.5, color: "#ffd700" },
                { rank: "2nd", prize: tournament.prizePool * 0.3, color: "#c0c0c0" },
                { rank: "3rd", prize: tournament.prizePool * 0.2, color: "#cd7f32" },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Space style={{ width: "100%" }} align="center">
                    <Badge color={item.color} text={<Text strong>Hạng {item.rank}</Text>} />
                    <Text strong>{formatCurrency(item.prize)}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card title="Phí đăng ký" style={{ marginBottom: 24 }}>
            <div style={{ textAlign: "center" }}>
              <DollarOutlined style={{ fontSize: 32, color: "#52c41a" }} />
              <Title level={3} style={{ margin: "8px 0" }}>
                {formatCurrency(tournament.registrationFee)}
              </Title>
              <Text type="secondary">Mỗi đội</Text>
            </div>
          </Card>

          <Card title="Ban tổ chức">
            {tournament.organizer ? (
              <Space>
                <Avatar 
                  src={tournament.organizer.avatar} 
                  icon={<UserOutlined />}
                  size="large"
                />
                <div>
                  <Text strong>{tournament.organizer.username}</Text>
                  <br />
                  <Text type="secondary">{tournament.organizer.email}</Text>
                </div>
              </Space>
            ) : (
              <Text type="secondary">Không có thông tin</Text>
            )}
          </Card>
        </Col>
      </Row>
    );
  };

  const renderScheduleTab = () => {
    if (!tournament || !tournament.stages) return null;
    
    return (
      <div>
        {tournament.stages.map((stage) => (
          <Card key={stage.id} title={stage.name} style={{ marginBottom: 24 }}>
            <Steps current={0} size="small">
              <Step title="Đăng ký" description={formatDateShort(tournament.registrationEnd)} />
              <Step title="Kiểm tra" description="Sau đăng ký" />
              <Step title={stage.name} description={formatDateShort(stage.startDate)} />
              <Step title="Kết thúc" description={formatDateShort(tournament.tournamentEnd)} />
            </Steps>
            
            {stage.brackets && stage.brackets.map((bracket) => (
              <div key={bracket.id} style={{ marginTop: 24 }}>
                <Title level={5}>
                  {bracket.name} {bracket.isFinal && <CrownOutlined style={{ color: "#faad14" }} />}
                </Title>
                
                {bracket.matches && bracket.matches.length > 0 ? (
                  <List
                    dataSource={bracket.matches}
                    renderItem={(match) => {
                      const status = getMatchStatus(match.status);
                      return (
                        <List.Item
                          actions={[
                            <Tag color={status.color}>{status.text}</Tag>,
                            <Button 
                              type="link" 
                              icon={<EyeOutlined />}
                              onClick={() => navigate(`/matches/${match.id}`)}
                            >
                              Chi tiết
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar.Group>
                                <Avatar src={match.team1?.logoUrl}>{match.team1?.tag}</Avatar>
                                <Avatar src={match.team2?.logoUrl}>{match.team2?.tag}</Avatar>
                              </Avatar.Group>
                            }
                            title={`${match.team1?.name || "TBD"} vs ${match.team2?.name || "TBD"}`}
                            description={
                              <Space>
                                {match.scheduledTime && (
                                  <>
                                    <CalendarOutlined />
                                    <Text>{formatDate(match.scheduledTime)}</Text>
                                  </>
                                )}
                                {match.team1Score !== undefined && match.team2Score !== undefined && (
                                  <>
                                    <Divider type="vertical" />
                                    <Text strong>
                                      {match.team1Score} - {match.team2Score}
                                    </Text>
                                  </>
                                )}
                              </Space>
                            }
                          />
                        </List.Item>
                      );
                    }}
                  />
                ) : (
                  <Alert
                    message="Chưa có lịch thi đấu"
                    description="Lịch thi đấu sẽ được cập nhật sau khi đóng đăng ký"
                    type="info"
                    showIcon
                  />
                )}
              </div>
            ))}
          </Card>
        ))}
      </div>
    );
  };

  const renderTeamsTab = () => {
    if (!tournament || !tournament.registrations) return null;
    
    const approvedTeams = tournament.registrations.filter(r => 
      r.status === "APPROVED" || r.status === "CHECKED_IN"
    );
    
    return (
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Statistic 
              title="Đội đã đăng ký" 
              value={tournament.approvedTeamsCount} 
              prefix={<TeamOutlined />}
              suffix={`/ ${tournament.maxTeams}`}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic 
              title="Vị trí còn trống" 
              value={tournament.maxTeams - tournament.approvedTeamsCount}
              valueStyle={{ color: "#3f8600" }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic 
              title="Tiến độ" 
              value={Math.round(tournament.registrationProgress)}
              suffix="%"
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
        </Row>

        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={approvedTeams}
          renderItem={(registration) => (
            <List.Item>
              <Card hoverable>
                <div style={{ textAlign: "center" }}>
                  <Avatar 
                    src={registration.team.logoUrl} 
                    size={64}
                    icon={<TeamOutlined />}
                    style={{ marginBottom: 12 }}
                  />
                  <Title level={5} style={{ margin: "8px 0" }}>
                    {registration.team.name}
                  </Title>
                  <Tag color="blue">{registration.team.tag}</Tag>
                  <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                    Đăng ký: {formatDate(registration.registeredAt)}
                  </Text>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  };

  const renderResultsTab = () => {
    if (!tournament) return null;
    
    // Mock results
    const mockResults = [
      { position: 1, team: "Team Alpha", prize: formatCurrency(tournament.prizePool * 0.5) },
      { position: 2, team: "Team Bravo", prize: formatCurrency(tournament.prizePool * 0.3) },
      { position: 3, team: "Team Charlie", prize: formatCurrency(tournament.prizePool * 0.2) },
    ];
    
    return (
      <div>
        {tournament.status === "COMPLETED" ? (
          <Card title="Bảng xếp hạng cuối cùng">
            <List
              dataSource={mockResults}
              renderItem={(item, index) => (
                <List.Item
                  style={{ 
                    padding: "16px 24px",
                    backgroundColor: index < 3 ? (index === 0 ? "#fff7e6" : index === 1 ? "#f6ffed" : "#f9f0ff") : "white"
                  }}
                >
                  <Space style={{ width: "100%" }} align="center" >
                    <Space>
                      <Badge 
                        count={item.position} 
                        style={{ 
                          backgroundColor: index === 0 ? "#ffd700" : 
                                         index === 1 ? "#c0c0c0" : 
                                         index === 2 ? "#cd7f32" : "#d9d9d9"
                        }}
                      />
                      <Avatar src={`https://picsum.photos/seed/${item.team}/40`} />
                      <Text strong style={{ fontSize: "16px" }}>{item.team}</Text>
                    </Space>
                    <Space>
                      <TrophyOutlined style={{ color: index === 0 ? "#ffd700" : index === 1 ? "#c0c0c0" : "#cd7f32" }} />
                      <Text strong>{item.prize}</Text>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        ) : (
          <Alert
            message="Chưa có kết quả"
            description="Kết quả sẽ được cập nhật sau khi giải đấu kết thúc"
            type="info"
            showIcon
          />
        )}
      </div>
    );
  };

  const renderStreamTab = () => {
    if (!tournament) return null;
    
    return (
      <div>
        {tournament.streamUrl ? (
          <Card title="Stream trực tiếp">
            <div style={{ textAlign: "center" }}>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: 16 }}>
                <iframe
                  src={tournament.streamUrl}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "8px"
                  }}
                  allowFullScreen
                />
              </div>
              <Button 
                type="primary" 
                icon={<VideoCameraOutlined />}
                href={tournament.streamUrl}
                target="_blank"
              >
                Mở trên Twitch/YouTube
              </Button>
            </div>
          </Card>
        ) : (
          <Alert
            message="Chưa có stream"
            description="Link stream sẽ được cập nhật khi giải đấu bắt đầu"
            type="info"
            showIcon
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
        <Text style={{ display: "block", marginTop: 16, fontSize: "16px" }}>
          Đang tải thông tin giải đấu...
        </Text>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <Alert
        message="Không tìm thấy giải đấu"
        description={error || "Giải đấu không tồn tại hoặc đã bị xóa"}
        type="error"
        showIcon
        style={{ margin: "40px 0" }}
        action={
          <Button type="primary" onClick={() => navigate("/tournaments")}>
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  const canRegister = tournament.status === "registration_open" && 
                     currentUser.isAuthenticated &&
                     tournament.approvedTeamsCount < tournament.maxTeams;
console.log(tournament);
  return (
    <div style={{ padding: "0 24px" }}>
      {/* Back button */}
      {/* Back button */}
  <Button 
    type="link" 
    icon={<ArrowLeftOutlined />}
    onClick={() => navigate(-1)}
    style={{ marginBottom: 16, paddingLeft: 0 }}
  >
    Quay lại
  </Button>

  {/* Tournament Header */}
  <div
    style={{
      position: "relative",
      marginBottom: 24,
      borderRadius: 12,
      overflow: "hidden",
      minHeight: 300,
    }}
  >
    {/* Banner Background with Overlay */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: tournament.bannerUrl 
          ? `url(${tournament.bannerUrl})`
          : "linear-gradient(135deg, #722ed1 0%, #1677ff 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>

    {/* Content */}
    <div style={{ position: "relative", zIndex: 1, padding: "32px 24px" }}>
      <Row gutter={[24, 24]} align="middle">
        {/* Logo and Basic Info */}
        <Col xs={24} md={18}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Space wrap>
              {renderStatusBadge()}
              <Tag 
                color="purple" 
                style={{ 
                  fontSize: "14px", 
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                }}
              >
                {getGameIcon(tournament.game)} {tournament.game}
              </Tag>
            </Space>
            
            {/* Tournament Name with Logo */}
            <Space align="center" style={{ flexWrap: "wrap" }}>
              {tournament.logoUrl && (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "4px solid rgba(255,255,255,0.3)",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                  }}
                >
                  <img
                    src={tournament.logoUrl}
                    alt={tournament.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.innerHTML = 
                        `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #722ed1 0%, #1677ff 100%); color: white; font-weight: bold; font-size: 20px;">${tournament.name.charAt(0)}</div>`;
                    }}
                  />
                </div>
              )}
              
              <div>
                <Title level={1} style={{ color: "white", margin: 0, lineHeight: 1.2 }}>
                  {tournament.name}
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", display: "block", marginTop: 8 }}>
                  {tournament.description}
                </Text>
              </div>
            </Space>
            
            {/* Tournament Details */}
            <Space size="large" wrap style={{ marginTop: 16 }}>
              <Space>
                <CalendarOutlined style={{ color: "#ffa940", fontSize: 16 }} />
                <Text style={{ color: "white", fontWeight: 500 }}>
                  {formatDate(tournament.tournamentStart)} - {formatDateShort(tournament.tournamentEnd)}
                </Text>
              </Space>
              <Space>
                <EnvironmentOutlined style={{ color: "#52c41a", fontSize: 16 }} />
                <Text style={{ color: "white", fontWeight: 500 }}>
                  {tournament.venue || tournament.city || "Online"}
                </Text>
              </Space>
              <Space>
                <TeamOutlined style={{ color: "#1890ff", fontSize: 16 }} />
                <Text style={{ color: "white", fontWeight: 500 }}>
                  {tournament.approvedTeamsCount}/{tournament.maxTeams} đội
                </Text>
              </Space>
              {tournament.registrationFee > 0 && (
                <Space>
                  <DollarOutlined style={{ color: "#faad14", fontSize: 16 }} />
                  <Text style={{ color: "white", fontWeight: 500 }}>
                    Phí: {formatCurrency(tournament.registrationFee)}
                  </Text>
                </Space>
              )}
              <Space>
                <TrophyOutlined style={{ color: "#ffd666", fontSize: 16 }} />
                <Text style={{ color: "white", fontWeight: 500 }}>
                  Giải: {formatCurrency(tournament.prizePool)}
                </Text>
              </Space>
            </Space>

            {/* Registration Progress Bar */}
            {tournament.maxTeams > 0 && (
              <div style={{ marginTop: 16, maxWidth: 400 }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  marginBottom: 4,
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.9)",
                }}>
                  <Space size={4}>
                    <UserOutlined style={{ fontSize: 12 }} />
                    <Text style={{color: "white"}}>Tiến độ đăng ký</Text>
                  </Space>
                  <Text style={{color: "white"}}>
                    {Math.round(tournament.registrationProgress)}% ({tournament.approvedTeamsCount}/{tournament.maxTeams})
                  </Text>
                </div>
                <Progress
                  percent={tournament.registrationProgress}
                  strokeColor={
                    tournament.registrationProgress >= 100 
                      ? "#ff4d4f" 
                      : "#52c41a"
                  }
                  trailColor="rgba(255,255,255,0.2)"
                  showInfo={false}
                  style={{ marginBottom: 0 }}
                />
              </div>
            )}
          </Space>
        </Col>
        
        {/* Action Buttons */}
        <Col xs={24} md={6}>
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Button
              type="primary"
              size="large"
              block
              icon={<TeamOutlined />}
              onClick={() => canRegister ? setRegisterModalVisible(true) : message.info("Đã hết thời gian đăng ký")}
              disabled={!canRegister}
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                background: canRegister 
                  ? "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)"
                  : "#d9d9d9",
                border: "none",
              }}
            >
              {canRegister ? "Đăng ký ngay" : "Đã đóng đăng ký"}
            </Button>
            
            <Space style={{ width: "100%" }} direction="vertical">
              <Button 
                icon={isFavorite ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
                onClick={handleFavorite}
                block
                style={{ 
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.1)",
                  height: 40,
                }}
              >
                {isFavorite ? "Đang theo dõi" : "Theo dõi"}
              </Button>
              
              <Button 
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                block
                style={{ 
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.1)",
                  height: 40,
                }}
              >
                Chia sẻ
              </Button>
              
              {tournament.organizer?.id === currentUser.id && (
                <Button 
                  icon={<SettingOutlined />}
                  onClick={() => navigate(`/tournaments/${tournament.id}/manage`)}
                  block
                  style={{ 
                    color: "white",
                    borderColor: "rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.1)",
                    height: 40,
                  }}
                >
                  Quản lý giải đấu
                </Button>
              )}
            </Space>

            {/* Organizer Info */}
            {tournament.organizer && (
              <Card
                size="small"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  marginTop: 8,
                }}
                bodyStyle={{ padding: 12 }}
              >
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                    Ban tổ chức
                  </Text>
                  <Space>
                    {tournament.organizer.avatar ? (
                      <Avatar 
                        src={tournament.organizer.avatar} 
                        size="small"
                      />
                    ) : (
                      <Avatar 
                        size="small"
                        style={{ backgroundColor: "#722ed1" }}
                      >
                        {tournament.organizer.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                    <Text style={{ color: "white", fontWeight: 500 }}>
                      {tournament.organizer.username}
                    </Text>
                  </Space>
                </Space>
              </Card>
            )}
          </Space>
        </Col>
      </Row>
    </div>
  </div>


      {/* Countdown Timer */}
      {renderCountdown()}

      {/* Main Content Tabs */}
      <Card>
  <Tabs
    activeKey={activeTab}
    onChange={setActiveTab}
    type="card"
    items={[
      {
        key: "overview",
        label: (
          <span>
            <EyeOutlined />
            Tổng quan
          </span>
        ),
        children: renderOverviewTab(),
      },
      {
        key: "schedule",
        label: (
          <span>
            <ScheduleOutlined />
            Lịch thi đấu
          </span>
        ),
        children: renderScheduleTab(),
      },
      {
        key: "teams",
        label: (
          <span>
            <TeamOutlined />
            Đội tham gia
            <Badge count={tournament.approvedTeamsCount} style={{ marginLeft: 8 }} />
          </span>
        ),
        children: renderTeamsTab(),
      },
      {
        key: "results",
        label: (
          <span>
            <BarChartOutlined />
            Kết quả
          </span>
        ),
        children: renderResultsTab(),
      },
      {
        key: "stream",
        label: (
          <span>
            <VideoCameraOutlined />
            Stream
          </span>
        ),
        children: renderStreamTab(),
      },
      {
        key: "rules",
        label: (
          <span>
            <SafetyOutlined />
            Luật lệ
          </span>
        ),
        children: (
          <Card>
            <div style={{ whiteSpace: "pre-line", padding: "0 16px" }}>
              {tournament.rules || "Chưa có luật lệ chi tiết."}
            </div>
          </Card>
        ),
      },
      {
        key: "faq",
        label: (
          <span>
            <QuestionCircleOutlined />
            FAQ
          </span>
        ),
        children: (
          <Card title="Câu hỏi thường gặp">
            <List
              dataSource={[
                {
                  question: "Làm thế nào để đăng ký tham gia?",
                  answer: "Nhấn nút 'Đăng ký ngay' và chọn đội của bạn để đăng ký tham gia.",
                },
                {
                  question: "Khi nào giải đấu bắt đầu?",
                  answer: `Giải đấu sẽ bắt đầu vào ${formatDate(tournament.tournamentStart)}.`,
                },
                {
                  question: "Lệ phí đăng ký có được hoàn lại không?",
                  answer: "Lệ phí đăng ký sẽ không được hoàn lại sau khi đã đăng ký thành công.",
                },
                {
                  question: "Tôi có thể thay đổi thông tin đội sau khi đăng ký không?",
                  answer:
                    "Có thể thay đổi thông tin đội trước khi giải đấu bắt đầu. Liên hệ ban tổ chức để được hỗ trợ.",
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.question}</Text>}
                    description={item.answer}
                  />
                </List.Item>
              )}
            />
          </Card>
        ),
      },
    ]}
  />
</Card>


      {/* Registration Modal */}
      <Modal
        title="Đăng ký tham gia giải đấu"
        open={registerModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setRegisterModalVisible(false)}>
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={registerLoading}
            onClick={handleRegister}
            disabled={!selectedTeam}
          >
            Xác nhận đăng ký
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Chọn đội của bạn" required>
            <Select
              placeholder="Chọn đội để đăng ký"
              onChange={(value) => setSelectedTeam(value)}
              value={selectedTeam}
            >
              {userTeams.map((team) => (
                <Option key={team.id} value={team.id}>
                  <Space>
                    <Avatar size="small" src={`https://picsum.photos/seed/${team.id}/32`} />
                    {team.name} ({team.tag})
                    <Tag>{team.members}/{team.maxMembers} thành viên</Tag>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Alert
            message="Thông tin quan trọng"
            description={
              <>
                <div>• Lệ phí đăng ký: <Text strong>{formatCurrency(tournament.registrationFee)}</Text></div>
                <div>• Sau khi đăng ký, bạn sẽ không thể hủy hoặc thay đổi đội</div>
                <div>• Ban tổ chức sẽ xét duyệt đăng ký trong vòng 24h</div>
              </>
            }
            type="warning"
            showIcon
          />
        </Form>
      </Modal>
    </div>
  );
};
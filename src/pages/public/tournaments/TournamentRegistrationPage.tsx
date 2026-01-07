import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Steps,
  message,
  Divider,
  Tag,
  Alert,
  Radio,
  Upload,
  Space,
  Modal,
  Spin,
  Empty,
  Progress,
  Badge,
  Descriptions,
  List,
} from "antd";
import {
  TeamOutlined,
  TrophyOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { teamService } from "@/services/teamService";
import { tournamentService } from "@/services/tournamentService";
import type { 
  Team, 
  Tournament,
} from "@/common/types";
import type { TeamMember } from "@/common/types/team";
import type { EligibilityResponse, RegistrationStatusResponse } from "@/common/interfaces/tournament/tournament";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

export const TournamentRegistrationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loadingTournament, setLoadingTournament] = useState(true);
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [teamMembersList, setTeamMembersList] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");
  
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatusResponse | null>(null);
  const [loadingRegistration, setLoadingRegistration] = useState(false);
  
  const [submittingRegistration, setSubmittingRegistration] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [cancellingRegistration, setCancellingRegistration] = useState(false);

  const steps = [
    {
      title: "Thông tin giải đấu",
      description: "Xem thông tin và kiểm tra điều kiện",
    },
    {
      title: "Chọn đội",
      description: "Chọn đội có sẵn hoặc tạo đội mới",
    },
    {
      title: "Xác nhận đăng ký",
      description: "Kiểm tra và xác nhận thông tin",
    },
  ];

  // Load tournament data
  useEffect(() => {
    if (id) {
      loadTournamentData();
    }
  }, [id]);

  // Load user teams when on step 1
  useEffect(() => {
    if (currentStep === 1) {
      loadUserTeams();
    }
  }, [currentStep]);

  // Load team members when team is selected
  useEffect(() => {
    if (selectedTeam && currentStep === 1) {
      loadTeamMembers(selectedTeam);
      checkRegistrationStatus(selectedTeam);
    }
  }, [selectedTeam, currentStep]);

  const loadTournamentData = async () => {
    try {
      setLoadingTournament(true);
      const response = await tournamentService.getById(id!);
      const tournamentData = response.data;
      
      // Check eligibility after loading tournament
      await checkEligibility();
      
      setTournament(tournamentData);
    } catch (error: any) {
      message.error("Không thể tải thông tin giải đấu");
      navigate("/tournaments");
    } finally {
      setLoadingTournament(false);
    }
  };

  const checkEligibility = async () => {
    try {
      setLoadingEligibility(true);
      const response = await tournamentService.checkEligibility(id!);
      setEligibility(response.data);
    } catch (error: any) {
      console.error("Lỗi kiểm tra điều kiện:", error);
    } finally {
      setLoadingEligibility(false);
    }
  };

  const checkRegistrationStatus = async (teamId: string) => {
    try {
      setLoadingRegistration(true);
      const response = await tournamentService.getRegistrationStatus(id!, teamId);
      setRegistrationStatus(response.data);
    } catch (error: any) {
      console.error("Lỗi kiểm tra trạng thái đăng ký:", error);
    } finally {
      setLoadingRegistration(false);
    }
  };

  const loadUserTeams = async () => {
    try {
      setLoadingTeams(true);
      const response = await teamService.getMyTeams();
      setTeams(response.data || []);

      if (response.data?.length > 0 && !selectedTeam) {
        setSelectedTeam(response.data[0].id);
      }
    } catch (error: any) {
      message.error(error.message || "Không thể tải danh sách đội");
    } finally {
      setLoadingTeams(false);
    }
  };

  const loadTeamMembers = async (teamId: string) => {
    try {
      setLoadingMembers(true);
      // Giả sử teamService có hàm getTeamMembers
      const response = await teamService.getTeamMembers(teamId);
      setTeamMembersList(response.data || []);
    } catch (error: any) {
      console.error("Không thể tải danh sách thành viên:", error);
      setTeamMembersList([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const getTournamentStatusInfo = (status: string) => {
    switch (status) {
      case 'draft':
        return { text: 'Bản nháp', color: 'default', badge: 'default' };
      case 'announced':
        return { text: 'Đã công bố', color: 'blue', badge: 'processing' };
      case 'registration_open':
        return { text: 'Đang mở đăng ký', color: 'green', badge: 'success' };
      case 'upcoming':
        return { text: 'Sắp diễn ra', color: 'orange', badge: 'warning' };
      case 'registration_closed':
        return { text: 'Đã đóng đăng ký', color: 'red', badge: 'error' };
      case 'live':
        return { text: 'Đang diễn ra', color: 'red', badge: 'processing' };
      case 'completed':
        return { text: 'Đã kết thúc', color: 'purple', badge: 'default' };
      case 'cancelled':
        return { text: 'Đã hủy', color: 'gray', badge: 'default' };
      default:
        return { text: status, color: 'default', badge: 'default' };
    }
  };

  const isRegistrationOpen = () => {
    if (!tournament) return false;
    
    // Chỉ các trạng thái này mới cho phép đăng ký
    const registrationOpenStatuses = ['registration_open', 'announced', 'upcoming'];
    
    // Kiểm tra trạng thái
    if (!registrationOpenStatuses.includes(tournament.status)) {
      return false;
    }
    
    // Kiểm tra thời gian đăng ký
    const now = new Date();
    if (tournament.registrationStart && now < new Date(tournament.registrationStart)) {
      return false;
    }
    
    if (tournament.registrationEnd && now > new Date(tournament.registrationEnd)) {
      return false;
    }
    
    // Kiểm tra số slot còn lại
    const availableSlots = tournament.availableSlots || 
                          (tournament.maxTeams - (tournament.registrationStats?.approved || 0));
    return availableSlots > 0;
  };

  const handleCreateTeam = async (values: any) => {
    try {
      setCreatingTeam(true);
      const teamData = {
        ...values,
        maxMembers: tournament?.maxTeamSize || 5,
        status: "active" as const,
      };

      const response = await teamService.createTeam(teamData);
      const newTeam = response.data;
      
      message.success("Tạo đội thành công!");
      setTeams((prev) => [newTeam, ...prev]);
      setSelectedTeam(newTeam.id);
      setShowCreateTeamModal(false);
      
      form.setFieldsValue({
        name: "",
        description: "",
      });
    } catch (error: any) {
      message.error(error.message || "Tạo đội thất bại");
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      if (!eligibility?.canRegister) {
        message.error("Bạn không đủ điều kiện để đăng ký giải đấu này");
        return;
      }
      
      // Kiểm tra thêm nếu giải đấu không mở đăng ký
      if (!isRegistrationOpen()) {
        const statusInfo = getTournamentStatusInfo(tournament?.status || '');
        message.error(`Giải đấu ${statusInfo.text.toLowerCase()}. Không thể đăng ký.`);
        return;
      }
    }
    
    if (currentStep === 1) {
      if (!selectedTeam) {
        message.error("Vui lòng chọn hoặc tạo một đội");
        return;
      }
      
      if (registrationStatus?.isRegistered) {
        message.error("Đội này đã đăng ký tham gia giải đấu");
        return;
      }
      
      // Kiểm tra số thành viên tối thiểu
      if (teamMembersList.length < (tournament?.minTeamSize || 1)) {
        message.error(`Đội cần tối thiểu ${tournament?.minTeamSize} thành viên để tham gia`);
        return;
      }
    }
    
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleRegisterForTournament = async () => {
    if (!selectedTeam || !id) return;
    
    try {
      setSubmittingRegistration(true);
      
      const response = await tournamentService.registerForTournament(id, {
        teamId: selectedTeam,
        registrationData: {
          note: "Đăng ký tham gia giải đấu",
          registeredAt: new Date().toISOString()
        }
      });
      
      message.success("Đăng ký thành công! Vui lòng chờ xác nhận từ ban tổ chức.");
      
      // Refresh data
      await Promise.all([
        loadTournamentData(),
        checkRegistrationStatus(selectedTeam)
      ]);
      
      // Move back to step 1 to show updated status
      setCurrentStep(1);
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      message.error(error.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setSubmittingRegistration(false);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedTeam || !id) return;
    
    try {
      setCheckingIn(true);
      
      await tournamentService.checkIn(id, {
        teamId: selectedTeam
      });
      
      message.success("Check-in thành công!");
      await checkRegistrationStatus(selectedTeam);
    } catch (error: any) {
      console.error("Lỗi check-in:", error);
      message.error(error.response?.data?.message || "Check-in thất bại");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!selectedTeam || !id) return;
    
    Modal.confirm({
      title: "Xác nhận hủy đăng ký",
      content: "Bạn có chắc chắn muốn hủy đăng ký tham gia giải đấu này không?",
      okText: "Xác nhận hủy",
      okType: "danger",
      cancelText: "Quay lại",
      onOk: async () => {
        try {
          setCancellingRegistration(true);
          
          await tournamentService.cancelRegistration(id, {
            teamId: selectedTeam,
            reason: "Người dùng tự hủy"
          });
          
          message.success("Đã hủy đăng ký thành công");
          
          // Refresh data
          await Promise.all([
            loadTournamentData(),
            checkRegistrationStatus(selectedTeam)
          ]);
        } catch (error: any) {
          console.error("Lỗi hủy đăng ký:", error);
          message.error(error.response?.data?.message || "Hủy đăng ký thất bại");
        } finally {
          setCancellingRegistration(false);
        }
      }
    });
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      team.description?.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const getRegistrationStatusTag = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return <Tag color="orange">Chờ duyệt</Tag>;
      case 'APPROVED':
        return <Tag color="green">Đã duyệt</Tag>;
      case 'REJECTED':
        return <Tag color="red">Từ chối</Tag>;
      case 'CANCELLED':
        return <Tag color="default">Đã hủy</Tag>;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingTournament) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải thông tin giải đấu..." />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Alert
          message="Không tìm thấy giải đấu"
          description="Giải đấu bạn tìm kiếm không tồn tại hoặc đã bị xóa."
          type="error"
          showIcon
        />
        <Button onClick={() => navigate('/tournaments')} style={{ marginTop: 20 }}>
          Quay lại danh sách giải đấu
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/tournaments/${id}`)}
          style={{ marginBottom: 16 }}
        >
          Quay lại giải đấu
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          Đăng Ký Tham Gia: {tournament.name}
        </Title>
        <Text type="secondary">
          Hoàn thành các bước đăng ký để tham gia giải đấu
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: Registration Form */}
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              marginBottom: 24,
            }}
          >
            {/* Steps */}
            <Steps current={currentStep} style={{ marginBottom: 48 }}>
              {steps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </Steps>

            {/* Step 0: Tournament Info and Eligibility Check */}
            {currentStep === 0 && (
              <div>
                <Title level={4} style={{ marginBottom: 24 }}>
                  Thông tin giải đấu
                </Title>

                {/* Tournament Status Alert */}
                {!isRegistrationOpen() && (
                  <Alert
                    message="Không thể đăng ký"
                    description={
                      <div>
                        <p>Giải đấu hiện đang ở trạng thái: 
                          <Tag color={getTournamentStatusInfo(tournament.status).color} style={{ marginLeft: 8 }}>
                            {getTournamentStatusInfo(tournament.status).text}
                          </Tag>
                        </p>
                        {tournament.registrationStart && tournament.registrationEnd && (
                          <p>
                            Thời gian đăng ký: {formatDate(tournament.registrationStart)} - {formatDate(tournament.registrationEnd)}
                          </p>
                        )}
                      </div>
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                )}

                <Descriptions 
                  column={{ xs: 1, sm: 2 }} 
                  bordered 
                  size="small"
                  style={{ marginBottom: 24 }}
                >
                  <Descriptions.Item label="Trạng thái">
                    <Badge 
                      status={getTournamentStatusInfo(tournament.status).badge as any} 
                      text={getTournamentStatusInfo(tournament.status).text}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Số đội tối đa">
                    {tournament.maxTeams}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số thành viên">
                    {tournament.minTeamSize}-{tournament.maxTeamSize} người
                  </Descriptions.Item>
                  <Descriptions.Item label="Đội đã đăng ký">
                    {tournament.registrationStats?.approved || 0}/{tournament.maxTeams}
                  </Descriptions.Item>
                  <Descriptions.Item label="Slot còn lại">
                    {tournament.availableSlots || Math.max(0, tournament.maxTeams - (tournament.registrationStats?.approved || 0))}
                  </Descriptions.Item>
                </Descriptions>

                {/* Eligibility Check */}
                {loadingEligibility ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <Spin tip="Đang kiểm tra điều kiện..." />
                  </div>
                ) : eligibility && (
                  <Card 
                    title="Kiểm tra điều kiện tham gia" 
                    style={{ marginBottom: 24 }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        {eligibility.canRegister ? (
                          <>
                            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24, marginRight: 8 }} />
                            <Text strong style={{ color: '#52c41a' }}>
                              Bạn có thể đăng ký tham gia giải đấu!
                            </Text>
                          </>
                        ) : (
                          <>
                            <CloseOutlined style={{ color: '#ff4d4f', fontSize: 24, marginRight: 8 }} />
                            <Text strong style={{ color: '#ff4d4f' }}>
                              Bạn không thể đăng ký tham gia
                            </Text>
                          </>
                        )}
                      </div>

                      {eligibility.reasons && eligibility.reasons.length > 0 && (
                        <Alert
                          message="Lý do không thể đăng ký:"
                          type="warning"
                          description={
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                              {eligibility.reasons.map((reason, index) => (
                                <li key={index}>{reason}</li>
                              ))}
                            </ul>
                          }
                          style={{ marginBottom: 16 }}
                        />
                      )}

                      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <div>
                          <Text strong>Slot còn lại:</Text>
                          <Title level={4} style={{ margin: 0 }}>
                            {eligibility.remainingSlots}
                          </Title>
                        </div>
                        <div>
                          <Text strong>Có thể đăng ký:</Text>
                          <Title level={4} style={{ 
                            margin: 0, 
                            color: eligibility.canRegister ? '#3f8600' : '#cf1322' 
                          }}>
                            {eligibility.canRegister ? 'Có' : 'Không'}
                          </Title>
                        </div>
                      </div>
                    </Space>
                  </Card>
                )}
              </div>
            )}

            {/* Step 1: Team Selection */}
            {currentStep === 1 && (
              <div>
                <Title level={4} style={{ marginBottom: 24 }}>
                  Chọn đội tham gia
                </Title>

                {/* Registration Status */}
                {registrationStatus?.isRegistered && (
                  <Card
                    style={{ 
                      marginBottom: 24,
                      borderLeft: '4px solid #1890ff',
                      backgroundColor: '#f6ffed'
                    }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>Trạng thái đăng ký:</Text>
                        {getRegistrationStatusTag(registrationStatus.status)}
                      </div>
                      
                      {registrationStatus.registration && (
                        <>
                          <Text>
                            Đã đăng ký lúc: {formatDate(registrationStatus.registration.registeredAt)}
                          </Text>
                          {registrationStatus.registration.approvedAt && (
                            <Text>
                              Đã duyệt lúc: {formatDate(registrationStatus.registration.approvedAt)}
                            </Text>
                          )}
                          {registrationStatus.registration.hasCheckedIn && (
                            <Text>
                              Đã check-in lúc: {formatDate(registrationStatus.registration.checkedInAt)}
                            </Text>
                          )}
                        </>
                      )}

                      <Space>
                        {registrationStatus.status === 'APPROVED' && 
                         !registrationStatus.registration?.hasCheckedIn && (
                          <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            loading={checkingIn}
                            onClick={handleCheckIn}
                          >
                            Check-in
                          </Button>
                        )}
                        
                        {(registrationStatus.status === 'PENDING' || 
                          registrationStatus.status === 'APPROVED') && (
                          <Button
                            danger
                            loading={cancellingRegistration}
                            onClick={handleCancelRegistration}
                          >
                            Hủy đăng ký
                          </Button>
                        )}
                      </Space>
                    </Space>
                  </Card>
                )}

                {/* Team Selection */}
                <Card
                  title={
                    <Space>
                      <TeamOutlined />
                      <span>Danh sách đội của bạn</span>
                      <Tag>{teams.length} đội</Tag>
                    </Space>
                  }
                  style={{ marginBottom: 24 }}
                  extra={
                    <Space>
                      <Input
                        placeholder="Tìm kiếm đội..."
                        prefix={<SearchOutlined />}
                        value={teamSearch}
                        onChange={(e) => setTeamSearch(e.target.value)}
                        style={{ width: 200 }}
                      />
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => setShowCreateTeamModal(true)}
                      >
                        Tạo đội mới
                      </Button>
                    </Space>
                  }
                >
                  {loadingTeams ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                      <Spin tip="Đang tải danh sách đội..." />
                    </div>
                  ) : filteredTeams.length === 0 ? (
                    <Empty
                      description={
                        <Space direction="vertical">
                          <Text>Bạn chưa có đội nào</Text>
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setShowCreateTeamModal(true)}
                          >
                            Tạo đội mới
                          </Button>
                        </Space>
                      }
                      style={{ padding: 40 }}
                    />
                  ) : (
                    <Radio.Group
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <List
                        dataSource={filteredTeams}
                        renderItem={(team) => (
                          <List.Item>
                            <Radio value={team.id} style={{ width: '100%' }}>
                              <Card
                                hoverable
                                style={{
                                  width: '100%',
                                  border: selectedTeam === team.id ? '2px solid #1890ff' : undefined,
                                }}
                                bodyStyle={{ padding: 16 }}
                              >
                                <Row align="middle" gutter={[16, 16]}>
                                  <Col xs={4} sm={3}>
                                    {team.logoUrl ? (
                                      <img
                                        src={team.logoUrl}
                                        alt={team.name}
                                        style={{
                                          width: 64,
                                          height: 64,
                                          borderRadius: '50%',
                                          objectFit: 'cover',
                                        }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          width: 64,
                                          height: 64,
                                          borderRadius: '50%',
                                          background: '#f0f0f0',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <TeamOutlined style={{ fontSize: 24, color: '#999' }} />
                                      </div>
                                    )}
                                  </Col>
                                  <Col xs={20} sm={21}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <div>
                                        <Title level={5} style={{ margin: 0 }}>
                                          {team.name}
                                        </Title>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                          {team.description || 'Chưa có mô tả'}
                                        </Text>
                                        <div style={{ marginTop: 8 }}>
                                          <Space wrap>
                                            <Tag color="blue">
                                              <TeamOutlined /> {teamMembersList.length}/{team.maxMembers} thành viên
                                            </Tag>
                                            {team.game && (
                                              <Tag color="purple">{team.game}</Tag>
                                            )}
                                          </Space>
                                        </div>
                                      </div>
                                      <div>
                                        {registrationStatus?.isRegistered && 
                                         registrationStatus.registration?.teamId === team.id && (
                                          <Tag color="green">Đã đăng ký</Tag>
                                        )}
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </Card>
                            </Radio>
                          </List.Item>
                        )}
                      />
                    </Radio.Group>
                  )}
                </Card>

                {/* Team Members Preview */}
                {selectedTeam && (
                  <Card
                    title={
                      <Space>
                        <UserOutlined />
                        <span>Thành viên đội</span>
                        <Tag>
                          {teamMembersList.length}/{tournament.maxTeamSize}
                        </Tag>
                      </Space>
                    }
                    style={{ marginBottom: 24 }}
                  >
                    {loadingMembers ? (
                      <div style={{ textAlign: 'center', padding: 40 }}>
                        <Spin tip="Đang tải thành viên..." />
                      </div>
                    ) : teamMembersList.length > 0 ? (
                      <Row gutter={[8, 8]}>
                        {teamMembersList.map((member) => (
                          <Col xs={24} sm={12} md={8} key={member.id}>
                            <Card
                              size="small"
                              style={{
                                borderLeft: member.role === 'CAPTAIN' ? '3px solid #1890ff' : undefined,
                              }}
                            >
                              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <Text strong style={{ fontSize: 14 }}>
                                    {member.inGameName || member.user?.fullname || 'Chưa có tên'}
                                  </Text>
                                  {member.role === 'CAPTAIN' && (
                                    <Tag color="blue" size="small">Đội trưởng</Tag>
                                  )}
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {member.user?.email}
                                </Text>
                                {member.gameRole && (
                                  <Tag color="purple" size="small">
                                    {member.gameRole}
                                  </Tag>
                                )}
                              </Space>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <Empty description="Đội chưa có thành viên nào" />
                    )}

                    {teamMembersList.length < (tournament.minTeamSize || 1) && (
                      <Alert
                        message="Cảnh báo"
                        description={`Đội cần tối thiểu ${tournament.minTeamSize} thành viên để tham gia giải đấu. Hiện tại có ${teamMembersList.length} thành viên.`}
                        type="warning"
                        showIcon
                        style={{ marginTop: 16 }}
                      />
                    )}
                  </Card>
                )}
              </div>
            )}

            {/* Step 2: Confirmation */}
            {currentStep === 2 && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <CheckCircleOutlined
                  style={{ fontSize: 64, color: "#52c41a", marginBottom: 24 }}
                />
                <Title level={3} style={{ marginBottom: 16 }}>
                  Xác nhận đăng ký
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: 32 }}>
                  Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
                </Paragraph>

                <Card style={{ textAlign: "left", marginBottom: 32 }}>
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="Giải đấu">
                      <Text strong>{tournament.name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Đội tham gia">
                      {teams.find(t => t.id === selectedTeam)?.name || 'Chưa chọn đội'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số thành viên">
                      <Text>{teamMembersList.length} người</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái đăng ký">
                      {registrationStatus?.isRegistered ? (
                        getRegistrationStatusTag(registrationStatus.status)
                      ) : (
                        <Tag color="blue">Chưa đăng ký</Tag>
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {teamMembersList.length < (tournament.minTeamSize || 1) && (
                  <Alert
                    message="Cảnh báo"
                    description={`Đội của bạn chỉ có ${teamMembersList.length} thành viên, trong khi yêu cầu tối thiểu là ${tournament.minTeamSize}. Vui lòng thêm thành viên trước khi đăng ký.`}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 32 }}
                  />
                )}

                <Alert
                  message="Lưu ý quan trọng"
                  description="Sau khi đăng ký, BTC sẽ liên hệ xác nhận. Bạn có thể theo dõi trạng thái đăng ký trong trang quản lý đội."
                  type="info"
                  showIcon
                  style={{ marginBottom: 32 }}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {currentStep > 0 ? (
                <Button onClick={handlePrevStep}>Quay lại</Button>
              ) : (
                <div />
              )}
              {currentStep < steps.length - 1 ? (
                <Button 
                  type="primary" 
                  onClick={handleNextStep}
                  disabled={currentStep === 0 && !eligibility?.canRegister}
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  onClick={handleRegisterForTournament}
                  loading={submittingRegistration}
                  disabled={!selectedTeam || registrationStatus?.isRegistered}
                >
                  {registrationStatus?.isRegistered ? 'Đã đăng ký' : 'Xác nhận đăng ký'}
                </Button>
              )}
            </div>
          </Card>
        </Col>

        {/* Right Column: Tournament Info */}
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 16,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              position: "sticky",
              top: 24,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {tournament.logoUrl ? (
                <img
                  src={tournament.logoUrl}
                  alt={tournament.name}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 8,
                    objectFit: "cover",
                    marginBottom: 16,
                  }}
                />
              ) : (
                <TrophyOutlined
                  style={{
                    fontSize: 48,
                    color: "#1890ff",
                    marginBottom: 16,
                  }}
                />
              )}
              <Title level={3} style={{ marginBottom: 8 }}>
                {tournament.name}
              </Title>
              <Tag color="blue" style={{ fontSize: 14 }}>
                {tournament.game}
              </Tag>
            </div>

            <Divider />

            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <div>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  Trạng thái
                </Text>
                <Tag color={getTournamentStatusInfo(tournament.status).color}>
                  {getTournamentStatusInfo(tournament.status).text}
                </Tag>
              </div>

              {tournament.prizePool && tournament.prizePool > 0 && (
                <div>
                  <Text strong style={{ display: "block", marginBottom: 4 }}>
                    <TrophyOutlined style={{ marginRight: 8 }} />
                    Giải thưởng
                  </Text>
                  <Title level={4} style={{ margin: 0, color: "#ff4d4f" }}>
                    ${tournament.prizePool.toLocaleString()}
                  </Title>
                </div>
              )}

              <div>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  Số đội đã đăng ký
                </Text>
                <Title level={4} style={{ margin: 0 }}>
                  {tournament.registrationStats?.approved || 0}/{tournament.maxTeams}
                </Title>
                <Progress 
                  percent={Math.round(((tournament.registrationStats?.approved || 0) / tournament.maxTeams) * 100)} 
                  size="small" 
                  status="active"
                  style={{ marginTop: 8 }}
                />
              </div>

              {tournament.tournamentStart && (
                <div>
                  <Text strong style={{ display: "block", marginBottom: 4 }}>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    Thời gian bắt đầu
                  </Text>
                  <Text style={{ fontSize: 16 }}>
                    {formatDate(tournament.tournamentStart)}
                  </Text>
                </div>
              )}

              {tournament.registrationStart && tournament.registrationEnd && (
                <div>
                  <Text strong style={{ display: "block", marginBottom: 4 }}>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    Thời gian đăng ký
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    {formatDate(tournament.registrationStart)} - {formatDate(tournament.registrationEnd)}
                  </Text>
                  {new Date() > new Date(tournament.registrationEnd) && (
                    <Tag color="red" style={{ marginTop: 4 }}>Đã kết thúc</Tag>
                  )}
                </div>
              )}

              {selectedTeam && currentStep >= 1 && (
                <div>
                  <Divider />
                  <Text strong style={{ display: "block", marginBottom: 4 }}>
                    <EyeOutlined style={{ marginRight: 8 }} />
                    Đội đã chọn
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    {teams.find((t) => t.id === selectedTeam)?.name}
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {teamMembersList.length}/{tournament.maxTeamSize} thành viên
                    </Text>
                  </div>
                </div>
              )}
            </Space>

            <Divider />

            <Alert
              message="Quy tắc giải đấu"
              description={
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
                  <li>Mỗi đội phải có ít nhất {tournament.minTeamSize} thành viên</li>
                  <li>Tuân thủ lịch thi đấu và quy tắc ứng xử</li>
                  <li>Không gian lận hoặc sử dụng phần mềm trợ giúp</li>
                  <li>Quyết định của BTC là cuối cùng</li>
                  <li>Liên hệ: {tournament.organizer?.email || 'support@esports.com'}</li>
                </ul>
              }
              type="warning"
              showIcon
            />
          </Card>
        </Col>
      </Row>

      {/* Create Team Modal */}
      <Modal
        title="Tạo đội mới"
        open={showCreateTeamModal}
        onCancel={() => setShowCreateTeamModal(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTeam}
          initialValues={{
            maxMembers: tournament?.maxTeamSize || 5,
            status: "active",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên đội"
                rules={[{ required: true, message: "Vui lòng nhập tên đội" }]}
              >
                <Input placeholder="VD: Dragon Warriors" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxMembers"
                label="Số thành viên tối đa"
                rules={[
                  { required: true, message: "Vui lòng nhập số thành viên" },
                  {
                    type: 'number',
                    min: tournament?.minTeamSize || 1,
                    message: `Tối thiểu ${tournament?.minTeamSize || 1} thành viên`
                  }
                ]}
              >
                <Input
                  type="number"
                  min={tournament?.minTeamSize || 1}
                  max={tournament?.maxTeamSize || 5}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả đội">
            <TextArea
              placeholder="Giới thiệu về đội, thành tích, phong cách chơi..."
              rows={3}
            />
          </Form.Item>

          <Form.Item name="logo" label="Logo đội (tùy chọn)">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              showUploadList={false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Định dạng: JPG, PNG, SVG. Tối đa 2MB
            </Text>
          </Form.Item>

          <Divider />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setShowCreateTeamModal(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={creatingTeam}>
              Tạo đội
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
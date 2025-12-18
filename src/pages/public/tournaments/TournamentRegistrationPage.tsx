// frontend/src/pages/public/TournamentRegistrationPage.tsx
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
} from "antd";
import {
  UploadOutlined,
  TeamOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TrophyOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { teamService } from "@/services/teamService";
import type { Team, TeamMember } from "@/common/types/team";
import { teamMemberService } from "@/services/team-memberService";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TextArea } = Input;
const { Search } = Input;

const mockTournamentInfo = {
  id: "1",
  name: "Esports Championship 2025",
  game: "Valorant",
  gameId: "valorant-id",
  prizePool: "$50,000",
  teams: "16/32",
  registrationDeadline: "2025-12-15",
  minTeamSize: 5,
  maxTeamSize: 7,
  entryFee: "$100",
  rules: [
    "Đội thi đấu phải có ít nhất 5 thành viên chính thức",
    "Tất cả thành viên phải trên 16 tuổi",
    "Mỗi đội được đăng ký tối đa 2 người dự bị",
    "Cam kết tham gia đầy đủ các trận đấu theo lịch",
    "Tuân thủ luật thi đấu và quy tắc ứng xử của giải",
  ],
};

export const TournamentRegistrationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [registrationType, setRegistrationType] = useState<"team" | "individual">("team");
  const [teamMembers, setTeamMembers] = useState([{ id: 1 }]);
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [teamMembersList, setTeamMembersList] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");

  const steps = [
    {
      title: "Chọn loại đăng ký",
      description: "Đăng ký đội hoặc cá nhân",
    },
    {
      title: "Chọn/Create đội",
      description: "Chọn đội có sẵn hoặc tạo đội mới",
    },
    {
      title: "Xác nhận đăng ký",
      description: "Kiểm tra và xác nhận thông tin",
    },
  ];

  useEffect(() => {
    if (currentStep === 1 && registrationType === "team") {
      loadUserTeams();
    }
  }, [currentStep, registrationType]);

  useEffect(() => {
    if (selectedTeam) {
      loadTeamMembers(selectedTeam);
    }
  }, [selectedTeam]);

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
      const response = await teamMemberService.getMembers(teamId, 'active');
      setTeamMembersList(response || []);
    } catch (error: any) {
      console.error("Không thể tải danh sách thành viên:", error);
      setTeamMembersList([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCreateTeam = async (values: any) => {
    try {
      setCreatingTeam(true);
      const teamData = {
        ...values,
        gameId: mockTournamentInfo.gameId,
        maxMembers: mockTournamentInfo.maxTeamSize,
        status: 'active' as const,
      };
      
      const newTeam = await teamService.createTeam(teamData);
      message.success("Tạo đội thành công!");
      
      // Thêm đội mới vào danh sách và chọn nó
      setTeams(prev => [newTeam, ...prev]);
      setSelectedTeam(newTeam.id);
      setShowCreateTeamModal(false);
      
      // Reset form tạo đội
      form.setFieldsValue({
        teamName: "",
        teamDescription: "",
      });
    } catch (error: any) {
      message.error(error.message || "Tạo đội thất bại");
    } finally {
      setCreatingTeam(false);
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
    team.description?.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const handleAddTeamMember = () => {
    if (teamMembers.length < mockTournamentInfo.maxTeamSize) {
      setTeamMembers([...teamMembers, { id: teamMembers.length + 1 }]);
    }
  };

  const handleRemoveTeamMember = (index: number) => {
    if (teamMembers.length > mockTournamentInfo.minTeamSize) {
      const newMembers = [...teamMembers];
      newMembers.splice(index, 1);
      setTeamMembers(newMembers);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (registrationType === "team") {
        if (!selectedTeam) {
          message.error("Vui lòng chọn hoặc tạo một đội");
          return;
        }
        setCurrentStep(2);
      } else {
        form
          .validateFields()
          .then(() => {
            setCurrentStep(2);
          })
          .catch(() => {
            message.error("Vui lòng điền đầy đủ thông tin");
          });
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitRegistration = async () => {
    try {
      message.loading("Đang xử lý đăng ký...", 0);
      
      // TODO: Gọi API đăng ký giải đấu với tournamentId và teamId
      // const response = await tournamentService.register(id!, selectedTeam);
      
      setTimeout(() => {
        message.destroy();
        message.success("Đăng ký thành công! Vui lòng chờ xác nhận từ ban tổ chức.");
        setTimeout(() => {
          navigate(`/tournaments/${id}`);
        }, 2000);
      }, 2000);
    } catch (error: any) {
      message.destroy();
      message.error(error.message || "Đăng ký thất bại");
    }
  };

  return (
    <div
      style={{
        padding: 24,
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
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
          Đăng Ký Tham Gia Giải Đấu
        </Title>
        <Text type="secondary">
          Hoàn thành các bước đăng ký để tham gia {mockTournamentInfo.name}
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

            {/* Step 1: Registration Type */}
            {currentStep === 0 && (
              <div>
                <Title level={4} style={{ marginBottom: 24 }}>
                  Chọn hình thức đăng ký
                </Title>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Card
                      hoverable
                      onClick={() => setRegistrationType("team")}
                      style={{
                        border: registrationType === "team" ? "2px solid #1890ff" : "1px solid #f0f0f0",
                        borderRadius: 12,
                        textAlign: "center",
                        padding: 24,
                        cursor: "pointer",
                      }}
                    >
                      <TeamOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
                      <Title level={4} style={{ marginBottom: 8 }}>
                        Đăng ký đội
                      </Title>
                      <Paragraph type="secondary">
                        Phù hợp cho đội đã có sẵn thành viên
                      </Paragraph>
                      <Tag color="blue" style={{ marginTop: 8 }}>
                        {mockTournamentInfo.minTeamSize}-{mockTournamentInfo.maxTeamSize} thành viên
                      </Tag>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card
                      hoverable
                      onClick={() => setRegistrationType("individual")}
                      style={{
                        border: registrationType === "individual" ? "2px solid #1890ff" : "1px solid #f0f0f0",
                        borderRadius: 12,
                        textAlign: "center",
                        padding: 24,
                        cursor: "pointer",
                      }}
                    >
                      <UserOutlined style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }} />
                      <Title level={4} style={{ marginBottom: 8 }}>
                        Đăng ký cá nhân
                      </Title>
                      <Paragraph type="secondary">
                        Tìm đội hoặc để BTC xếp đội
                      </Paragraph>
                      <Tag color="green" style={{ marginTop: 8 }}>
                        Tìm đồng đội
                      </Tag>
                    </Card>
                  </Col>
                </Row>

                <Alert
                  message="Lưu ý"
                  description={
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      <li>Đăng ký đội yêu cầu tối thiểu {mockTournamentInfo.minTeamSize} thành viên</li>
                      <li>Đăng ký cá nhân sẽ được BTC hỗ trợ tìm đội phù hợp</li>
                      <li>Phí tham gia: {mockTournamentInfo.entryFee}/đội</li>
                    </ul>
                  }
                  type="info"
                  showIcon
                  style={{ marginTop: 24 }}
                />
              </div>
            )}

            {/* Step 2: Team Selection or Creation */}
            {currentStep === 1 && registrationType === "team" && (
              <div>
                <Title level={4} style={{ marginBottom: 24 }}>
                  {teams.length > 0 ? "Chọn đội của bạn" : "Tạo đội mới"}
                </Title>

                {teams.length > 0 ? (
                  <>
                    <div style={{ marginBottom: 24 }}>
                      <Search
                        placeholder="Tìm kiếm đội..."
                        prefix={<SearchOutlined />}
                        value={teamSearch}
                        onChange={(e) => setTeamSearch(e.target.value)}
                        allowClear
                        style={{ marginBottom: 16 }}
                      />
                      
                      <Radio.Group
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        style={{ width: "100%" }}
                      >
                        <Row gutter={[16, 16]}>
                          {filteredTeams.map((team) => (
                            <Col xs={24} key={team.id}>
                              <Card
                                hoverable
                                style={{
                                  border: selectedTeam === team.id ? "2px solid #1890ff" : "1px solid #f0f0f0",
                                  borderRadius: 12,
                                  cursor: "pointer",
                                }}
                                onClick={() => setSelectedTeam(team.id)}
                              >
                                <Row align="middle" gutter={[16, 16]}>
                                  <Col xs={2}>
                                    <Radio value={team.id} />
                                  </Col>
                                  <Col xs={4}>
                                    {team.logo ? (
                                      <img
                                        src={team.logo}
                                        alt={team.name}
                                        style={{
                                          width: 64,
                                          height: 64,
                                          borderRadius: 8,
                                          objectFit: "cover",
                                        }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          width: 64,
                                          height: 64,
                                          borderRadius: 8,
                                          background: "#f0f0f0",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <TeamOutlined style={{ fontSize: 24, color: "#999" }} />
                                      </div>
                                    )}
                                  </Col>
                                  <Col xs={18}>
                                    <div>
                                      <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                                        {team.name}
                                      </Title>
                                      <Text type="secondary" style={{ fontSize: 12 }}>
                                        {team.description || "Chưa có mô tả"}
                                      </Text>
                                      <div style={{ marginTop: 8 }}>
                                        <Space size={[8, 8]} wrap>
                                          <Tag color="blue">
                                            <TeamOutlined /> {teamMembersList.length}/{team.maxMembers} thành viên
                                          </Tag>
                                          <Tag color={team.status === 'active' ? 'green' : 'default'}>
                                            {team.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                                          </Tag>
                                          {team.winRate > 0 && (
                                            <Tag color="gold">
                                              Win rate: {team.winRate}%
                                            </Tag>
                                          )}
                                        </Space>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Radio.Group>

                      {filteredTeams.length === 0 && (
                        <Empty
                          description={
                            <Text type="secondary">
                              Không tìm thấy đội nào. Hãy tạo đội mới
                            </Text>
                          }
                          style={{ marginTop: 48 }}
                        />
                      )}
                    </div>

                    {/* Team Members Preview */}
                    {selectedTeam && (
                      <Card
                        title={
                          <Space>
                            <TeamOutlined />
                            <Text strong>Thành viên đội</Text>
                            <Tag>{teamMembersList.length}/{mockTournamentInfo.maxTeamSize}</Tag>
                          </Space>
                        }
                        style={{ marginBottom: 24 }}
                      >
                        {loadingMembers ? (
                          <div style={{ textAlign: "center", padding: 40 }}>
                            <Spin />
                            <Text style={{ display: "block", marginTop: 16 }}>
                              Đang tải danh sách thành viên...
                            </Text>
                          </div>
                        ) : teamMembersList.length > 0 ? (
                          <Row gutter={[8, 8]}>
                            {teamMembersList.map((member) => (
                              <Col xs={24} sm={12} md={8} key={member.id}>
                                <Card
                                  size="small"
                                  style={{
                                    borderLeft: member.role === 'CAPTAIN' ? '3px solid #1890ff' : undefined,
                                    height: '100%',
                                  }}
                                >
                                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <Text strong style={{ fontSize: 14 }}>
                                        {member.inGameName || 'Chưa có tên game'}
                                      </Text>
                                      {member.role === 'CAPTAIN' && (
                                        <Tag color="blue">Đội trưởng</Tag>
                                      )}
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                      {member.user?.fullname || 'Không có tên'}
                                    </Text>
                                    {member.gameRole && (
                                      <Tag color="purple" style={{ marginTop: 4 }}>
                                        {member.gameRole}
                                      </Tag>
                                    )}
                                  </Space>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        ) : (
                          <Empty
                            description="Đội chưa có thành viên nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                        )}

                        {teamMembersList.length < mockTournamentInfo.minTeamSize && (
                          <Alert
                            message="Thông báo"
                            description={`Đội cần tối thiểu ${mockTournamentInfo.minTeamSize} thành viên để tham gia giải đấu. Hiện tại có ${teamMembersList.length} thành viên.`}
                            type="warning"
                            showIcon
                            style={{ marginTop: 16 }}
                          />
                        )}
                      </Card>
                    )}

                    <div style={{ textAlign: "center", marginTop: 24 }}>
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => setShowCreateTeamModal(true)}
                        style={{ marginBottom: 16 }}
                      >
                        Tạo đội mới
                      </Button>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Không tìm thấy đội phù hợp? Tạo đội mới để tham gia
                        </Text>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: 40 }}>
                    <TeamOutlined style={{ fontSize: 64, color: "#d9d9d9", marginBottom: 24 }} />
                    <Title level={4} style={{ marginBottom: 16 }}>
                      Bạn chưa có đội nào
                    </Title>
                    <Text type="secondary" style={{ marginBottom: 32 }}>
                      Tạo đội mới để tham gia giải đấu
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => setShowCreateTeamModal(true)}
                    >
                      Tạo đội mới
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Individual Registration */}
            {currentStep === 1 && registrationType === "individual" && (
              <div>
                <Title level={4} style={{ marginBottom: 24 }}>
                  Thông tin cá nhân
                </Title>

                <Form form={form} layout="vertical">
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="fullName"
                        label="Họ tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                      >
                        <Input placeholder="Nguyễn Văn A" prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="age"
                        label="Tuổi"
                        rules={[{ required: true, message: 'Vui lòng nhập tuổi' }]}
                      >
                        <Input type="number" min="16" max="60" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email' },
                          { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="example@gmail.com" prefix={<MailOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                      >
                        <Input placeholder="0901234567" prefix={<PhoneOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="gameId"
                        label="ID game"
                        rules={[{ required: true, message: 'Vui lòng nhập ID game' }]}
                      >
                        <Input placeholder="Player#1234" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="rank"
                        label="Rank hiện tại"
                        rules={[{ required: true, message: 'Vui lòng chọn rank' }]}
                      >
                        <Select placeholder="Chọn rank">
                          <Select.Option value="iron">Iron</Select.Option>
                          <Select.Option value="bronze">Bronze</Select.Option>
                          <Select.Option value="silver">Silver</Select.Option>
                          <Select.Option value="gold">Gold</Select.Option>
                          <Select.Option value="platinum">Platinum</Select.Option>
                          <Select.Option value="diamond">Diamond</Select.Option>
                          <Select.Option value="ascendant">Ascendant</Select.Option>
                          <Select.Option value="immortal">Immortal</Select.Option>
                          <Select.Option value="radiant">Radiant</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="mainRole"
                    label="Vai trò chính"
                  >
                    <Radio.Group>
                      <Space direction="vertical">
                        <Radio value="duelist">Duelist</Radio>
                        <Radio value="controller">Controller</Radio>
                        <Radio value="initiator">Initiator</Radio>
                        <Radio value="sentinel">Sentinel</Radio>
                        <Radio value="flex">Flex (lắm tài nhiều tật)</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name="experience"
                    label="Kinh nghiệm thi đấu"
                  >
                    <TextArea
                      placeholder="Mô tả kinh nghiệm thi đấu, giải đấu đã tham gia..."
                      rows={3}
                    />
                  </Form.Item>

                  <Form.Item
                    name="availability"
                    label="Thời gian có thể thi đấu"
                  >
                    <Select mode="multiple" placeholder="Chọn các khung giờ">
                      <Select.Option value="evening_weekdays">Tối các ngày trong tuần (19:00-22:00)</Select.Option>
                      <Select.Option value="weekend_morning">Sáng cuối tuần (9:00-12:00)</Select.Option>
                      <Select.Option value="weekend_afternoon">Chiều cuối tuần (14:00-18:00)</Select.Option>
                      <Select.Option value="weekend_evening">Tối cuối tuần (19:00-23:00)</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="preferences"
                    label="Ưu tiên tìm đội"
                  >
                    <Select mode="tags" placeholder="Nhập các tiêu chí">
                      <Select.Option value="serious">Nghiêm túc thi đấu</Select.Option>
                      <Select.Option value="fun">Vui vẻ là chính</Select.Option>
                      <Select.Option value="practice">Muốn học hỏi</Select.Option>
                      <Select.Option value="competitive">Cạnh tranh cao</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="agreeTermsIndividual"
                    valuePropName="checked"
                    rules={[{ required: true, message: 'Vui lòng đồng ý với điều khoản' }]}
                  >
                    <Radio>
                      Tôi đồng ý để BTC sử dụng thông tin để tìm đội phù hợp
                    </Radio>
                  </Form.Item>
                </Form>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 2 && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <CheckCircleOutlined
                  style={{ fontSize: 64, color: "#52c41a", marginBottom: 24 }}
                />
                <Title level={3} style={{ marginBottom: 16 }}>
                  Kiểm tra thông tin đăng ký
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: 32 }}>
                  Vui lòng kiểm tra kỹ thông tin trước khi xác nhận đăng ký
                </Paragraph>

                <Card style={{ textAlign: "left", marginBottom: 32 }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text strong>Giải đấu:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{mockTournamentInfo.name}</Text>
                    </Col>

                    <Col span={12}>
                      <Text strong>Hình thức:</Text>
                    </Col>
                    <Col span={12}>
                      <Tag color={registrationType === "team" ? "blue" : "green"}>
                        {registrationType === "team" ? "Đăng ký đội" : "Đăng ký cá nhân"}
                      </Tag>
                    </Col>

                    {registrationType === "team" && selectedTeam && (
                      <>
                        <Col span={12}>
                          <Text strong>Đội tham gia:</Text>
                        </Col>
                        <Col span={12}>
                          <Text>{teams.find(t => t.id === selectedTeam)?.name}</Text>
                        </Col>

                        <Col span={12}>
                          <Text strong>Số thành viên:</Text>
                        </Col>
                        <Col span={12}>
                          <Text>{teamMembersList.length} người</Text>
                        </Col>

                        {teamMembersList.length < mockTournamentInfo.minTeamSize && (
                          <Col span={24}>
                            <Alert
                              message="Cảnh báo"
                              description={`Đội của bạn chỉ có ${teamMembersList.length} thành viên, trong khi yêu cầu tối thiểu là ${mockTournamentInfo.minTeamSize}. Vui lòng thêm thành viên trước khi đăng ký.`}
                              type="warning"
                              showIcon
                            />
                          </Col>
                        )}
                      </>
                    )}

                    <Col span={12}>
                      <Text strong>Phí tham gia:</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong style={{ color: "#ff4d4f" }}>
                        {mockTournamentInfo.entryFee}
                      </Text>
                    </Col>
                  </Row>
                </Card>

                <Alert
                  message="Thông báo quan trọng"
                  description="Sau khi đăng ký, BTC sẽ liên hệ xác nhận và hướng dẫn nộp phí tham gia trong vòng 24h."
                  type="warning"
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
                <Button type="primary" onClick={handleNextStep}>
                  Tiếp theo
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmitRegistration}
                  disabled={registrationType === "team" && teamMembersList.length < mockTournamentInfo.minTeamSize}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                  }}
                >
                  Xác nhận đăng ký
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
              <TrophyOutlined
                style={{
                  fontSize: 48,
                  color: "#1890ff",
                  marginBottom: 16,
                }}
              />
              <Title level={3} style={{ marginBottom: 8 }}>
                {mockTournamentInfo.name}
              </Title>
              <Tag color="blue" style={{ fontSize: 14 }}>
                {mockTournamentInfo.game}
              </Tag>
            </div>

            <Divider />

            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <div>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  <TrophyOutlined style={{ marginRight: 8 }} />
                  Giải thưởng
                </Text>
                <Title level={4} style={{ margin: 0, color: "#ff4d4f" }}>
                  {mockTournamentInfo.prizePool}
                </Title>
              </div>

              <div>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  Số đội đã đăng ký
                </Text>
                <Title level={4} style={{ margin: 0 }}>
                  {mockTournamentInfo.teams}
                </Title>
              </div>

              <div>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  Hạn đăng ký
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {mockTournamentInfo.registrationDeadline}
                </Text>
              </div>

              <div>
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  Phí tham gia
                </Text>
                <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                  {mockTournamentInfo.entryFee}
                </Title>
              </div>

              {currentStep === 1 && registrationType === "team" && selectedTeam && (
                <div>
                  <Divider />
                  <Text strong style={{ display: "block", marginBottom: 4 }}>
                    <EyeOutlined style={{ marginRight: 8 }} />
                    Đội đã chọn
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    {teams.find(t => t.id === selectedTeam)?.name}
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {teamMembersList.length}/{mockTournamentInfo.maxTeamSize} thành viên
                    </Text>
                  </div>
                </div>
              )}
            </Space>

            <Divider />

            <Alert
              message="Lưu ý quan trọng"
              description={
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
                  <li>Đăng ký chỉ được xác nhận sau khi nộp phí</li>
                  <li>Không hoàn phí sau khi đăng ký</li>
                  <li>BTC có quyền từ chối đăng ký không hợp lệ</li>
                  <li>Liên hệ: support@esports.com nếu cần hỗ trợ</li>
                </ul>
              }
              type="info"
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
      >
        <Form
          layout="vertical"
          onFinish={handleCreateTeam}
          initialValues={{
            maxMembers: mockTournamentInfo.maxTeamSize,
            status: 'active',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên đội"
                rules={[{ required: true, message: 'Vui lòng nhập tên đội' }]}
              >
                <Input placeholder="VD: Dragon Warriors" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxMembers"
                label="Số thành viên tối đa"
              >
                <Input type="number" min={mockTournamentInfo.minTeamSize} max={mockTournamentInfo.maxTeamSize} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả đội"
          >
            <TextArea
              placeholder="Giới thiệu về đội, thành tích, phong cách chơi..."
              rows={3}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="Email liên hệ"
                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
              >
                <Input placeholder="team@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="Số điện thoại"
              >
                <Input placeholder="0901234567" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="logo"
            label="Logo đội"
          >
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

          <Form.Item
            name="discordLink"
            label="Link Discord"
          >
            <Input placeholder="https://discord.gg/..." />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select
              mode="tags"
              placeholder="Nhập tags (ấn Enter để thêm)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Divider />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setShowCreateTeamModal(false)}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creatingTeam}
            >
              Tạo đội
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
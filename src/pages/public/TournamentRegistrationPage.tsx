import React, { useState } from "react";
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
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

const mockTournamentInfo = {
  id: "1",
  name: "Esports Championship 2025",
  game: "Valorant",
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

  const steps = [
    {
      title: "Chọn loại đăng ký",
      description: "Đăng ký đội hoặc cá nhân",
    },
    {
      title: "Thông tin đội",
      description: "Nhập thông tin đội và thành viên",
    },
    {
      title: "Xác nhận đăng ký",
      description: "Kiểm tra và xác nhận thông tin",
    },
  ];

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
      form
        .validateFields()
        .then(() => {
          setCurrentStep(2);
        })
        .catch(() => {
          message.error("Vui lòng điền đầy đủ thông tin");
        });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitRegistration = () => {
    message.success("Đăng ký thành công! Vui lòng chờ xác nhận từ ban tổ chức.");
    setTimeout(() => {
      navigate(`/tournaments/${id}`);
    }, 2000);
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

            {/* Step 2: Team Information */}
            {currentStep === 1 && registrationType === "team" && (
              <div>
                <Title level={4} style={{ marginBottom: 24 }}>
                  Thông tin đội thi đấu
                </Title>

                <Form form={form} layout="vertical">
                  {/* Team Basic Info */}
                  <Divider orientation="left">Thông tin cơ bản</Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="teamName"
                        label="Tên đội"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đội' }]}
                      >
                        <Input placeholder="VD: Dragon Warriors" size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="teamTag"
                        label="Tag đội (viết tắt)"
                        rules={[{ required: true, message: 'Vui lòng nhập tag đội' }]}
                      >
                        <Input placeholder="VD: DRGN" maxLength={5} size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="teamDescription"
                    label="Mô tả đội"
                  >
                    <TextArea
                      placeholder="Giới thiệu về đội, thành tích, phong cách chơi..."
                      rows={3}
                    />
                  </Form.Item>

                  {/* Team Logo */}
                  <Form.Item
                    name="teamLogo"
                    label="Logo đội"
                  >
                    <Upload
                      listType="picture"
                      maxCount={1}
                      beforeUpload={() => false}
                    >
                      <Button icon={<UploadOutlined />}>Tải lên logo</Button>
                    </Upload>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Định dạng: JPG, PNG, SVG. Tối đa 2MB
                    </Text>
                  </Form.Item>

                  {/* Team Captain */}
                  <Divider orientation="left">Đội trưởng</Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="captainName"
                        label="Họ tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                      >
                        <Input placeholder="Nguyễn Văn A" prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="captainEmail"
                        label="Email"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email' },
                          { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="captain@example.com" prefix={<MailOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="captainPhone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                      >
                        <Input placeholder="0901234567" prefix={<PhoneOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Team Members */}
                  <Divider orientation="left">
                    <Space>
                      <span>Thành viên đội</span>
                      <Tag>{teamMembers.length}/{mockTournamentInfo.maxTeamSize}</Tag>
                    </Space>
                  </Divider>

                  {teamMembers.map((member, index) => (
                    <Card
                      key={member.id}
                      style={{ marginBottom: 16, borderLeft: index === 0 ? '3px solid #52c41a' : undefined }}
                      title={`Thành viên ${index + 1}${index === 0 ? ' (Đội trưởng)' : ''}`}
                      extra={
                        teamMembers.length > mockTournamentInfo.minTeamSize && index > 0 && (
                          <Button
                            type="text"
                            danger
                            size="small"
                            onClick={() => handleRemoveTeamMember(index)}
                          >
                            Xóa
                          </Button>
                        )
                      }
                    >
                      <Row gutter={16}>
                        <Col xs={24} md={8}>
                          <Form.Item
                            name={`memberName_${index}`}
                            label="Họ tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                          >
                            <Input placeholder="Nguyễn Văn B" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            name={`memberGameId_${index}`}
                            label="ID game"
                            rules={[{ required: true, message: 'Vui lòng nhập ID game' }]}
                          >
                            <Input placeholder="Player#1234" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            name={`memberRole_${index}`}
                            label="Vai trò"
                          >
                            <Select placeholder="Chọn vai trò">
                              <Select.Option value="duelist">Duelist</Select.Option>
                              <Select.Option value="controller">Controller</Select.Option>
                              <Select.Option value="initiator">Initiator</Select.Option>
                              <Select.Option value="sentinel">Sentinel</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}

                  {teamMembers.length < mockTournamentInfo.maxTeamSize && (
                    <Button
                      type="dashed"
                      block
                      onClick={handleAddTeamMember}
                      style={{ marginBottom: 24 }}
                    >
                      + Thêm thành viên
                    </Button>
                  )}

                  {/* Terms and Conditions */}
                  <Divider orientation="left">Điều khoản tham gia</Divider>
                  <Card size="small">
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {mockTournamentInfo.rules.map((rule, index) => (
                        <li key={index} style={{ marginBottom: 8 }}>
                          <Text>{rule}</Text>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Form.Item
                    name="agreeTerms"
                    valuePropName="checked"
                    rules={[{ required: true, message: 'Vui lòng đồng ý với điều khoản' }]}
                    style={{ marginTop: 24 }}
                  >
                    <Radio>
                      Tôi đã đọc và đồng ý với tất cả điều khoản tham gia giải đấu
                    </Radio>
                  </Form.Item>
                </Form>
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

                    {registrationType === "team" && (
                      <>
                        <Col span={12}>
                          <Text strong>Tên đội:</Text>
                        </Col>
                        <Col span={12}>
                          <Text>{form.getFieldValue("teamName")}</Text>
                        </Col>

                        <Col span={12}>
                          <Text strong>Số thành viên:</Text>
                        </Col>
                        <Col span={12}>
                          <Text>{teamMembers.length} người</Text>
                        </Col>
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
    </div>
  );
};
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Space,
  Tag,
  Tooltip,
  Avatar,
  Row,
  Col,
  Statistic,
  Select,
  InputNumber,
  Divider,
  Popconfirm,
  Progress,
  DatePicker,
  Spin,
  Empty,
  Alert,
  Tabs,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TrophyOutlined,
  CrownOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  getRoleLabel,
  RoleTeamLabel,
  type TeamRole,
} from "@/common/constants/RoleTeam";
import dayjs from "dayjs";
import { teamService } from "@/services/teamService";
import { teamMemberService } from "@/services/team-memberService";
import { useTeamMember } from "@/hooks/useTeamMember";
import type { Team, TeamMember, TeamStats } from "@/common/types/team";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export const TeamMembersPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teamInfo, setTeamInfo] = useState<Team | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberLoading, setMemberLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isTransferCaptainModalOpen, setIsTransferCaptainModalOpen] =
    useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [checkingInGameName, setCheckingInGameName] = useState(false);

  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [transferForm] = Form.useForm();

  const {
    addMember,
    updateMember,
    approveMember,
    rejectMember,
    removeMember,
    transferCaptain,
    checkPermission,
    checkInGameNameExists,
  } = useTeamMember();

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
      checkTeamPermission();
    }
  }, [teamId]);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const teamData = await teamService.getTeam(teamId!);
      setTeamInfo(teamData);

      const statsData = await teamService.getTeamStats(teamId!);
      setTeamStats(statsData);

      await fetchTeamMembers();
    } catch (error: any) {
      message.error(error.message || "Lấy thông tin đội thất bại");
      navigate("/my-teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    setMemberLoading(true);
    try {
      const membersData = await teamMemberService.getMembers(teamId!);
      setMembers(membersData);
    } catch (error: any) {
      message.error(error.message || "Lấy danh sách thành viên thất bại");
    } finally {
      setMemberLoading(false);
    }
  };

  const checkTeamPermission = async () => {
    if (teamId) {
      const hasPerm = await checkPermission(teamId);
      setHasPermission(hasPerm);
    }
  };

  const handleEdit = (member: TeamMember) => {
    if (!hasPermission) {
      message.error("Bạn không có quyền chỉnh sửa thành viên");
      return;
    }

    setEditingMember(member);
    form.setFieldsValue({
      ...member,
      role: member.role,
      status: member.status,
      joinDate: member.joinDate ? dayjs(member.joinDate) : undefined,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      if (
        values.inGameName &&
        values.inGameName !== editingMember?.inGameName
      ) {
        const exists = await checkInGameNameExists(
          teamId!,
          values.inGameName,
          editingMember?.id
        );
        if (exists) {
          form.setFields([
            {
              name: "inGameName",
              errors: ["In-game name đã tồn tại trong đội này"],
            },
          ]);
          return;
        }
      }

      const updatedValues: any = {
        ...values,
        role: values.role,
        gameRole: values.gameRole,
        inGameName: values.inGameName,
        status: values.status,
        kda: values.kda,
        winRate: values.winRate,
        email: values.email,
        phoneNumber: values.phoneNumber,
      };

      if (values.joinDate) {
        updatedValues.joinDate = values.joinDate.format("YYYY-MM-DD");
      } else if (editingMember?.joinDate) {
        updatedValues.joinDate = editingMember.joinDate;
      }

      if (values.isApproved !== undefined) {
        updatedValues.isApproved = values.isApproved;
      }

      if (values.role === "CAPTAIN" && editingMember?.role !== "CAPTAIN") {
        updatedValues.isApproved = true;
        updatedValues.status = "active";
        if (!updatedValues.joinDate) {
          updatedValues.joinDate = new Date().toISOString().split("T")[0];
        }
      }

      if (editingMember && teamId) {
        setMemberLoading(true);
        const result = await updateMember(
          teamId,
          editingMember.id,
          updatedValues
        );

        if (result) {
          message.success("Cập nhật thành viên thành công");
          setIsModalOpen(false);
          setEditingMember(null);
          form.resetFields();
          await fetchTeamMembers();
          await fetchTeamData();
        }
      }
    } catch (error: any) {
      console.error("Update failed:", error);

      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error("Cập nhật thất bại. Vui lòng thử lại.");
      }

      if (error.response?.data?.errors) {
        const fieldErrors = error.response.data.errors;
        const formErrors: any[] = [];

        Object.keys(fieldErrors).forEach((fieldName) => {
          formErrors.push({
            name: fieldName,
            errors: fieldErrors[fieldName],
          });
        });

        if (formErrors.length > 0) {
          form.setFields(formErrors);
        }
      }
    } finally {
      setMemberLoading(false);
    }
  };

  const handleDelete = async (member: TeamMember) => {
    if (!hasPermission) {
      message.error("Bạn không có quyền xóa thành viên");
      return;
    }

    if (member.role === "CAPTAIN") {
      Modal.warning({
        title: "Không thể xóa đội trưởng",
        content:
          "Vui lòng chuyển quyền đội trưởng cho thành viên khác trước khi xóa.",
        okText: "Đã hiểu",
      });
      return;
    }    const activeMembers = members.filter(
      (m) => m.status === "active" && m.isApproved && m.id !== member.id
    );
    if (activeMembers.length === 0) {
      Modal.warning({
        title: "Không thể xóa thành viên duy nhất",
        content: "Đội phải có ít nhất 1 thành viên hoạt động.",
        okText: "Đã hiểu",
      });
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa ${
        member.inGameName || member.id
      } khỏi đội?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      async onOk() {
        if (teamId) {
          const success = await removeMember(teamId, member.id);
          if (success) {
            fetchTeamMembers();
          }
        }
      },
    });
  };

  const handleApproveMember = async (member: TeamMember) => {
    if (!hasPermission) {
      message.error("Bạn không có quyền phê duyệt thành viên");
      return;
    }

    if (teamId) {
      const result = await approveMember(teamId, member.id);
      if (result) {
        fetchTeamMembers();
        fetchTeamData(); 
      }
    }
  };

  const handleRejectMember = async (member: TeamMember) => {
    if (!hasPermission) {
      message.error("Bạn không có quyền từ chối thành viên");
      return;
    }

    Modal.confirm({
      title: "Xác nhận từ chối",
      content: `Bạn có chắc chắn muốn từ chối ${
        member.inGameName || member.id
      }?`,
      okText: "Từ chối",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      async onOk() {
        if (teamId) {
          const success = await rejectMember(teamId, member.id);
          if (success) {
            fetchTeamMembers();
          }
        }
      },
    });
  };

  const checkInGameNameAvailability = async (inGameName: string) => {
    if (!inGameName) return true;

    try {
      setCheckingInGameName(true);
      const exists = await checkInGameNameExists(teamId!, inGameName);
      return !exists;
    } catch (error) {
      console.error("Error checking in-game name:", error);
      return false;
    } finally {
      setCheckingInGameName(false);
    }
  };

  const handleAddMember = async () => {
    try {
      const values = await addForm.validateFields();

      if (values.inGameName) {
        const isAvailable = await checkInGameNameAvailability(
          values.inGameName
        );
        if (!isAvailable) {
          message.error("In-game name đã tồn tại trong đội này");
          return;
        }
      }

      if (teamId) {
        const result = await addMember(teamId, values);
        if (result) {
          setIsAddMemberModalOpen(false);
          addForm.resetFields();
          fetchTeamMembers();
        }
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleTransferCaptain = async () => {
    try {
      const values = await transferForm.validateFields();

      if (teamId && values.newCaptainId) {
        const success = await transferCaptain(teamId, values.newCaptainId);
        if (success) {
          setIsTransferCaptainModalOpen(false);
          transferForm.resetFields();
          fetchTeamMembers();
          fetchTeamData();
        }
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleViewMember = (member: TeamMember) => {
    setViewingMember(member);
  };

  const getRoleTag = (role: TeamRole) => {
    const roleColor = {
      CAPTAIN: "gold",
      PLAYER: "blue",
      COACH: "purple",
      SUBSTITUTE: "orange",
      ANALYST: "cyan",
      MANAGER: "magenta",
    };

    const roleIcon = {
      CAPTAIN: <CrownOutlined />,
      PLAYER: <UserOutlined />,
      COACH: <UserOutlined />,
      SUBSTITUTE: <UserOutlined />,
      ANALYST: <UserOutlined />,
      MANAGER: <UserOutlined />,
    };

    return (
      <Tag color={roleColor[role]}>
        {roleIcon[role]} {getRoleLabel(role)}
      </Tag>
    );
  };

  const getStatusTag = (status: string) => {
    const config = {
      active: { color: "green", text: "Hoạt động" },
      inactive: { color: "red", text: "Không hoạt động" },
      pending: { color: "orange", text: "Chờ xác nhận" },
    };
    const statusConfig = config[status as keyof typeof config];
    return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>;
  };

  const getApprovalTag = (isApproved: boolean) => {
    return isApproved ? (
      <Tag color="green" icon={<CheckOutlined />}>
        Đã duyệt
      </Tag>
    ) : (
      <Tag color="orange" icon={<CloseOutlined />}>
        Chờ duyệt
      </Tag>
    );
  };

  const roleOptions = Object.entries(RoleTeamLabel).map(([value, label]) => ({
    value,
    label,
  }));

  const filteredMembers = React.useMemo(() => {
    switch (activeTab) {
      case "active":
        return members.filter((m) => m.status === "active" && m.isApproved);
      case "pending":
        return members.filter((m) => m.status === "pending" && !m.isApproved);
      case "inactive":
        return members.filter((m) => m.status === "inactive");
      case "captains":
        return members.filter((m) => m.role === "CAPTAIN");
      default:
        return members;
    }
  }, [members, activeTab]);

  const columns = [
    {
      title: "Thành viên",
      dataIndex: "inGameName",
      key: "inGameName",
      render: (inGameName: string, record: TeamMember) => (
        <Space>
          <Avatar src={record.avatarUrl} size="large" icon={<UserOutlined />} />
          <div>
            <Text strong style={{ fontSize: 14, display: "block" }}>
              {inGameName || record.id}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 2,
              }}
            >
              {getRoleTag(record.role)}
              {getStatusTag(record.status)}
              {getApprovalTag(record.isApproved)}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò trong game",
      dataIndex: "gameRole",
      key: "gameRole",
      render: (gameRole: string) =>
        gameRole ? <Tag color="cyan">{gameRole}</Tag> : "-",
    },
    {
      title: "KDA",
      dataIndex: "kda",
      key: "kda",
      render: (kda: string) =>
        kda ? (
          <Text strong style={{ color: "#1890ff" }}>
            {kda}
          </Text>
        ) : (
          "-"
        ),
    },
    {
      title: "Tỷ lệ thắng",
      dataIndex: "winRate",
      key: "winRate",
      render: (winRate: number) =>
        winRate ? (
          <div style={{ textAlign: "center" }}>
            <Text
              strong
              style={{
                fontSize: 16,
                color:
                  winRate >= 70
                    ? "#52c41a"
                    : winRate >= 50
                    ? "#faad14"
                    : "#ff4d4f",
              }}
            >
              {winRate}%
            </Text>
            <Progress
              percent={winRate}
              size="small"
              showInfo={false}
              strokeColor={
                winRate >= 70
                  ? "#52c41a"
                  : winRate >= 50
                  ? "#faad14"
                  : "#ff4d4f"
              }
            />
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 180,
      render: (_: any, record: TeamMember) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewMember(record)}
            />
          </Tooltip>

          {record.status === "pending" &&
            !record.isApproved &&
            hasPermission && (
              <>
                <Tooltip title="Phê duyệt">
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    size="small"
                    style={{ color: "#52c41a" }}
                    onClick={() => handleApproveMember(record)}
                  />
                </Tooltip>
                <Tooltip title="Từ chối">
                  <Button
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => handleRejectMember(record)}
                  />
                </Tooltip>
              </>
            )}

          {hasPermission && (
            <>
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => handleEdit(record)}
                  disabled={record.role === "CAPTAIN" && !hasPermission}
                />
              </Tooltip>

              <Popconfirm
                title="Xác nhận xóa"
                description={`Xóa ${record.inGameName || record.id} khỏi đội?`}
                onConfirm={() => handleDelete(record)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                disabled={record.role === "CAPTAIN"}
              >
                <Tooltip
                  title={
                    record.role === "CAPTAIN"
                      ? "Không thể xóa đội trưởng"
                      : "Xóa"
                  }
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    disabled={record.role === "CAPTAIN"}
                  />
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!teamInfo) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Không tìm thấy đội"
          description="Đội bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate("/my-teams")}>
              Quay lại danh sách
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header với nút quay lại */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <Space>
            <Link to="/my-teams">
              <Button type="text" icon={<ArrowLeftOutlined />}>
                Quay lại
              </Button>
            </Link>
            <div>
              <Title
                level={2}
                style={{
                  margin: 0,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                👥 Thành viên đội: {teamInfo.name}
              </Title>
              <Text type="secondary">{teamInfo.description}</Text>
            </div>
          </Space>
        </div>

        <Space>
          {hasPermission && (
            <>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => setIsAddMemberModalOpen(true)}
                disabled={
                  (teamStats?.stats.activeMembers ?? 0) >= teamInfo.maxMembers
                }
              >
                Thêm thành viên
              </Button>

              {members.some((m) => m.role === "CAPTAIN") && (
                <Button
                  type="default"
                  icon={<CrownOutlined />}
                  size="large"
                  onClick={() => setIsTransferCaptainModalOpen(true)}
                >
                  Chuyển đội trưởng
                </Button>
              )}
            </>
          )}
        </Space>
      </div>

      {/* Thông báo quyền hạn */}
      {!hasPermission && (
        <Alert
          message="Quyền hạn hạn chế"
          description="Bạn chỉ có thể xem danh sách thành viên. Chỉ đội trưởng hoặc người tạo đội mới có quyền quản lý thành viên."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Thông tin đội */}
      <Card
        style={{
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          marginBottom: 24,
          background: "linear-gradient(135deg, #f6f8ff 0%, #f0f2ff 100%)",
        }}
      >
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: "center" }}>
              <Avatar
                size={80}
                src={teamInfo.logo}
                icon={<TeamOutlined />}
                style={{
                  backgroundColor: teamInfo.logo ? "transparent" : "#1890ff",
                }}
              />
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                {teamInfo.name}
              </Title>
              <Tag color="blue">{teamInfo.game?.name || teamInfo.gameId}</Tag>
              <Tag
                color={
                  teamInfo.status === "active"
                    ? "green"
                    : teamInfo.status === "recruiting"
                    ? "blue"
                    : "red"
                }
              >
                {teamInfo.status === "active"
                  ? "Đang hoạt động"
                  : teamInfo.status === "recruiting"
                  ? "Đang tuyển"
                  : "Ngừng hoạt động"}
              </Tag>
              {teamInfo.isDeleted && (
                <Tag color="red" style={{ marginTop: 8 }}>
                  Đã xóa
                </Tag>
              )}
            </div>
          </Col>

          <Col xs={24} md={16}>
            {teamStats ? (
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Thành viên"
                    value={`${teamStats.stats.activeMembers}/${teamInfo.maxMembers}`}
                    prefix={<UserOutlined />}
                    valueStyle={{
                      color:
                        teamStats.stats.activeMembers >= teamInfo.maxMembers
                          ? "#ff4d4f"
                          : "#1890ff",
                    }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Chờ xác nhận"
                    value={teamStats.stats.pendingMembers}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Tỷ lệ thắng TB"
                    value={teamStats.stats.averageWinRate}
                    suffix="%"
                    valueStyle={{
                      color:
                        teamStats.stats.averageWinRate >= 70
                          ? "#52c41a"
                          : teamStats.stats.averageWinRate >= 50
                          ? "#faad14"
                          : "#ff4d4f",
                    }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Giải đấu"
                    value={teamStats.teamInfo.tournamentsCount}
                    prefix={<TrophyOutlined />}
                  />
                </Col>

                {teamStats.stats.captain && (
                  <Col span={24}>
                    <Divider style={{ margin: "16px 0" }} />
                    <Space>
                      <Avatar
                        src={teamStats.stats.captain.avatarUrl}
                        size="small"
                      />
                      <Text strong>Đội trưởng: </Text>
                      <Text>{teamStats.stats.captain.name}</Text>
                    </Space>
                  </Col>
                )}
              </Row>
            ) : (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin />
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* Tabs và bảng thành viên */}
      <Card
        style={{
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "all",
              label: `Tất cả (${members.length})`,
            },
            {
              key: "active",
              label: `Đang hoạt động (${
                members.filter((m) => m.status === "active" && m.isApproved)
                  .length
              })`,
            },
            {
              key: "pending",
              label: `Chờ duyệt (${
                members.filter((m) => m.status === "pending" && !m.isApproved)
                  .length
              })`,
            },
            {
              key: "inactive",
              label: `Không hoạt động (${
                members.filter((m) => m.status === "inactive").length
              })`,
            },
            {
              key: "captains",
              label: `Đội trưởng (${
                members.filter((m) => m.role === "CAPTAIN").length
              })`,
            },
          ]}
        />

        {memberLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin />
          </div>
        ) : filteredMembers.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              activeTab === "all"
                ? "Đội chưa có thành viên nào"
                : `Không có thành viên ${activeTab}`
            }
          >
            {activeTab === "all" && hasPermission && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddMemberModalOpen(true)}
              >
                Thêm thành viên đầu tiên
              </Button>
            )}
          </Empty>
        ) : (
          <Table
            dataSource={filteredMembers}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} trong ${total} thành viên`,
            }}
          />
        )}
      </Card>

      {/* Modal chỉnh sửa thành viên */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <EditOutlined />
            Chỉnh sửa thành viên
          </div>
        }
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingMember(null);
          form.resetFields();
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        width={600}
        confirmLoading={memberLoading}
      >
        {editingMember && (
          <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
            <Alert
              type="info"
              message="Lưu ý"
              description="Một số thông tin có thể bị khóa nếu thành viên đang tham gia giải đấu."
              style={{ marginBottom: 16 }}
              showIcon
            />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Vai trò trong đội"
                  rules={[
                    { required: true, message: "Vui lòng chọn vai trò!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn vai trò"
                    size="large"
                    options={roleOptions}
                    disabled={editingMember.role === "CAPTAIN"}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="gameRole" label="Vai trò trong game">
                  <Input
                    placeholder="VD: Duelist, Support, Carry..."
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="inGameName"
                  label="Tên trong game"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên trong game!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Tên trong game"
                    size="large"
                    suffix={
                      checkingInGameName ? (
                        <Spin size="small" />
                      ) : (
                        <SearchOutlined />
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="status" label="Trạng thái">
                  <Select size="large" disabled={!hasPermission}>
                    <Option value="active">Hoạt động</Option>
                    <Option value="inactive">Không hoạt động</Option>
                    <Option value="pending">Chờ xác nhận</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="kda"
                  label="KDA"
                  rules={[
                    {
                      pattern: /^\d+\/\d+\/\d+$/,
                      message: "Định dạng: kills/deaths/assists",
                    },
                  ]}
                >
                  <Input placeholder="0/0/0" size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="winRate"
                  label="Tỷ lệ thắng (%)"
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      max: 100,
                      message: "Tỷ lệ thắng từ 0-100%",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="0"
                    style={{ width: "100%" }}
                    min={0}
                    max={100}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="isApproved"
                  label="Đã phê duyệt"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Đã duyệt"
                    unCheckedChildren="Chưa duyệt"
                    disabled={!hasPermission}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ type: "email", message: "Email không hợp lệ!" }]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Email"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  rules={[
                    {
                      pattern: /^[0-9+\-\s]+$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Số điện thoại"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="joinDate" label="Ngày tham gia">
              <DatePicker
                style={{ width: "100%" }}
                size="large"
                format="DD/MM/YYYY"
                disabled={!hasPermission}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Modal thêm thành viên */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UserOutlined />
            Thêm thành viên mới
          </div>
        }
        open={isAddMemberModalOpen}
        onOk={handleAddMember}
        onCancel={() => {
          setIsAddMemberModalOpen(false);
          addForm.resetFields();
        }}
        okText="Thêm"
        cancelText="Hủy"
        width={500}
        confirmLoading={memberLoading}
      >
        <Form form={addForm} layout="vertical" style={{ marginTop: 20 }}>
          <Alert
            type="warning"
            message="Lưu ý khi thêm thành viên"
            description="In-game name không được trùng với thành viên khác trong cùng game"
            style={{ marginBottom: 16 }}
            showIcon
          />

          <Form.Item
            name="inGameName"
            label="Tên trong game *"
            rules={[
              { required: true, message: "Vui lòng nhập tên trong game!" },
              {
                validator: async (_, value) => {
                  if (value) {
                    const isAvailable = await checkInGameNameAvailability(
                      value
                    );
                    if (!isAvailable) {
                      return Promise.reject(
                        "In-game name đã tồn tại trong đội này"
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
            validateTrigger="onBlur"
            help="Tên này sẽ được hiển thị trong game và giải đấu"
          >
            <Input
              placeholder="Nhập tên trong game"
              size="large"
              suffix={checkingInGameName ? <Spin size="small" /> : null}
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò trong đội *"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select
              placeholder="Chọn vai trò"
              size="large"
              options={roleOptions}
            />
          </Form.Item>

          <Form.Item name="gameRole" label="Vai trò trong game">
            <Input placeholder="VD: Duelist, Support, Carry..." size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email liên hệ"
                rules={[{ type: "email", message: "Email không hợp lệ!" }]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  {
                    pattern: /^[0-9+\-\s]+$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Số điện thoại"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="kda"
                label="KDA (tuỳ chọn)"
                rules={[
                  {
                    pattern: /^\d+\/\d+\/\d+$/,
                    message: "Định dạng: kills/deaths/assists",
                  },
                ]}
              >
                <Input placeholder="0/0/0" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="winRate"
                label="Tỷ lệ thắng (%)"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    max: 100,
                    message: "Tỷ lệ thắng từ 0-100%",
                  },
                ]}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: "100%" }}
                  min={0}
                  max={100}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal chuyển đội trưởng */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CrownOutlined />
            Chuyển quyền đội trưởng
          </div>
        }
        open={isTransferCaptainModalOpen}
        onOk={handleTransferCaptain}
        onCancel={() => {
          setIsTransferCaptainModalOpen(false);
          transferForm.resetFields();
        }}
        okText="Chuyển quyền"
        cancelText="Hủy"
        width={400}
      >
        <Form form={transferForm} layout="vertical" style={{ marginTop: 20 }}>
          <Alert
            type="warning"
            message="Chú ý quan trọng"
            description="Sau khi chuyển quyền, bạn sẽ không còn là đội trưởng của đội này nữa."
            style={{ marginBottom: 16 }}
            showIcon
          />

          <Form.Item
            name="newCaptainId"
            label="Chọn thành viên mới"
            rules={[{ required: true, message: "Vui lòng chọn thành viên!" }]}
          >
            <Select
              placeholder="Chọn thành viên mới làm đội trưởng"
              size="large"
            >
              {members
                .filter(
                  (member) =>
                    member.status === "active" &&
                    member.isApproved &&
                    member.role !== "CAPTAIN"
                )
                .map((member) => (
                  <Option key={member.id} value={member.id}>
                    <Space>
                      <Avatar size="small" src={member.avatarUrl} />
                      <span>{member.inGameName || member.id}</span>
                      {member.gameRole && <Tag>{member.gameRole}</Tag>}
                    </Space>
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết thành viên */}
      {viewingMember && (
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <EyeOutlined />
              Chi tiết thành viên
            </div>
          }
          open={!!viewingMember}
          onCancel={() => setViewingMember(null)}
          footer={[
            <Button key="close" onClick={() => setViewingMember(null)}>
              Đóng
            </Button>,
            hasPermission && (
              <Button
                key="edit"
                type="primary"
                onClick={() => {
                  handleEdit(viewingMember);
                  setViewingMember(null);
                }}
              >
                Chỉnh sửa
              </Button>
            ),
          ]}
          width={600}
        >
          <div style={{ marginTop: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar
                size={80}
                src={viewingMember.avatarUrl}
                icon={<UserOutlined />}
              />
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                {viewingMember.inGameName || viewingMember.id}
              </Title>
              <Space>
                {getRoleTag(viewingMember.role)}
                {getStatusTag(viewingMember.status)}
                {getApprovalTag(viewingMember.isApproved)}
              </Space>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Tên trong game"
                    value={viewingMember.inGameName || "Không có"}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Vai trò trong game"
                    value={viewingMember.gameRole || "Không có"}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <div>
                  <Text strong>KDA: </Text>
                  <Text>{viewingMember.kda || "N/A"}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Text strong>Tỷ lệ thắng: </Text>
                  <Text>
                    {viewingMember.winRate
                      ? `${viewingMember.winRate}%`
                      : "N/A"}
                  </Text>
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <div>
                  <Text strong>Email: </Text>
                  <Text>{viewingMember.email || "N/A"}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Text strong>Số điện thoại: </Text>
                  <Text>{viewingMember.phoneNumber || "N/A"}</Text>
                </div>
              </Col>
            </Row>

            <Divider />

            <div>
              <Text strong>Ngày tham gia: </Text>
              <Text>
                {viewingMember.joinDate
                  ? dayjs(viewingMember.joinDate).format("DD/MM/YYYY")
                  : "N/A"}
              </Text>
            </div>

            <Divider />

            <div>
              <Text strong>ID thành viên: </Text>
              <Text type="secondary">{viewingMember.id}</Text>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

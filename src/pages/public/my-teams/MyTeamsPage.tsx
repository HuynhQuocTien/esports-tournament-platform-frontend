import React, { useState, useEffect } from "react";
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
  Badge,
  Popconfirm,
  Progress,
  Image,
  Spin,
  Empty,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
  TrophyOutlined,
  CrownOutlined,
  EyeOutlined,
  LinkOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useTeam } from "@/hooks/useTeam";
import { teamService } from "@/services/teamService";
import { gameService } from "@/services/gameService";
import type { Team, Game } from "@/common/types/team";

const { Title, Text } = Typography;
const { Option } = Select;

export const MyTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchParams, setSearchParams] = useState({
    search: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const navigate = useNavigate();
  const { createTeam, updateTeam, deleteTeam, updateTeamStatus } = useTeam();

  useEffect(() => {
    fetchGames();
    fetchTeams();
  }, [pagination.page, pagination.limit, searchParams]);

  const fetchGames = async () => {
    try {
      const gamesData = await gameService.getGames();
      setGames(Array.isArray(gamesData) ? gamesData : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách game:", error);
    } finally {
      setGamesLoading(false);
    }
  };

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await teamService.getMyTeams({
        page: pagination.page,
        limit: pagination.limit,
        ...searchParams,
      });

      setTeams(response.data);
      setPagination({
        ...pagination,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      });
    } catch (error: any) {
      message.error(error.message || "Lấy danh sách đội thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values: any) => {
    setSearchParams({
      search: values.search || "",
    });
    setPagination({ ...pagination, page: 1 });
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      if (values.game) {
        const selectedGame = games.find((g) => g.name === values.game);
        if (selectedGame) {
          values.gameId = selectedGame.id;
        }
      }

      const result = await createTeam(values);
      if (result) {
        setIsModalOpen(false);
        form.resetFields();
        fetchTeams();
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    form.setFieldsValue({
      ...team,
      game: team.game?.name || team.gameId,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      if (editingTeam) {
        const result = await updateTeam(editingTeam.id, values);
        if (result) {
          setIsModalOpen(false);
          setEditingTeam(null);
          form.resetFields();
          fetchTeams();
        }
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content:
        "Bạn có chắc chắn muốn xóa đội này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      async onOk() {
        const success = await deleteTeam(id);
        if (success) {
          fetchTeams();
        }
      },
    });
  };

  const handleView = async (team: Team) => {
    try {
      const teamDetail = await teamService.getTeam(team.id);
      setViewingTeam(teamDetail);
      setIsViewModalOpen(true);
    } catch (error: any) {
      message.error(error.message || "Lấy thông tin đội thất bại");
    }
  };

  const handleToggleStatus = async (id: string, newStatus: Team["status"]) => {
    const result = await updateTeamStatus(id, newStatus);
    if (result) {
      fetchTeams();
    }
  };

  const getStatusTag = (status: string) => {
    const config = {
      active: { color: "green", text: "Đang hoạt động" },
      recruiting: { color: "blue", text: "Đang tuyển thành viên" },
      inactive: { color: "red", text: "Ngừng hoạt động" },
    };
    const statusConfig = config[status as keyof typeof config];
    return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>;
  };

  const columns = [
    {
      title: "Đội",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Team) => (
        <Space>
          <Avatar
            src={record.logo}
            size="large"
            shape="square"
            style={{ borderRadius: 8 }}
            icon={<TeamOutlined />}
          />
          <div>
            <Text strong style={{ fontSize: 14, display: "block" }}>
              {name}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.game?.name || record.gameId}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Thành viên",
      dataIndex: "members",
      key: "members",
      render: (members: any[], record: Team) => {
        const activeMembers =
          members?.filter((m) => m.status === "active" && m.isApproved) || [];
        return (
          <div style={{ minWidth: 120 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text strong>
                {activeMembers.length}/{record.maxMembers}
              </Text>
              {record.status === "recruiting" && (
                <Badge status="processing" text="Còn chỗ" />
              )}
            </div>
            <Progress
              percent={(activeMembers.length / record.maxMembers) * 100}
              size="small"
              showInfo={false}
              strokeColor={
                activeMembers.length >= record.maxMembers
                  ? "#ff4d4f"
                  : "#52c41a"
              }
            />
          </div>
        );
      },
    },
    {
      title: "Hiệu suất",
      dataIndex: "winRate",
      key: "winRate",
      render: (winRate: number) => (
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
          <Text type="secondary" style={{ fontSize: 11 }}>
            &nbsp; Tỷ lệ thắng
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Team) => (
        <Space direction="vertical" align="center">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Switch
              checked={status === "active"}
              checkedChildren="Đang hoạt động"
              unCheckedChildren="Ngừng hoạt động"
              onChange={(checked) => {
                const newStatus = checked ? "active" : "inactive";
                handleToggleStatus(record.id, newStatus);
              }}
              disabled={record.isDeleted || status === "recruiting"}
            />
            {status === "recruiting" && (
              <Tag color="blue" style={{ marginLeft: 8 }}>
                Đang tuyển
              </Tag>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 180,
      render: (_: any, record: Team) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleView(record)}
            />
          </Tooltip>

          <Tooltip title="Quản lý thành viên">
            <Link to={`/team/${record.id}/members`}>
              <Button type="text" icon={<TeamOutlined />} size="small" />
            </Link>
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
              disabled={record.isDeleted}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa đội này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            disabled={record.isDeleted}
          >
            <Tooltip title={record.isDeleted ? "Đã xóa" : "Xóa"}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                disabled={record.isDeleted}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const teamStats = {
    totalTeams: pagination.total,
    activeTeams: teams.filter((team) => team.status === "active").length,
    recruitingTeams: teams.filter((team) => team.status === "recruiting")
      .length,
    avgWinRate:
      teams.length > 0
        ? Math.round(
            teams.reduce((sum, team) => sum + Number(team.winRate || 0), 0) /
              teams.length
          )
        : 0,
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🏃 Đội của tôi
          </Title>
          <Text type="secondary">Quản lý các đội bạn đã tạo hoặc tham gia</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setEditingTeam(null);
            setIsModalOpen(true);
            form.resetFields();
          }}
        >
          Tạo đội mới
        </Button>
      </div>

      {/* Search Form */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="search" style={{ flex: 1 }}>
            <Input
              placeholder="Tìm kiếm theo tên đội hoặc mô tả..."
              prefix={<SearchOutlined />}
              allowClear
            />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="Trạng thái" style={{ width: 150 }} allowClear>
              <Option value="active">Đang hoạt động</Option>
              <Option value="inactive">Ngừng hoạt động</Option>
              <Option value="recruiting">Đang tuyển</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={searchLoading}>
              Tìm kiếm
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => {
                searchForm.resetFields();
                setSearchParams({ search: "" });
              }}
            >
              Đặt lại
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: "center" }}>
            <Statistic
              title="Tổng số đội"
              value={teamStats.totalTeams}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: "center" }}>
            <Statistic
              title="Đội đang hoạt động"
              value={teamStats.activeTeams}
              prefix={<CrownOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: "center" }}>
            <Statistic
              title="Đội đang tuyển"
              value={teamStats.recruitingTeams}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: "center" }}>
            <Statistic
              title="Tỷ lệ thắng TB"
              value={teamStats.avgWinRate}
              suffix="%"
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Teams Table */}
      <Card
        style={{
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : teams.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchParams.search
                ? "Không tìm thấy đội phù hợp"
                : "Bạn chưa có đội nào. Hãy tạo đội đầu tiên!"
            }
          >
            {!searchParams.search && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                Tạo đội đầu tiên
              </Button>
            )}
          </Empty>
        ) : (
          <Table
            dataSource={teams}
            columns={columns}
            rowKey="id"
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} trong ${total} đội`,
              onChange: (page, pageSize) => {
                setPagination({
                  ...pagination,
                  page,
                  limit: pageSize,
                });
              },
            }}
          />
        )}
      </Card>

      {/* Create/Edit Team Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TeamOutlined />
            {editingTeam ? "Chỉnh sửa đội" : "Tạo đội mới"}
          </div>
        }
        open={isModalOpen}
        onOk={editingTeam ? handleUpdate : handleAdd}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTeam(null);
          form.resetFields();
        }}
        okText={editingTeam ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={600}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên đội"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đội!" },
                  { min: 3, message: "Tên đội phải có ít nhất 3 ký tự" },
                  { max: 50, message: "Tên đội không quá 50 ký tự" },
                ]}
              >
                <Input placeholder="Nhập tên đội" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gameId"
                label="Game"
                rules={[{ required: true, message: "Vui lòng chọn game!" }]}
              >
                <Select
                  placeholder="Chọn game"
                  size="large"
                  loading={gamesLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input: string, option: any) => {
                    const children = option?.children;
                    if (typeof children === "string") {
                      return children
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }
                    if (Array.isArray(children)) {
                      return children.some(
                        (child) =>
                          typeof child === "string" &&
                          child.toLowerCase().includes(input.toLowerCase())
                      );
                    }
                    return false;
                  }}
                  filterSort={(optionA, optionB) => {
                    const a = String(optionA?.children ?? "").toLowerCase();
                    const b = String(optionB?.children ?? "").toLowerCase();
                    return a.localeCompare(b);
                  }}
                  notFoundContent={
                    <div
                      style={{ padding: 8, textAlign: "center", color: "#999" }}
                    >
                      {gamesLoading ? "Đang tải..." : "Không tìm thấy game"}
                    </div>
                  }
                  allowClear
                >
                  {Array.isArray(games) && games.length > 0 ? (
                    games.map((game) => {
                      return (
                        <Option key={game.id} value={game.id}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <img
                              src={
                                game.logo ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  game.name
                                )}&background=1890ff&color=fff`
                              }
                              alt={game.name}
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                objectFit: "contain",
                              }}
                              onError={(e) => {
                                (
                                  e.target as HTMLImageElement
                                ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  game.name
                                )}&background=1890ff&color=fff`;
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 500 }}>{game.name}</div>
                            </div>
                          </div>
                        </Option>
                      );
                    })
                  ) : (
                    <Option disabled value="no-games">
                      <div style={{ textAlign: "center", color: "#999" }}>
                        {gamesLoading
                          ? "Đang tải danh sách game..."
                          : "Không có game nào"}
                      </div>
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ max: 500, message: "Mô tả không quá 500 ký tự" }]}
          >
            <Input.TextArea
              placeholder="Mô tả về đội..."
              rows={3}
              size="large"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maxMembers"
                label="Số thành viên tối đa"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số thành viên tối đa!",
                  },
                  {
                    type: "number",
                    min: 1,
                    max: 20,
                    message: "Số thành viên từ 1 đến 20",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Nhập số thành viên tối đa"
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái">
                <Select placeholder="Chọn trạng thái" size="large">
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Ngừng hoạt động</Option>
                  <Option value="recruiting">Đang tuyển</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="Email liên hệ"
                rules={[{ type: "email", message: "Email không hợp lệ!" }]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email liên hệ"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
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

          <Form.Item
            name="discordLink"
            label="Link Discord"
            rules={[{ type: "url", message: "URL không hợp lệ!" }]}
          >
            <Input
              prefix={<LinkOutlined />}
              placeholder="https://discord.gg/..."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="logo"
            label="URL Logo"
            rules={[{ type: "url", message: "URL không hợp lệ!" }]}
          >
            <Input placeholder="https://example.com/logo.png" size="large" />
          </Form.Item>

          <Form.Item name="tags" label="Tags (cách nhau bằng dấu phẩy)">
            <Input
              placeholder="Ví dụ: competitive, professional, esports"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <EyeOutlined />
            Chi tiết đội
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          setViewingTeam(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsViewModalOpen(false);
              if (viewingTeam) handleEdit(viewingTeam);
            }}
            disabled={viewingTeam?.isDeleted}
          >
            Chỉnh sửa
          </Button>,
          <Link key="members" to={`/team/${viewingTeam?.id}/members`}>
            <Button type="primary" ghost>
              Quản lý thành viên
            </Button>
          </Link>,
        ]}
        width={700}
      >
        {viewingTeam && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar
                src={viewingTeam.logo}
                size={100}
                shape="square"
                style={{ borderRadius: 12, marginBottom: 16 }}
                icon={<TeamOutlined />}
              />
              <Title level={3}>{viewingTeam.name}</Title>
              <Space>
                <Tag color="blue">
                  {viewingTeam.game?.name || viewingTeam.gameId}
                </Tag>
                {getStatusTag(viewingTeam.status)}
                {viewingTeam.isDeleted && <Tag color="red">Đã xóa</Tag>}
              </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Thành viên"
                    value={`${
                      viewingTeam.members?.filter(
                        (m: any) => m.status === "active" && m.isApproved
                      ).length || 0
                    }/${viewingTeam.maxMembers}`}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Tỷ lệ thắng"
                    value={viewingTeam.winRate}
                    suffix="%"
                    valueStyle={{
                      color:
                        viewingTeam.winRate >= 70
                          ? "#52c41a"
                          : viewingTeam.winRate >= 50
                          ? "#faad14"
                          : "#ff4d4f",
                    }}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Mô tả:</Text>
              <Text style={{ display: "block", marginTop: 8 }}>
                {viewingTeam.description || "Chưa có mô tả"}
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Người tạo:</Text>
              <Text style={{ display: "block", marginTop: 4 }}>
                {viewingTeam.createdBy?.fullname || "Không xác định"}
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Liên hệ:</Text>
              <div style={{ marginTop: 8 }}>
                {viewingTeam.contactEmail && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <MailOutlined />
                    <Text>{viewingTeam.contactEmail}</Text>
                  </div>
                )}
                {viewingTeam.contactPhone && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <PhoneOutlined />
                    <Text>{viewingTeam.contactPhone}</Text>
                  </div>
                )}
                {viewingTeam.discordLink && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <LinkOutlined />
                    <a
                      href={viewingTeam.discordLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Discord
                    </a>
                  </div>
                )}
              </div>
            </div>

            {viewingTeam.tags && viewingTeam.tags.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>Tags:</Text>
                <div style={{ marginTop: 8 }}>
                  {viewingTeam.tags.map((tag: string, index: number) => (
                    <Tag key={index} style={{ marginBottom: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Ngày tạo:{" "}
                {dayjs(viewingTeam.createdAt).format("DD/MM/YYYY HH:mm")}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Cập nhật:{" "}
                {dayjs(viewingTeam.updatedAt).format("DD/MM/YYYY HH:mm")}
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

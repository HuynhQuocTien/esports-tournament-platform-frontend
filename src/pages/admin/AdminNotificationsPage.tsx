import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Card,
  Typography,
  Space,
  Tag,
  Tooltip,
  Select,
  Avatar,
  Row,
  Col,
  Input as AntdInput,
  Popconfirm,
  Spin,
  Badge,
  DatePicker,
  Switch,
  TimePicker,
  Divider,
  Tabs,
  Radio,
  Dropdown,
  Alert,
  type MenuProps,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  BellOutlined,
  SendOutlined,
  ScheduleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  FireOutlined,
  MoreOutlined,
  MailOutlined,
  MessageOutlined,
  TeamOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { notificationService } from "@/services/notificationService";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import NotificationSocket from "../../services/notificationSocket";
import type {
  CreateNotificationData,
  Notification,
  User,
  NotificationType,
  NotificationStats,
} from "@/common/types/notification";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  const [currentTab, setCurrentTab] = useState("all");
  const [realtimeStats, setRealtimeStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    important: 0,
    scheduled: 0,
    expired: 0,
    sentToday: 0,
  });
  const [sendToAll, setSendToAll] = useState<boolean>(true);
  const [scheduleSendToAll, setScheduleSendToAll] = useState<boolean>(true);
  const socketRef = useRef<NotificationSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      socketRef.current = new NotificationSocket(token);
      socketRef.current.connect();

      socketRef.current.on("new-notification", (notification: Notification) => {
        message.info(`Thông báo mới: ${notification.title}`);
        fetchNotifications(pagination.page, searchText);
        fetchStats();
      });

      socketRef.current.on(
        "important-notification",
        (notification: Notification) => {
          Modal.warning({
            title: "Thông báo quan trọng",
            content: notification.message,
            okText: "Xác nhận",
            onOk: () => {
              socketRef.current?.ackImportantNotification(notification.id);
            },
          });
        }
      );
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await notificationService.getUsers();
      setUsers(response);
    } catch (error: any) {
      message.error("Không thể tải danh sách người dùng");
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchNotifications = useCallback(
    async (page = 1, search = "", filters?: any) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: pagination.limit,
          search,
          ...filters,
        };
        const response = await notificationService.getNotifications(params);
        setNotifications(response.notifications);
        setPagination(response.pagination);
      } catch (error: any) {
        message.error("Không thể tải danh sách thông báo");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  const fetchStats = useCallback(async () => {
    try {
      const stats = await notificationService.getStats();
      setRealtimeStats(stats);
    } catch (error) {
      console.error("Không thể tải thống kê", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1, searchText);
    fetchUsers();
    fetchStats();
  }, [fetchNotifications, fetchUsers, fetchStats, searchText]);

  const handleAddNotification = async () => {
    try {
      const values = await form.validateFields();
      const notificationData: CreateNotificationData = {
        title: values.title,
        message: values.message,
        type: values.type || "info",
        isImportant: values.isImportant || false,
        sendToAll: values.sendToAll || false,
        userIds: values.sendToAll ? undefined : values.userIds,
      };

      await notificationService.createNotification(notificationData);
      message.success("Thông báo đã được gửi thành công!");
      setIsModalOpen(false);
      form.resetFields();
      setSendToAll(true);
      fetchNotifications(pagination.page, searchText);
      fetchStats();
    } catch (error: any) {
      message.error(error.message || "Gửi thông báo thất bại");
    }
  };

  const handleScheduleNotification = async () => {
    try {
      const values = await scheduleForm.validateFields();
      
      if (!values.scheduledAt) {
        message.error("Vui lòng chọn thời gian lên lịch");
        return;
      }

      const notificationData: CreateNotificationData = {
        title: values.title,
        message: values.message,
        type: values.type || "info",
        isImportant: values.isImportant || false,
        sendToAll: values.sendToAll || false,
        userIds: values.sendToAll ? undefined : values.userIds,
        scheduledAt: values.scheduledAt.format(),
        expiresAt: values.expiresAt?.format(),
      };

      await notificationService.scheduleNotification(notificationData);
      message.success("Thông báo đã được lên lịch thành công!");
      setIsScheduleModalOpen(false);
      scheduleForm.resetFields();
      setScheduleSendToAll(true);
      fetchNotifications(pagination.page, searchText);
      fetchStats();
    } catch (error: any) {
      message.error(error.message || "Lên lịch thông báo thất bại");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      message.success("Đã đánh dấu là đã đọc");
      fetchNotifications(pagination.page, searchText);
      fetchStats();
    } catch (error: any) {
      message.error(error.message || "Đánh dấu đã đọc thất bại");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      message.success("Đã đánh dấu tất cả là đã đọc");
      fetchNotifications(pagination.page, searchText);
      fetchStats();
    } catch (error: any) {
      message.error(error.message || "Đánh dấu tất cả đã đọc thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      message.success("Đã xóa thông báo thành công!");
      fetchNotifications(pagination.page, searchText);
      fetchStats();
    } catch (error: any) {
      message.error(error.message || "Xóa thông báo thất bại");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await notificationService.bulkDeleteNotifications(
        selectedRowKeys as string[]
      );
      message.success("Đã xóa các thông báo đã chọn thành công!");
      setSelectedRowKeys([]);
      fetchNotifications(pagination.page, searchText);
      fetchStats();
    } catch (error: any) {
      message.error(error.message || "Xóa thông báo thất bại");
    }
  };

  const handleBulkMarkAsRead = async () => {
    try {
      await notificationService.bulkMarkAsRead(selectedRowKeys as string[]);
      message.success("Đã đánh dấu các thông báo đã chọn là đã đọc!");
      setSelectedRowKeys([]);
      fetchNotifications(pagination.page, searchText);
      fetchStats();
    } catch (error: any) {
      message.error(error.message || "Đánh dấu đã đọc thất bại");
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchNotifications(1, value);
  };

  const handleRefresh = () => {
    fetchNotifications(pagination.page, searchText);
    fetchStats();
  };

  const handleTableChange = (pagination: any, filters: any) => {
    fetchNotifications(pagination.current, searchText, filters);
  };

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
    const filters: any = {};

    switch (key) {
      case "unread":
        filters.isRead = false;
        break;
      case "important":
        filters.isImportant = true;
        break;
      case "scheduled":
        filters.scheduled = true;
        break;
      case "expired":
        filters.expired = true;
        break;
    }

    fetchNotifications(1, searchText, filters);
  };

  const getTypeTag = (type: string) => {
    const config = {
      info: { color: "blue", text: "Thông tin", icon: <BellOutlined /> },
      warning: { color: "orange", text: "Cảnh báo", icon: <BellOutlined /> },
      success: { color: "green", text: "Thành công", icon: <CheckOutlined /> },
      error: { color: "red", text: "Lỗi", icon: <FireOutlined /> },
      system: { color: "purple", text: "Hệ thống", icon: <BellOutlined /> },
    };

    const typeConfig = config[type as keyof typeof config] || config.info;
    return (
      <Tag color={typeConfig.color} icon={typeConfig.icon}>
        {typeConfig.text}
      </Tag>
    );
  };

  const getStatusBadge = (notification: Notification) => {
    const now = dayjs();
    const scheduledAt = notification.scheduledAt
      ? dayjs(notification.scheduledAt)
      : null;
    const expiresAt = notification.expiresAt
      ? dayjs(notification.expiresAt)
      : null;

    if (notification.isScheduled && scheduledAt && scheduledAt.isAfter(now)) {
      return (
        <Badge status="processing" text="Đã lên lịch" style={{ fontSize: 12 }} />
      );
    }

    if (notification.isExpired || (expiresAt && expiresAt.isBefore(now))) {
      return <Badge status="default" text="Hết hạn" style={{ fontSize: 12 }} />;
    }

    if (!notification.isRead) {
      return (
        <Badge status="warning" text="Chưa đọc" style={{ fontSize: 12 }} />
      );
    }

    if (notification.isSent) {
      return <Badge status="success" text="Đã gửi" style={{ fontSize: 12 }} />;
    }

    return <Badge status="default" text="Chờ xử lý" style={{ fontSize: 12 }} />;
  };

  const sendTestNotification = async () => {
    try {
      await notificationService.sendTestNotification();
      message.success("Đã gửi thông báo test thành công!");
    } catch (error: any) {
      message.error(error.message || "Gửi thông báo test thất bại");
    }
  };

  const columns: ColumnsType<Notification> = [
    {
      title: "Thông báo",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Notification) => (
        <Space direction="vertical" size={2}>
          <Space>
            {record.isImportant && <Badge dot color="red" offset={[-5, 0]} />}
            <Text strong style={{ fontSize: 14 }}>
              {title}
            </Text>
            {record.sendToAll && (
              <Tooltip title="Gửi đến tất cả người dùng">
                <GlobalOutlined style={{ color: "#1890ff", fontSize: 12 }} />
              </Tooltip>
            )}
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.message}
          </Text>
          <Space size={8} style={{ marginTop: 4 }}>
            {getTypeTag(record.type)}
            {getStatusBadge(record)}
            {record.sendToAll && (
              <Tag color="cyan" icon={<TeamOutlined />}>
                Tất cả
              </Tag>
            )}
          </Space>
        </Space>
      ),
    },
    {
      title: "Người nhận",
      dataIndex: "recipients",
      key: "recipients",
      render: (recipients: User[], record: Notification) => {
        if (record.sendToAll) {
          return (
            <Space>
              <Avatar
                icon={<TeamOutlined />}
                style={{ backgroundColor: "#87d068" }}
                size="small"
              />
              <Text style={{ fontSize: 12 }}>Tất cả người dùng</Text>
            </Space>
          );
        }

        if (recipients && recipients.length > 0) {
          const firstRecipient = recipients[0];
          return (
            <Space>
              <Avatar
                src={
                  firstRecipient.avatar ||
                  `https://ui-avatars.com/api/?name=${firstRecipient.fullname}&background=random`
                }
                size="small"
                icon={!firstRecipient.avatar && <UserOutlined />}
              />
              <div>
                <Text style={{ fontSize: 12 }}>{firstRecipient.fullname}</Text>
                {recipients.length > 1 && (
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    +{recipients.length - 1} người khác
                  </Text>
                )}
              </div>
            </Space>
          );
        }

        if (record.user) {
          return (
            <Space>
              <Avatar
                src={
                  record.user.avatar ||
                  `https://ui-avatars.com/api/?name=${record.user.fullname}&background=random`
                }
                size="small"
                icon={!record.user.avatar && <UserOutlined />}
              />
              <Text style={{ fontSize: 12 }}>{record.user.fullname}</Text>
            </Space>
          );
        }

        return <Text type="secondary" style={{ fontSize: 12 }}>Không có</Text>;
      },
    },
    {
      title: "Thời gian lên lịch",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (scheduledAt: string | null, record: Notification) => {
        if (record.isScheduled && scheduledAt) {
          return (
            <Space direction="vertical" size={0}>
              <Text style={{ fontSize: 12 }}>
                {dayjs(scheduledAt).format("DD/MM/YYYY")}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {dayjs(scheduledAt).format("HH:mm")}
              </Text>
            </Space>
          );
        }
        return (
          <Text type="secondary" style={{ fontSize: 12 }}>
            Ngay lập tức
          </Text>
        );
      },
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => (
        <Text style={{ fontSize: 12 }}>
          {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Notification) => {
        const now = dayjs();
        const scheduledAt = record.scheduledAt
          ? dayjs(record.scheduledAt)
          : null;
        const expiresAt = record.expiresAt ? dayjs(record.expiresAt) : null;
        const isExpired = record.isExpired || (expiresAt && expiresAt.isBefore(now));
        const isScheduled = record.isScheduled && scheduledAt && scheduledAt.isAfter(now);

        const items: MenuProps["items"] = [
          !record.isRead && !isExpired && !isScheduled && {
            key: "mark-read",
            label: "Đánh dấu đã đọc",
            icon: <CheckOutlined />,
            onClick: () => handleMarkAsRead(record.id),
          },
          {
            key: "view-details",
            label: "Xem chi tiết",
            icon: <EyeOutlined />,
            onClick: () => {
              Modal.info({
                title: record.title,
                content: (
                  <div style={{ marginTop: 16 }}>
                    <p>
                      <strong>Nội dung:</strong> {record.message}
                    </p>
                    <p>
                      <strong>Loại:</strong> {getTypeTag(record.type)}
                    </p>
                    <p>
                      <strong>Quan trọng:</strong>{" "}
                      {record.isImportant ? "Có" : "Không"}
                    </p>
                    <p>
                      <strong>Gửi đến:</strong>{" "}
                      {record.sendToAll
                        ? "Tất cả người dùng"
                        : `${record.recipients?.length || 1} người dùng`}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong> {getStatusBadge(record)}
                    </p>
                    <p>
                      <strong>Thời gian tạo:</strong>{" "}
                      {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                    {record.scheduledAt && (
                      <p>
                        <strong>Thời gian lên lịch:</strong>{" "}
                        {dayjs(record.scheduledAt).format("DD/MM/YYYY HH:mm")}
                      </p>
                    )}
                    {record.expiresAt && (
                      <p>
                        <strong>Hết hạn:</strong>{" "}
                        {dayjs(record.expiresAt).format("DD/MM/YYYY HH:mm")}
                      </p>
                    )}
                    {record.sentAt && (
                      <p>
                        <strong>Đã gửi lúc:</strong>{" "}
                        {dayjs(record.sentAt).format("DD/MM/YYYY HH:mm")}
                      </p>
                    )}
                  </div>
                ),
                width: 500,
              });
            },
          },
          !isScheduled &&
            !isExpired && {
              key: "send-now",
              label: "Gửi ngay",
              icon: <SendOutlined />,
              onClick: async () => {
                try {
                  await notificationService.resendNotification(record.id);
                  message.success("Đã gửi lại thông báo!");
                } catch (error: any) {
                  message.error(error.message || "Gửi thông báo thất bại");
                }
              },
            },
          {
            key: "delete",
            label: "Xóa",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record.id),
          },
        ].filter(Boolean) as MenuProps["items"];

        return (
          <Space>
            {!record.isRead && !isExpired && !isScheduled && (
              <Tooltip title="Đánh dấu đã đọc">
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  size="small"
                  onClick={() => handleMarkAsRead(record.id)}
                />
              </Tooltip>
            )}
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Button type="text" icon={<MoreOutlined />} size="small" />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title
            level={2}
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🔔 Quản lý Thông báo
          </Title>
          <Text type="secondary">
            Gửi và quản lý thông báo thời gian thực
          </Text>
        </Col>
        <Col>
          <Space>
            <AntdInput
              placeholder="Tìm kiếm thông báo..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => handleSearch(searchText)}
              style={{ width: 250 }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Làm mới
            </Button>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "send-immediate",
                    label: "Gửi ngay lập tức",
                    icon: <SendOutlined />,
                    onClick: () => {
                      setEditingNotification(null);
                      setIsModalOpen(true);
                      form.resetFields();
                      setSendToAll(true);
                    },
                  },
                  {
                    key: "schedule",
                    label: "Lên lịch thông báo",
                    icon: <ScheduleOutlined />,
                    onClick: () => {
                      setEditingNotification(null);
                      setIsScheduleModalOpen(true);
                      scheduleForm.resetFields();
                      setScheduleSendToAll(true);
                    },
                  },
                ],
              }}
            >
              <Button type="primary" icon={<PlusOutlined />}>
                Thông báo mới
              </Button>
            </Dropdown>
            <Button
              type="default"
              icon={<BellOutlined />}
              onClick={sendTestNotification}
            >
              Test
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card
            size="small"
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Space direction="vertical">
              <Text style={{ color: "white", opacity: 0.9 }}>Tổng số</Text>
              <Title level={3} style={{ margin: 0, color: "white" }}>
                {realtimeStats.total}
              </Title>
              <BellOutlined style={{ color: "white", opacity: 0.7 }} />
            </Space>
          </Card>
        </Col>
        <Col span={4}>
          <Card
            size="small"
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <Space direction="vertical">
              <Text style={{ color: "white", opacity: 0.9 }}>Chưa đọc</Text>
              <Title level={3} style={{ margin: 0, color: "white" }}>
                {realtimeStats.unread}
              </Title>
              <MailOutlined style={{ color: "white", opacity: 0.7 }} />
            </Space>
          </Card>
        </Col>
        <Col span={4}>
          <Card
            size="small"
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
              color: "white",
            }}
          >
            <Space direction="vertical">
              <Text style={{ color: "white", opacity: 0.9 }}>Quan trọng</Text>
              <Title level={3} style={{ margin: 0, color: "white" }}>
                {realtimeStats.important}
              </Title>
              <FireOutlined style={{ color: "white", opacity: 0.7 }} />
            </Space>
          </Card>
        </Col>
        <Col span={4}>
          <Card
            size="small"
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <Space direction="vertical">
              <Text style={{ color: "white", opacity: 0.9 }}>Đã lên lịch</Text>
              <Title level={3} style={{ margin: 0, color: "white" }}>
                {realtimeStats.scheduled}
              </Title>
              <ClockCircleOutlined style={{ color: "white", opacity: 0.7 }} />
            </Space>
          </Card>
        </Col>
        <Col span={4}>
          <Card
            size="small"
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              color: "#333",
            }}
          >
            <Space direction="vertical">
              <Text style={{ color: "#333", opacity: 0.9 }}>Đã hết hạn</Text>
              <Title level={3} style={{ margin: 0, color: "#333" }}>
                {realtimeStats.expired}
              </Title>
              <ClockCircleOutlined style={{ color: "#333", opacity: 0.7 }} />
            </Space>
          </Card>
        </Col>
        <Col span={4}>
          <Card
            size="small"
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
              color: "#333",
            }}
          >
            <Space direction="vertical">
              <Text style={{ color: "#333", opacity: 0.9 }}>Hôm nay</Text>
              <Title level={3} style={{ margin: 0, color: "#333" }}>
                {realtimeStats.sentToday}
              </Title>
              <SendOutlined style={{ color: "#333", opacity: 0.7 }} />
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        <Tabs activeKey={currentTab} onChange={handleTabChange}>
          <TabPane tab="Tất cả thông báo" key="all" />
          <TabPane
            tab={
              <Badge count={realtimeStats.unread} offset={[10, 0]}>
                Chưa đọc
              </Badge>
            }
            key="unread"
          />
          <TabPane tab="Quan trọng" key="important" />
          <TabPane tab="Đã lên lịch" key="scheduled" />
          <TabPane tab="Hết hạn" key="expired" />
        </Tabs>

        {hasSelected && (
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Text>Đã chọn {selectedRowKeys.length} thông báo</Text>
              <Button onClick={handleBulkMarkAsRead} icon={<CheckOutlined />}>
                Đánh dấu đã đọc
              </Button>
              <Popconfirm
                title="Xóa các thông báo đã chọn?"
                description="Bạn có chắc chắn muốn xóa những thông báo này không?"
                onConfirm={handleBulkDelete}
                okText="Có"
                cancelText="Không"
              >
                <Button danger icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
              <Button onClick={() => setSelectedRowKeys([])}>
                Bỏ chọn
              </Button>
            </Space>
          </div>
        )}

        <Spin spinning={loading}>
          <Table
            dataSource={notifications}
            columns={columns}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng cộng ${total} thông báo`,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        </Spin>
      </Card>

      {/* Send Immediate Notification Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SendOutlined />
            Gửi thông báo ngay lập tức
          </div>
        }
        open={isModalOpen}
        onOk={handleAddNotification}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingNotification(null);
          form.resetFields();
          setSendToAll(true);
        }}
        okText="Gửi ngay"
        cancelText="Hủy"
        width={600}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="sendToAll"
            label="Gửi đến"
            initialValue={true}
            rules={[{ required: true, message: "Vui lòng chọn đối tượng nhận" }]}
          >
            <Radio.Group onChange={(e) => setSendToAll(e.target.value)}>
              <Radio value={true}>
                <Space>
                  <GlobalOutlined />
                  Tất cả người dùng
                </Space>
              </Radio>
              <Radio value={false}>
                <Space>
                  <TeamOutlined />
                  Chọn người dùng cụ thể
                </Space>
              </Radio>
            </Radio.Group>
          </Form.Item>

          {!sendToAll && (
            <Form.Item
              name="userIds"
              label="Người nhận"
              rules={[{ required: true, message: "Vui lòng chọn người nhận" }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn người dùng"
                loading={loadingUsers}
                allowClear
                style={{ width: "100%" }}
                maxTagCount={3}
                maxTagTextLength={10}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>
                    <Space>
                      <Avatar
                        src={user.avatar}
                        size="small"
                        icon={<UserOutlined />}
                      />
                      <span>{user.fullname}</span>
                      <Tag color={user.role?.name === "admin" ? "red" : "blue"}>
                        {user.role?.name}
                      </Tag>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Nhập tiêu đề thông báo" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung thông báo"
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Loại thông báo" initialValue="info">
                <Select>
                  <Option value="info">
                    <Tag color="blue">Thông tin</Tag>
                  </Option>
                  <Option value="warning">
                    <Tag color="orange">Cảnh báo</Tag>
                  </Option>
                  <Option value="success">
                    <Tag color="green">Thành công</Tag>
                  </Option>
                  <Option value="error">
                    <Tag color="red">Lỗi</Tag>
                  </Option>
                  <Option value="system">
                    <Tag color="purple">Hệ thống</Tag>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isImportant"
                label="Ưu tiên"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Quan trọng"
                  unCheckedChildren="Bình thường"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Schedule Notification Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ScheduleOutlined />
            Lên lịch thông báo
          </div>
        }
        open={isScheduleModalOpen}
        onOk={handleScheduleNotification}
        onCancel={() => {
          setIsScheduleModalOpen(false);
          scheduleForm.resetFields();
          setScheduleSendToAll(true);
        }}
        okText="Lên lịch"
        cancelText="Hủy"
        width={600}
        confirmLoading={loading}
      >
        <Form form={scheduleForm} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="sendToAll"
            label="Gửi đến"
            initialValue={true}
            rules={[{ required: true, message: "Vui lòng chọn đối tượng nhận" }]}
          >
            <Radio.Group onChange={(e) => setScheduleSendToAll(e.target.value)}>
              <Radio value={true}>
                <Space>
                  <GlobalOutlined />
                  Tất cả người dùng
                </Space>
              </Radio>
              <Radio value={false}>
                <Space>
                  <TeamOutlined />
                  Chọn người dùng cụ thể
                </Space>
              </Radio>
            </Radio.Group>
          </Form.Item>

          {!scheduleSendToAll && (
            <Form.Item
              name="userIds"
              label="Người nhận"
              rules={[{ required: true, message: "Vui lòng chọn người nhận" }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn người dùng"
                loading={loadingUsers}
                allowClear
                style={{ width: "100%" }}
                maxTagCount={3}
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>
                    <Space>
                      <Avatar src={user.avatar} size="small" />
                      <span>{user.fullname}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Nhập tiêu đề thông báo" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung thông báo"
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="scheduledAt"
                label="Thời gian lên lịch"
                rules={[
                  { required: true, message: "Vui lòng chọn thời gian lên lịch" },
                ]}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                  placeholder="Chọn ngày và giờ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expiresAt" label="Thời gian hết hạn (Tùy chọn)">
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    const scheduledAt =
                      scheduleForm.getFieldValue("scheduledAt");
                    if (scheduledAt) {
                      return current && current < dayjs(scheduledAt);
                    }
                    return current && current < dayjs();
                  }}
                  placeholder="Chọn ngày và giờ"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Loại thông báo" initialValue="info">
                <Select>
                  <Option value="info">
                    <Tag color="blue">Thông tin</Tag>
                  </Option>
                  <Option value="warning">
                    <Tag color="orange">Cảnh báo</Tag>
                  </Option>
                  <Option value="success">
                    <Tag color="green">Thành công</Tag>
                  </Option>
                  <Option value="error">
                    <Tag color="red">Lỗi</Tag>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isImportant"
                label="Ưu tiên"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Quan trọng"
                  unCheckedChildren="Bình thường"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminNotificationsPage;
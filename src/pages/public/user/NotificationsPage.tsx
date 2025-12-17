import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Typography,
  List,
  Tag,
  Avatar,
  Space,
  Button,
  Empty,
  Spin,
  Popconfirm,
  message,
  Tabs,
  Badge,
  Select,
  Row,
  Col,
} from "antd";
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  FireOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { notificationService } from "@/services/notificationService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

dayjs.extend(relativeTime);
dayjs.locale("vi");

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      switch (activeTab) {
        case "unread":
          params.isRead = false;
          break;
        case "important":
          params.isImportant = true;
          break;
      }

      if (filterType !== "all") {
        params.type = filterType;
      }

      const response = await notificationService.getNotifications(params);
      setNotifications(response.notifications || []);
      setPagination(response.pagination);
    } catch (error) {
      message.error("Không thể tải thông báo");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filterType, pagination.page, pagination.limit]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      message.success("Đã đánh dấu là đã đọc");
    } catch (error) {
      message.error("Đánh dấu đã đọc thất bại");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      message.success("Đã đánh dấu tất cả là đã đọc");
    } catch (error) {
      message.error("Đánh dấu tất cả đã đọc thất bại");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      message.success("Đã xóa thông báo");
    } catch (error) {
      message.error("Xóa thông báo thất bại");
    }
  };

  const handleBulkDelete = async () => {
    const notificationIds = notifications.map((n) => n.id);
    if (notificationIds.length === 0) return;

    try {
      await notificationService.bulkDeleteNotifications(notificationIds);
      setNotifications([]);
      message.success("Đã xóa tất cả thông báo");
    } catch (error) {
      message.error("Xóa thông báo thất bại");
    }
  };

  const getNotificationIcon = (type: string, isImportant: boolean) => {
    if (isImportant) {
      return <FireOutlined style={{ color: "#ff4d4f" }} />;
    }

    switch (type) {
      case "success":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "warning":
      case "error":
        return <ExclamationCircleOutlined style={{ color: "#faad14" }} />;
      case "system":
        return <InfoCircleOutlined style={{ color: "#722ed1" }} />;
      default:
        return <InfoCircleOutlined style={{ color: "#1890ff" }} />;
    }
  };

  const getNotificationTag = (type: string) => {
    const config: Record<string, { color: string; text: string }> = {
      info: { color: "blue", text: "Thông tin" },
      warning: { color: "orange", text: "Cảnh báo" },
      success: { color: "green", text: "Thành công" },
      error: { color: "red", text: "Lỗi" },
      system: { color: "purple", text: "Hệ thống" },
    };

    const typeConfig = config[type] || config.info;
    return <Tag color={typeConfig.color}>{typeConfig.text}</Tag>;
  };

  const getRelativeTime = (dateString: string) => {
    return dayjs(dateString).fromNow();
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Card
        style={{
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Space size="large">
              <Title level={3} style={{ margin: 0 }}>
                <BellOutlined style={{ marginRight: 8 }} />
                Thông báo của tôi
              </Title>
              <Badge
                count={unreadCount}
                showZero
                style={{ backgroundColor: "#52c41a" }}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              {unreadCount > 0 && (
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleMarkAllAsRead}
                >
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
              {notifications.length > 0 && (
                <Popconfirm
                  title="Xóa tất cả thông báo?"
                  description="Bạn có chắc chắn muốn xóa tất cả thông báo không?"
                  onConfirm={handleBulkDelete}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Xóa tất cả
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Space>
              <FilterOutlined />
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: 120 }}
                size="small"
              >
                <Option value="all">Tất cả loại</Option>
                <Option value="info">Thông tin</Option>
                <Option value="warning">Cảnh báo</Option>
                <Option value="success">Thành công</Option>
                <Option value="error">Lỗi</Option>
                <Option value="system">Hệ thống</Option>
              </Select>
            </Space>
          }
        >
          <TabPane tab="Tất cả" key="all" />
          <TabPane
            tab={
              <Badge count={unreadCount} offset={[8, 0]}>
                Chưa đọc
              </Badge>
            }
            key="unread"
          />
          <TabPane tab="Quan trọng" key="important" />
        </Tabs>

        {loading ? (
          <div style={{ padding: 100, textAlign: "center" }}>
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              activeTab === "all"
                ? "Không có thông báo nào"
                : activeTab === "unread"
                ? "Không có thông báo chưa đọc"
                : "Không có thông báo quan trọng"
            }
            style={{ padding: 80 }}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                key={notification.id}
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid #f0f0f0",
                  backgroundColor: notification.isRead
                    ? "transparent"
                    : "#f6ffed",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={48}
                      icon={getNotificationIcon(
                        notification.type,
                        notification.isImportant
                      )}
                      style={{
                        backgroundColor: notification.isRead
                          ? "#f0f0f0"
                          : "#e6f7ff",
                      }}
                    />
                  }
                  title={
                    <Space size="small" align="start" style={{ width: "100%" }}>
                      <Text
                        strong
                        style={{
                          fontSize: 16,
                          flex: 1,
                          color: notification.isRead ? "#666" : "#333",
                        }}
                      >
                        {notification.title}
                      </Text>
                      <Space size={4}>
                        {getNotificationTag(notification.type)}
                        {notification.isImportant && (
                          <Tag color="red" icon={<FireOutlined />}>
                            Quan trọng
                          </Tag>
                        )}
                        {!notification.isRead && (
                          <Tag color="orange">Chưa đọc</Tag>
                        )}
                        {notification.sendToAll && (
                          <Tag color="cyan">Gửi đến tất cả</Tag>
                        )}
                      </Space>
                    </Space>
                  }
                  description={
                    <div style={{ marginTop: 8 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        {notification.message}
                      </Text>
                      <Space
                        size="middle"
                        style={{ fontSize: 12, color: "#999" }}
                      >
                        <Text>
                          <EyeOutlined style={{ marginRight: 4 }} />
                          {getRelativeTime(notification.createdAt)}
                        </Text>
                        <Text>|</Text>
                        <Text>{formatDate(notification.createdAt)}</Text>
                        {notification.scheduledAt && (
                          <>
                            <Text>|</Text>
                            <Text>
                              Lên lịch: {formatDate(notification.scheduledAt)}
                            </Text>
                          </>
                        )}
                      </Space>
                    </div>
                  }
                />
                <Space direction="vertical" size={8}>
                  {!notification.isRead && (
                    <Button
                      type="link"
                      icon={<CheckOutlined />}
                      onClick={() => handleMarkAsRead(notification.id)}
                      size="small"
                    >
                      Đánh dấu đã đọc
                    </Button>
                  )}
                  <Popconfirm
                    title="Xóa thông báo này?"
                    description="Bạn có chắc chắn muốn xóa thông báo này không?"
                    onConfirm={() => handleDeleteNotification(notification.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              </List.Item>
            )}
          />
        )}

        {pagination.totalPages > 1 && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
              style={{ marginRight: 8 }}
            >
              Trước
            </Button>
            <Text type="secondary">
              Trang {pagination.page} / {pagination.totalPages}
            </Text>
            <Button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages}
              style={{ marginLeft: 8 }}
            >
              Sau
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationsPage;

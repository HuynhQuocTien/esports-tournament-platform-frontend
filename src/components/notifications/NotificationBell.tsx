import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Badge,
  Button,
  Dropdown,
  List,
  Typography,
  Space,
  Tag,
  Avatar,
  Spin,
  Empty,
  Popconfirm,
  message,
} from "antd";
import {
  BellOutlined,
  EyeOutlined,
  CheckOutlined,
  DeleteOutlined,
  FireOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { notificationService } from "@/services/notificationService";
import NotificationSocket from "@/services/notificationSocket";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text } = Typography;

interface NotificationBellProps {
  userId?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredNotificationId, setHoveredNotificationId] = useState<
    string | null
  >(null);
  const [hoveredButton, setHoveredButton] = useState(false);
  const socketRef = useRef<NotificationSocket | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await notificationService.getNotifications({
        limit: 10,
        page: 1,
      });
      setNotifications(response.notifications || []);

      const unread = (response.notifications || []).filter(
        (n: any) => !n.isRead
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;

    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && userId) {
      socketRef.current = new NotificationSocket(token);
      socketRef.current.connect();

      socketRef.current.on("new-notification", (notification: any) => {
        message.info(`Thông báo mới: ${notification.title}`);
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      socketRef.current.on("important-notification", (notification: any) => {
        const modal = require("antd").Modal;
        modal.warning({
          title: "Thông báo quan trọng",
          content: notification.message,
          okText: "Xác nhận",
          onOk: () => {
            socketRef.current?.ackImportantNotification(notification.id);
          },
        });
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [userId, fetchNotifications, fetchUnreadCount]);

  const handleMarkAsRead = async (
    notificationId: string,
    event?: React.MouseEvent
  ) => {
    event?.stopPropagation();
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

  const handleDeleteNotification = async (
    notificationId: string,
    event?: React.MouseEvent
  ) => {
    event?.stopPropagation();
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      const notification = notifications.find((n) => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      message.success("Đã xóa thông báo");
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

  const notificationList = (
    <div
      style={{
        width: 400,
        maxHeight: 500,
        overflowY: "auto",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow:
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Text strong style={{ fontSize: "16px", color: "#1d1d1f" }}>
            Thông báo
          </Text>
          {unreadCount > 0 && (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={handleMarkAllAsRead}
              style={{
                color: "#0066cc",
                fontWeight: 500,
                padding: "4px 8px",
              }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </Space>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có thông báo"
          style={{
            padding: "60px 0",
            backgroundColor: "#ffffff",
          }}
          imageStyle={{ height: 60 }}
        />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              key={notification.id}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                backgroundColor:
                  hoveredNotificationId === notification.id
                    ? "#f5f5f5"
                    : notification.isRead
                    ? "#ffffff"
                    : "#f9f9f9",
                borderBottom: "1px solid #f0f0f0",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={() => setHoveredNotificationId(notification.id)}
              onMouseLeave={() => setHoveredNotificationId(null)}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: notification.isRead
                        ? "#f0f0f0"
                        : "#e6f7ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "12px",
                    }}
                  >
                    {getNotificationIcon(
                      notification.type,
                      notification.isImportant
                    )}
                  </div>
                }
                title={
                  <div>
                    <Space
                      size="small"
                      align="center"
                      style={{ marginBottom: "4px" }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: "14px",
                          color: notification.isRead ? "#666" : "#1d1d1f",
                          lineHeight: "1.4",
                        }}
                      >
                        {notification.title}
                      </Text>
                      {!notification.isRead && (
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#ff4d4f",
                            marginLeft: "4px",
                          }}
                        />
                      )}
                    </Space>
                    <Space size={4} style={{ marginBottom: "4px" }}>
                      {getNotificationTag(notification.type)}
                      {notification.isImportant && (
                        <Tag
                          color="#fff1f0"
                          style={{
                            color: "#ff4d4f",
                            borderColor: "#ffa39e",
                            fontSize: "11px",
                            padding: "0 6px",
                            height: "20px",
                          }}
                        >
                          Quan trọng
                        </Tag>
                      )}
                    </Space>
                  </div>
                }
                description={
                  <div>
                    <Text
                      style={{
                        fontSize: "13px",
                        color: notification.isRead ? "#86868b" : "#515154",
                        lineHeight: "1.5",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      {notification.message}
                    </Text>
                    <Space
                      size={4}
                      style={{ fontSize: "12px", color: "#86868b" }}
                    >
                      <Text>{getRelativeTime(notification.createdAt)}</Text>
                      {notification.sendToAll && (
                        <>
                          <Text>•</Text>
                          <Text style={{ color: "#0066cc" }}>
                            Gửi đến tất cả
                          </Text>
                        </>
                      )}
                    </Space>
                  </div>
                }
              />
              <Space
                direction="vertical"
                size={4}
                style={{ marginLeft: "8px" }}
              >
                {!notification.isRead && (
                  <Button
                    type="text"
                    size="small"
                    icon={<CheckOutlined />}
                    title="Đánh dấu đã đọc"
                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                    style={{
                      color: "#0066cc",
                      width: "32px",
                      height: "32px",
                      minWidth: "32px",
                    }}
                  />
                )}
                <Popconfirm
                  title="Xóa thông báo này?"
                  description="Bạn có chắc chắn muốn xóa thông báo này không?"
                  onConfirm={(e) =>
                    handleDeleteNotification(notification.id, e as any)
                  }
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    title="Xóa thông báo"
                    danger
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "32px",
                      height: "32px",
                      minWidth: "32px",
                    }}
                  />
                </Popconfirm>
              </Space>
            </List.Item>
          )}
          style={{ backgroundColor: "#ffffff" }}
        />
      )}

      {/* Footer */}
      {notifications.length > 0 && (
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #f0f0f0",
            textAlign: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Link
            to="/notifications"
            onClick={() => setDropdownOpen(false)}
            style={{
              color: "#0066cc",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            Xem tất cả thông báo
          </Link>
        </div>
      )}
    </div>
  );

  if (!userId) return null;

  return (
  <Dropdown
    open={dropdownOpen}
    onOpenChange={setDropdownOpen}
    dropdownRender={() => notificationList}
    placement="bottomRight"
    trigger={['click']}
    overlayStyle={{
      padding: 0,
      borderRadius: '12px',
    }}
  >
    <Badge
      count={unreadCount}
      size="small"
      offset={[-4, 4]}
      style={{ 
        cursor: 'pointer',
      }}
    >
      <Button
        type="text"
        icon={
          <BellOutlined
            style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          />
        }
        style={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: hoveredButton ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          border: hoveredButton ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHoveredButton(true)}
        onMouseLeave={() => setHoveredButton(false)}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      />
    </Badge>
  </Dropdown>
);
};

export default NotificationBell;

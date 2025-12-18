// frontend/src/pages/public/tournaments/TournamentsPage.tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Statistic,
  Spin,
  Alert,
  Input,
  Select,
  Pagination,
} from "antd";
import { Link } from "react-router-dom";
import {
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
  EyeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { tournamentService } from "@/services/tournamentService";
import type {
  TournamentBasicInfo,
  PaginatedTournamentsResponse,
} from "@/common/types";
import { ProtectedLink } from "@/components/common/ProtectedLink";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

export const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<TournamentBasicInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    game: "",
    status: "",
    search: "",
  });

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const response = await tournamentService.getPublicTournaments({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setTournaments(response.data.data || []);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách giải đấu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, [pagination.page, filters]);

  const getStatusConfig = (status?: string) => {
    const config = {
      DRAFT: {
        color: "default",
        text: "Bản nháp",
        icon: <ClockCircleOutlined />,
      },
      UPCOMING: {
        color: "blue",
        text: "Sắp diễn ra",
        icon: <ClockCircleOutlined />,
      },
      REGISTRATION: {
        color: "green",
        text: "Đang đăng ký",
        icon: <CheckCircleOutlined />,
      },
      LIVE: {
        color: "orange",
        text: "Đang diễn ra",
        icon: <PlayCircleOutlined />,
      },
      COMPLETED: {
        color: "default",
        text: "Đã kết thúc",
        icon: <TrophyOutlined />,
      },
    };
    const key = (status || "UPCOMING") as keyof typeof config;
    return config[key] || config.UPCOMING;
  };

  const getStatusTag = (status?: string) => {
    const config = getStatusConfig(status);
    return (
      <Tag color={config.color} icon={config.icon} style={{ margin: 0 }}>
        {config.text}
      </Tag>
    );
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  if (loading && tournaments.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error && tournaments.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={loadTournaments}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  const stats = {
    total: pagination.total,
    ongoing: tournaments.filter((t) => t.status === "LIVE").length,
    upcoming: tournaments.filter(
      (t) => t.status === "UPCOMING" || t.status === "REGISTRATION"
    ).length,
    totalPrize: tournaments.reduce((acc, t) => acc + (t.prizePool ?? 0), 0),
  };

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Title level={1} style={{ color: "#1a1a1a", marginBottom: 8 }}>
          Giải Đấu Esports
        </Title>
        <Text type="secondary" style={{ fontSize: 18 }}>
          Khám phá các giải đấu hàng đầu và tham gia ngay hôm nay
        </Text>
      </div>

      {/* Search và Filter */}
      <Card style={{ marginBottom: 32, borderRadius: 12 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Search
              placeholder="Tìm kiếm giải đấu..."
              prefix={<SearchOutlined />}
              onSearch={handleSearch}
              enterButton
              size="large"
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Lọc theo game"
              style={{ width: "100%" }}
              size="large"
              value={filters.game || undefined}
              onChange={(value) => handleFilterChange("game", value)}
              allowClear
            >
              <Option value="Valorant">Valorant</Option>
              <Option value="League of Legends">League of Legends</Option>
              <Option value="CS:GO">CS:GO</Option>
              <Option value="Dota 2">Dota 2</Option>
              <Option value="PUBG">PUBG</Option>
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: "100%" }}
              size="large"
              value={filters.status || undefined}
              onChange={(value) => handleFilterChange("status", value)}
              allowClear
            >
              <Option value="UPCOMING">Sắp diễn ra</Option>
              <Option value="REGISTRATION">Đang đăng ký</Option>
              <Option value="LIVE">Đang diễn ra</Option>
              <Option value="COMPLETED">Đã kết thúc</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Stats Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng số giải đấu"
              value={stats.total}
              prefix={<TrophyOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang diễn ra"
              value={stats.ongoing}
              prefix={<PlayCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Sắp diễn ra"
              value={stats.upcoming}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng giải thưởng"
              value={stats.totalPrize}
              prefix={<DollarOutlined style={{ color: "#ff4d4f" }} />}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Tournaments Grid */}
      {tournaments.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <Title level={3} type="secondary">
            Không tìm thấy giải đấu nào
          </Title>
          <Text type="secondary">
            Hãy thử thay đổi bộ lọc hoặc tìm kiếm khác
          </Text>
        </Card>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {tournaments.map((tournament) => (
              <Col xs={24} sm={12} xl={6} key={tournament.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 16,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    background: "white",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  bodyStyle={{
                    padding: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Tournament Image */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      alt={tournament.name}
                      src={
                        tournament.bannerUrl ||
                        `https://picsum.photos/seed/${tournament.id}/600/300`
                      }
                      style={{ width: "100%", height: 160, objectFit: "cover" }}
                      onError={(e) => {
                        (
                          e.target as HTMLImageElement
                        ).src = `https://picsum.photos/seed/${tournament.id}/600/300`;
                      }}
                    />
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      {getStatusTag(tournament.status)}
                    </div>
                  </div>

                  {/* Tournament Content */}
                  <div
                    style={{
                      padding: 20,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Title
                      level={4}
                      style={{ margin: 0, marginBottom: 8, minHeight: 44 }}
                    >
                      {tournament.name}
                    </Title>

                    <Paragraph
                      type="secondary"
                      style={{
                        margin: 0,
                        marginBottom: 16,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.5,
                      }}
                    >
                      {tournament.description || "Giải đấu Esports hấp dẫn"}
                    </Paragraph>

                    <div style={{ marginBottom: 20 }}>
                      <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        size={12}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Space>
                            <TrophyOutlined style={{ color: "#faad14" }} />
                            <Text strong style={{ fontSize: 14 }}>
                              {tournament.game}
                            </Text>
                          </Space>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {tournament.organizer?.name || "Unknown"}
                          </Text>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Space>
                            <CalendarOutlined style={{ color: "#1890ff" }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Bắt đầu:{" "}
                              {tournament.tournamentStart
                                ? tournament.tournamentStart
                                    .toDate()
                                    .toLocaleDateString()
                                : "Chưa xác định"}{" "}
                            </Text>
                          </Space>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Space>
                            <TeamOutlined style={{ color: "#52c41a" }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {tournament.registeredTeams}/{tournament.maxTeams}{" "}
                              đội
                            </Text>
                          </Space>
                          <Space>
                            <DollarOutlined style={{ color: "#ff4d4f" }} />
                            <Text
                              strong
                              style={{ fontSize: 14, color: "#ff4d4f" }}
                            >
                              ${tournament.prizePool?.toLocaleString()}
                            </Text>
                          </Space>
                        </div>
                      </Space>
                    </div>

                    {/* Action Button */}
                    <div style={{ marginTop: "auto" }}>
                      <ProtectedLink
                        to={`/tournaments/${tournament.id}`}
                        requireAuth={true}
                        authMessage="Đăng nhập để xem chi tiết giải đấu"
                      >
                        <Button
                          type="primary"
                          block
                          icon={<EyeOutlined />}
                          size="large"
                          style={{
                            borderRadius: 8,
                            height: 40,
                            fontSize: 14,
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </ProtectedLink>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Pagination
              current={pagination.page}
              total={pagination.total}
              pageSize={pagination.limit}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} giải đấu`
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

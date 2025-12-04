import React, { useState, useEffect } from 'react';
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
  Image
} from 'antd';
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
  PhoneOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

interface Team {
  id: string;
  name: string;
  game: string;
  gameId?: string;
  logo?: string;
  description?: string;
  members: number;
  maxMembers: number;
  captain: string;
  captainId?: string;
  status: 'active' | 'inactive' | 'recruiting';
  createdAt: string;
  updatedAt: string;
  avatar: string;
  winRate: number;
  tournamentsCount: number;
  contactEmail?: string;
  contactPhone?: string;
  discordLink?: string;
  tags?: string[];
  isActive: boolean;
}

export const MyTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Team Phoenix',
      game: 'Valorant',
      gameId: 'game1',
      logo: 'https://picsum.photos/seed/team1/200/200',
      description: 'Đội tuyển Valorant chuyên nghiệp',
      members: 5,
      maxMembers: 6,
      captain: 'Nguyễn Văn A',
      captainId: 'user1',
      status: 'recruiting',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      avatar: 'https://picsum.photos/seed/team1/100/100',
      winRate: 75,
      tournamentsCount: 8,
      contactEmail: 'team-phoenix@esports.vn',
      contactPhone: '+84 123 456 789',
      discordLink: 'https://discord.gg/phoenix',
      tags: ['Competitive', 'Professional', 'Valorant'],
      isActive: true
    },
    {
      id: '2',
      name: 'Team Alpha',
      game: 'League of Legends',
      gameId: 'game2',
      logo: 'https://picsum.photos/seed/team2/200/200',
      description: 'Team LOL competitive',
      members: 4,
      maxMembers: 5,
      captain: 'Trần Văn B',
      captainId: 'user2',
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      avatar: 'https://picsum.photos/seed/team2/100/100',
      winRate: 62,
      tournamentsCount: 5,
      contactEmail: 'team-alpha@esports.vn',
      contactPhone: '+84 987 654 321',
      discordLink: 'https://discord.gg/alpha',
      tags: ['LOL', 'Competitive'],
      isActive: true
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);
  const [form] = Form.useForm();

  // Fetch teams from API
  useEffect(() => {
    // TODO: Gọi API lấy danh sách đội
    // fetchMyTeams();
  }, []);

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newTeam: Team = {
        id: Date.now().toString(),
        ...values,
        members: 1, // Mặc định có đội trưởng
        winRate: 0,
        tournamentsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        avatar: `https://picsum.photos/seed/team${Date.now()}/100/100`,
        logo: values.logo || `https://picsum.photos/seed/team${Date.now()}/200/200`,
        isActive: true,
        status: 'recruiting'
      };
      
      // TODO: Gọi API tạo đội
      // await createTeam(newTeam);
      
      setTeams([...teams, newTeam]);
      setIsModalOpen(false);
      message.success('Tạo đội thành công!');
      form.resetFields();
    }).catch(error => {
      console.error('Validation failed:', error);
    });
  };

  const handleView = (team: Team) => {
    setViewingTeam(team);
    setIsViewModalOpen(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    form.setFieldsValue({
      ...team,
      gameId: team.gameId || team.game // Map game name to gameId if needed
    });
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      const updatedTeam = {
        ...values,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      // TODO: Gọi API update team
      // await updateTeam(editingTeam?.id!, updatedTeam);
      
      setTeams(teams.map(team => 
        team.id === editingTeam?.id ? { ...team, ...updatedTeam } : team
      ));
      setIsModalOpen(false);
      setEditingTeam(null);
      message.success('Cập nhật đội thành công!');
      form.resetFields();
    }).catch(error => {
      console.error('Validation failed:', error);
    });
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Gọi API xóa đội
      // await deleteTeam(id);
      
      setTeams(teams.filter(team => team.id !== id));
      message.success('Xóa đội thành công!');
    } catch (error) {
      message.error('Xóa đội thất bại!');
    }
  };

  const handleToggleStatus = async (id: string, newStatus: Team['status']) => {
    try {
      // TODO: Gọi API thay đổi trạng thái
      // await updateTeamStatus(id, newStatus);
      
      setTeams(teams.map(team => 
        team.id === id ? { ...team, status: newStatus } : team
      ));
      message.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại!');
    }
  };

  const getStatusTag = (status: string) => {
    const config = {
      active: { color: 'green', text: 'Đang hoạt động' },
      recruiting: { color: 'blue', text: 'Đang tuyển thành viên' },
      inactive: { color: 'red', text: 'Ngừng hoạt động' }
    };
    const statusConfig = config[status as keyof typeof config];
    return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>;
  };

  const columns = [
    {
      title: 'Đội',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Team) => (
        <Space>
          <Avatar 
            src={record.logo || record.avatar} 
            size="large" 
            shape="square"
            style={{ borderRadius: 8 }}
          />
          <div>
            <Text strong style={{ fontSize: 14, display: 'block' }}>{name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Game: {record.game}  -  </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Đội trưởng: {record.captain}</Text>
            {record.tags && record.tags.length > 0 && (
              <div style={{ marginTop: 4 }}>
                {record.tags.slice(0, 2).map((tag, index) => (
                  <Tag key={index} color="default">
                    {tag}
                  </Tag>
                ))}
                {record.tags.length > 2 && (
                  <Text type="secondary" style={{ fontSize: 11 }}>+{record.tags.length - 2}</Text>
                )}
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Thành viên',
      dataIndex: 'members',
      key: 'members',
      render: (members: number, record: Team) => (
        <div style={{ minWidth: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text strong>{members}/{record.maxMembers}</Text>
            {record.status === 'recruiting' && (
              <Badge status="processing" text="Còn chỗ" />
            )}
          </div>
          <Progress 
            percent={(members / record.maxMembers) * 100} 
            size="small" 
            showInfo={false}
            strokeColor={members >= record.maxMembers ? '#ff4d4f' : '#52c41a'}
          />
        </div>
      ),
    },
    {
      title: 'Hiệu suất',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (winRate: number) => (
        <div style={{ textAlign: 'center' }}>
          <Text strong style={{ 
            fontSize: 16, 
            color: winRate >= 70 ? '#52c41a' : winRate >= 50 ? '#faad14' : '#ff4d4f' 
          }}>
            {winRate}%
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>Tỷ lệ thắng</Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Team) => (
        <Space direction="vertical">
          {getStatusTag(status)}
          <Text type="secondary" style={{ fontSize: 11 }}>
            {dayjs(record.updatedAt).format('DD/MM/YYYY')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_ : any, record: Team) => (
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
              <Button 
                type="text" 
                icon={<TeamOutlined />} 
                size="small"
              />
            </Link>
          </Tooltip>
          
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa đội này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const teamStats = {
    totalTeams: teams.length,
    totalMembers: teams.reduce((sum, team) => sum + team.members, 0),
    activeTeams: teams.filter(team => team.status === 'active').length,
    recruitingTeams: teams.filter(team => team.status === 'recruiting').length,
    avgWinRate: Math.round(teams.reduce((sum, team) => sum + team.winRate, 0) / teams.length)
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ 
            margin: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
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

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="Tổng số đội"
              value={teamStats.totalTeams}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="Thành viên"
              value={teamStats.totalMembers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="Đội đang hoạt động"
              value={teamStats.activeTeams}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="Tỷ lệ thắng TB"
              value={teamStats.avgWinRate}
              suffix="%"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          borderRadius: 16,
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          background: 'white',
        }}
      >
        <Table
          dataSource={teams}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} đội`,
          }}
        />
      </Card>

      {/* Create/Edit Team Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TeamOutlined />
            {editingTeam ? 'Chỉnh sửa đội' : 'Tạo đội mới'}
          </div>
        }
        open={isModalOpen}
        onOk={editingTeam ? handleUpdate : handleAdd}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTeam(null);
          form.resetFields();
        }}
        okText={editingTeam ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="name" 
                label="Tên đội" 
                rules={[{ required: true, message: 'Vui lòng nhập tên đội!' }]}
              >
                <Input placeholder="Nhập tên đội" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="gameId" 
                label="Game" 
                rules={[{ required: true, message: 'Vui lòng chọn game!' }]}
              >
                <Select placeholder="Chọn game" size="large">
                  <Option value="game1">Valorant</Option>
                  <Option value="game2">League of Legends</Option>
                  <Option value="game3">Counter-Strike 2</Option>
                  <Option value="game4">DOTA 2</Option>
                  <Option value="game5">PUBG Mobile</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="description" 
            label="Mô tả"
          >
            <Input.TextArea 
              placeholder="Mô tả về đội..." 
              rows={3} 
              size="large" 
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="maxMembers" 
                label="Số thành viên tối đa" 
                rules={[{ required: true, message: 'Vui lòng nhập số thành viên tối đa!' }]}
              >
                <InputNumber 
                  placeholder="Nhập số thành viên tối đa" 
                  style={{ width: '100%' }} 
                  min={1}
                  max={20}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="captain" 
                label="Đội trưởng" 
                rules={[{ required: true, message: 'Vui lòng nhập tên đội trưởng!' }]}
              >
                <Input placeholder="Nhập tên đội trưởng" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="contactEmail" 
                label="Email liên hệ"
                rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email liên hệ" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="contactPhone" 
                label="Số điện thoại"
              >
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="discordLink" 
            label="Link Discord"
          >
            <Input prefix={<LinkOutlined />} placeholder="https://discord.gg/..." size="large" />
          </Form.Item>

          <Form.Item 
            name="logo" 
            label="URL Logo"
          >
            <Input placeholder="https://example.com/logo.png" size="large" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Team Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
          <Button key="edit" type="primary" onClick={() => {
            setIsViewModalOpen(false);
            handleEdit(viewingTeam!);
          }}>
            Chỉnh sửa
          </Button>,
          <Link key="members" to={`/team/${viewingTeam?.id}/members`}>
            <Button type="primary" ghost>
              Quản lý thành viên
            </Button>
          </Link>
        ]}
        width={700}
      >
        {viewingTeam && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                src={viewingTeam.logo || viewingTeam.avatar} 
                size={100}
                shape="square"
                style={{ borderRadius: 12, marginBottom: 16 }}
              />
              <Title level={3}>{viewingTeam.name}</Title>
              <Space>
                <Tag color="blue">{viewingTeam.game}</Tag>
                {getStatusTag(viewingTeam.status)}
              </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Thành viên"
                    value={`${viewingTeam.members}/${viewingTeam.maxMembers}`}
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
                      color: viewingTeam.winRate >= 70 ? '#52c41a' : 
                            viewingTeam.winRate >= 50 ? '#faad14' : '#ff4d4f' 
                    }}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Mô tả:</Text>
              <Text style={{ display: 'block', marginTop: 8 }}>
                {viewingTeam.description || 'Chưa có mô tả'}
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Đội trưởng:</Text>
              <Text style={{ display: 'block', marginTop: 4 }}>
                {viewingTeam.captain}
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Liên hệ:</Text>
              <div style={{ marginTop: 8 }}>
                {viewingTeam.contactEmail && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <MailOutlined />
                    <Text>{viewingTeam.contactEmail}</Text>
                  </div>
                )}
                {viewingTeam.contactPhone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <PhoneOutlined />
                    <Text>{viewingTeam.contactPhone}</Text>
                  </div>
                )}
                {viewingTeam.discordLink && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LinkOutlined />
                    <a href={viewingTeam.discordLink} target="_blank" rel="noopener noreferrer">
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
                  {viewingTeam.tags.map((tag, index) => (
                    <Tag key={index} style={{ marginBottom: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Ngày tạo: {dayjs(viewingTeam.createdAt).format('DD/MM/YYYY HH:mm')}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Cập nhật: {dayjs(viewingTeam.updatedAt).format('DD/MM/YYYY HH:mm')}
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

import dayjs from 'dayjs';
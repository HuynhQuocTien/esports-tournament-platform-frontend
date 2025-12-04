import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Badge,
  Progress,
  DatePicker
} from 'antd';
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
  CloseOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getRoleLabel, RoleTeamLabel, type TeamRole } from '@/common/constants/RoleTeam';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface TeamMember {
  id: string;
  userId: string;
  name: string;
  role: TeamRole;
  gameRole: string;
  inGameName?: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  kda: string;
  winRate: number;
  avatarUrl: string;
  email: string;
  phoneNumber: string;
  isApproved: boolean;
}

interface TeamInfo {
  id: string;
  name: string;
  game: string;
  logo?: string;
  description?: string;
  maxMembers: number;
  winRate: number;
  tournamentsCount: number;
  status: 'active' | 'inactive' | 'recruiting';
  captain?: string;
}

export const TeamMembersPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      userId: 'user1',
      name: 'Nguyễn Văn A',
      role: 'CAPTAIN',
      gameRole: 'Initiator',
      inGameName: 'PhoenixA',
      joinDate: '2024-01-15',
      status: 'active',
      kda: '2.5/1.2/3.8',
      winRate: 78,
      avatarUrl: 'https://picsum.photos/seed/user1/100/100',
      email: 'player1@esports.vn',
      phoneNumber: '+84 123 456 789',
      isApproved: true
    },
    {
      id: '2',
      userId: 'user2',
      name: 'Trần Văn B',
      role: 'PLAYER',
      gameRole: 'Duelist',
      inGameName: 'DuelistB',
      joinDate: '2024-01-16',
      status: 'active',
      kda: '3.2/1.8/2.5',
      winRate: 65,
      avatarUrl: 'https://picsum.photos/seed/user2/100/100',
      email: 'player2@esports.vn',
      phoneNumber: '+84 987 654 321',
      isApproved: true
    },
    {
      id: '3',
      userId: 'user3',
      name: 'Lê Văn C',
      role: 'PLAYER',
      gameRole: 'Controller',
      inGameName: 'ControllerC',
      joinDate: '2024-01-17',
      status: 'active',
      kda: '1.8/1.5/4.2',
      winRate: 72,
      avatarUrl: 'https://picsum.photos/seed/user3/100/100',
      email: 'player3@esports.vn',
      phoneNumber: '+84 555 666 777',
      isApproved: true
    },
    {
      id: '4',
      userId: 'user4',
      name: 'Phạm Văn D',
      role: 'SUBSTITUTE',
      gameRole: 'Sentinel',
      inGameName: 'SentinelD',
      joinDate: '2024-01-18',
      status: 'pending',
      kda: '2.1/1.8/3.1',
      winRate: 58,
      avatarUrl: 'https://picsum.photos/seed/user4/100/100',
      email: 'player4@esports.vn',
      phoneNumber: '+84 888 999 000',
      isApproved: false
    },
    {
      id: '5',
      userId: 'user5',
      name: 'Hoàng Văn E',
      role: 'COACH',
      gameRole: 'Strategy',
      inGameName: 'CoachE',
      joinDate: '2024-01-19',
      status: 'active',
      kda: 'N/A',
      winRate: 85,
      avatarUrl: 'https://picsum.photos/seed/user5/100/100',
      email: 'coach@esports.vn',
      phoneNumber: '+84 111 222 333',
      isApproved: true
    },
  ]);

  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    id: teamId || '1',
    name: 'Team Phoenix',
    game: 'Valorant',
    maxMembers: 6,
    winRate: 68,
    tournamentsCount: 8,
    status: 'active',
    captain: 'Nguyễn Văn A',
    logo: 'https://picsum.photos/seed/team1/200/200',
    description: 'Đội tuyển Valorant chuyên nghiệp'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  // Fetch team info và members từ API
  useEffect(() => {
    if (teamId) {
      // TODO: Gọi API để lấy thông tin đội và thành viên
      // fetchTeamInfo(teamId);
      // fetchTeamMembers(teamId);
    }
  }, [teamId]);

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    form.setFieldsValue({
      ...member,
      // Format lại date cho DatePicker
      joinDate: member.joinDate ? dayjs(member.joinDate) : undefined
    });
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      const updatedValues = {
        ...values,
        joinDate: values.joinDate ? values.joinDate.format('YYYY-MM-DD') : editingMember?.joinDate
      };
      
      // TODO: Gọi API update member
      // await updateTeamMember(teamId!, editingMember?.id!, updatedValues);
      
      setMembers(members.map(member => 
        member.id === editingMember?.id ? { ...member, ...updatedValues } : member
      ));
      setIsModalOpen(false);
      setEditingMember(null);
      message.success('Cập nhật thành viên thành công!');
      form.resetFields();
    }).catch(error => {
      console.error('Validation failed:', error);
    });
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Gọi API xóa member
      // await deleteTeamMember(teamId!, id);
      
      setMembers(members.filter(member => member.id !== id));
      message.success('Xóa thành viên thành công!');
    } catch (error) {
      message.error('Xóa thành viên thất bại!');
    }
  };

  const handleApproveMember = async (id: string) => {
    try {
      // TODO: Gọi API approve member
      // await approveTeamMember(teamId!, id);
      
      setMembers(members.map(member => 
        member.id === id ? { ...member, isApproved: true, status: 'active' } : member
      ));
      message.success('Đã phê duyệt thành viên!');
    } catch (error) {
      message.error('Phê duyệt thất bại!');
    }
  };

  const handleRejectMember = async (id: string) => {
    try {
      // TODO: Gọi API reject member
      // await rejectTeamMember(teamId!, id);
      
      setMembers(members.filter(member => member.id !== id));
      message.success('Đã từ chối thành viên!');
    } catch (error) {
      message.error('Thao tác thất bại!');
    }
  };

  const handleAddMember = () => {
    addForm.validateFields().then((values) => {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        userId: `user${Date.now()}`,
        ...values,
        status: 'pending',
        joinDate: new Date().toISOString().split('T')[0],
        avatarUrl: `https://picsum.photos/seed/user${Date.now()}/100/100`,
        kda: '0/0/0',
        winRate: 0,
        isApproved: false
      };
      
      // TODO: Gọi API thêm member
      // await addTeamMember(teamId!, newMember);
      
      setMembers([...members, newMember]);
      setIsAddMemberModalOpen(false);
      message.success('Thêm thành viên thành công!');
      addForm.resetFields();
    }).catch(error => {
      console.error('Validation failed:', error);
    });
  };

  const getRoleTag = (role: TeamRole) => {
    const roleColor = {
      CAPTAIN: 'gold',
      PLAYER: 'blue',
      COACH: 'purple',
      SUBSTITUTE: 'orange',
      ANALYST: 'cyan',
      MANAGER: 'magenta'
    };

    const roleIcon = {
      CAPTAIN: <CrownOutlined />,
      PLAYER: <UserOutlined />,
      COACH: <UserOutlined />,
      SUBSTITUTE: <UserOutlined />,
      ANALYST: <UserOutlined />,
      MANAGER: <UserOutlined />
    };

    return (
      <Tag color={roleColor[role]}>
        {roleIcon[role]} {getRoleLabel(role)}
      </Tag>
    );
  };

  const getStatusTag = (status: string) => {
    const config = {
      active: { color: 'green', text: 'Hoạt động' },
      inactive: { color: 'red', text: 'Không hoạt động' },
      pending: { color: 'orange', text: 'Chờ xác nhận' }
    };
    const statusConfig = config[status as keyof typeof config];
    return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>;
  };

  const getApprovalTag = (isApproved: boolean) => {
    return isApproved ? (
      <Tag color="green" icon={<CheckOutlined />}>Đã duyệt</Tag>
    ) : (
      <Tag color="orange" icon={<CloseOutlined />}>Chờ duyệt</Tag>
    );
  };

  const roleOptions = Object.entries(RoleTeamLabel).map(([value, label]) => ({
    value,
    label
  }));

  const columns = [
    {
      title: 'Thành viên',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: TeamMember) => (
        <Space>
          <Avatar src={record.avatarUrl} size="large" />
          <div>
            <Text strong style={{ fontSize: 14, display: 'block' }}>{name}</Text>
            {record.inGameName && (
              <Text type="secondary" style={{ fontSize: 12 }}>IG: {record.inGameName}</Text>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              {getRoleTag(record.role)}
              {getStatusTag(record.status)}
              {getApprovalTag(record.isApproved)}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Vai trò trong game',
      dataIndex: 'gameRole',
      key: 'gameRole',
      render: (gameRole: string) => (
        <Tag color="cyan">{gameRole}</Tag>
      ),
    },
    {
      title: 'KDA',
      dataIndex: 'kda',
      key: 'kda',
      render: (kda: string) => (
        <Text strong style={{ color: '#1890ff' }}>{kda}</Text>
      ),
    },
    {
      title: 'Tỷ lệ thắng',
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
          <Progress 
            percent={winRate} 
            size="small" 
            showInfo={false}
            strokeColor={winRate >= 70 ? '#52c41a' : winRate >= 50 ? '#faad14' : '#ff4d4f'}
          />
        </div>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_ : any, record: TeamMember) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
            />
          </Tooltip>
          
          {record.status === 'pending' && !record.isApproved && (
            <>
              <Tooltip title="Phê duyệt">
                <Button 
                  type="text" 
                  icon={<CheckOutlined />} 
                  size="small"
                  style={{ color: '#52c41a' }}
                  onClick={() => handleApproveMember(record.id)}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button 
                  type="text" 
                  danger
                  icon={<CloseOutlined />} 
                  size="small"
                  onClick={() => handleRejectMember(record.id)}
                />
              </Tooltip>
            </>
          )}

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
            description="Bạn có chắc chắn muốn xóa thành viên này khỏi đội?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            disabled={record.role === 'CAPTAIN'}
          >
            <Tooltip title="Xóa thành viên">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
                disabled={record.role === 'CAPTAIN'}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const teamStats = {
    activeMembers: members.filter(m => m.status === 'active').length,
    pendingMembers: members.filter(m => m.status === 'pending' && !m.isApproved).length,
    approvedMembers: members.filter(m => m.isApproved).length,
    averageWinRate: Math.round(members.reduce((sum, m) => sum + m.winRate, 0) / members.length),
    captain: members.find(m => m.role === 'CAPTAIN')
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header with Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Space>
            <Link to="/my-teams">
              <Button type="text" icon={<ArrowLeftOutlined />}>
                Quay lại
              </Button>
            </Link>
            <div>
              <Title level={2} style={{ 
                margin: 0,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                👥 Thành viên đội: {teamInfo.name}
              </Title>
              <Text type="secondary">{teamInfo.description}</Text>
            </div>
          </Space>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => setIsAddMemberModalOpen(true)}
          disabled={members.length >= teamInfo.maxMembers}
        >
          Thêm thành viên
        </Button>
      </div>

      {/* Team Info Card */}
      <Card
        style={{
          borderRadius: 16,
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: 24,
          background: 'linear-gradient(135deg, #f6f8ff 0%, #f0f2ff 100%)',
        }}
      >
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={80} src={teamInfo.logo || teamStats.captain?.avatarUrl} />
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                {teamInfo.name}
              </Title>
              <Tag color="blue">{teamInfo.game}</Tag>
              <Tag color={teamInfo.status === 'active' ? 'green' : teamInfo.status === 'recruiting' ? 'blue' : 'red'}>
                {teamInfo.status === 'active' ? 'Đang hoạt động' : 
                 teamInfo.status === 'recruiting' ? 'Đang tuyển' : 'Ngừng hoạt động'}
              </Tag>
              <div style={{ marginTop: 8 }}>
                {teamStats.captain && (
                  <Text type="secondary">Đội trưởng: {teamStats.captain.name}</Text>
                )}
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Thành viên"
                  value={`${teamStats.activeMembers}/${teamInfo.maxMembers}`}
                  prefix={<UserOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Chờ xác nhận"
                  value={teamStats.pendingMembers}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Tỷ lệ thắng TB"
                  value={teamStats.averageWinRate}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Giải đấu"
                  value={teamInfo.tournamentsCount}
                  prefix={<TrophyOutlined />}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Members Table */}
      <Card
        style={{
          borderRadius: 16,
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          background: 'white',
        }}
      >
        <Table
          dataSource={members}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} thành viên`,
          }}
        />
      </Card>

      {/* Edit Member Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="name" 
                label="Họ và tên" 
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ và tên" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="inGameName" 
                label="Tên trong game"
              >
                <Input placeholder="Tên trong game" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="role" 
                label="Vai trò trong đội" 
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select 
                  placeholder="Chọn vai trò" 
                  size="large"
                  options={roleOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="gameRole" 
                label="Vai trò trong game"
              >
                <Input placeholder="VD: Duelist, Support, Carry..." size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                name="kda" 
                label="KDA"
                rules={[{ pattern: /^\d+\/\d+\/\d+$/, message: 'Định dạng: kills/deaths/assists' }]}
              >
                <Input placeholder="0/0/0" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="winRate" 
                label="Tỷ lệ thắng (%)"
              >
                <InputNumber 
                  placeholder="0" 
                  style={{ width: '100%' }} 
                  min={0}
                  max={100}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="status" 
                label="Trạng thái"
              >
                <Select size="large">
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                  <Option value="pending">Chờ xác nhận</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="email" 
                label="Email"
                rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="phoneNumber" 
                label="Số điện thoại"
              >
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="joinDate" 
            label="Ngày tham gia"
          >
            <DatePicker 
              style={{ width: '100%' }} 
              size="large" 
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
      >
        <Form form={addForm} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item 
            name="name" 
            label="Họ và tên" 
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ và tên" size="large" />
          </Form.Item>

          <Form.Item 
            name="inGameName" 
            label="Tên trong game"
          >
            <Input placeholder="Tên trong game" size="large" />
          </Form.Item>

          <Form.Item 
            name="email" 
            label="Email" 
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item 
            name="phoneNumber" 
            label="Số điện thoại"
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" size="large" />
          </Form.Item>

          <Form.Item 
            name="role" 
            label="Vai trò trong đội" 
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select 
              placeholder="Chọn vai trò" 
              size="large"
              options={roleOptions}
            />
          </Form.Item>

          <Form.Item 
            name="gameRole" 
            label="Vai trò trong game"
          >
            <Input placeholder="VD: Duelist, Support, Carry..." size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
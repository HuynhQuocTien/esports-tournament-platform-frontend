import React, { useState, useEffect } from 'react';
import {
    Form,
    Card,
    Row,
    Col,
    Table,
    Tag,
    Button,
    Input,
    Select,
    Switch,
    Space,
    Dropdown,
    Avatar,
    Tooltip,
    Badge,
    message,
    Typography,
    Divider,
    InputNumber,
    type MenuProps,
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    MoreOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
    TeamOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    ExportOutlined,
} from '@ant-design/icons';
import type { TournamentStepProps } from '@/common/types/tournament';
import { RegistrationStatus } from '@/common/interfaces/tournament/registration-status';
import type { ColumnsType } from 'antd/es/table';
import { StatisticCard } from '@/components/tournament/StatisticCard';

const { Text} = Typography;
const { Option } = Select;

interface RegistrationRecord {
    id: string;
    teamName: string;
    teamLogo?: string;
    captainName: string;
    captainAvatar?: string;
    registeredBy: string;
    registeredAt: Date;
    status: RegistrationStatus;
    hasCheckedIn: boolean;
    checkedInAt?: Date;
    teamSize: number;
    customData?: any;
}

const TournamentRegistrationManagement: React.FC<TournamentStepProps> = ({ data, updateData }) => {
    const [form] = Form.useForm();
    const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState<RegistrationRecord[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'all'>('all');
    const [checkedInFilter, setCheckedInFilter] = useState<'all' | 'checked' | 'not-checked'>('all');

    // Mock data - trong thực tế sẽ fetch từ API
    useEffect(() => {
        const mockData: RegistrationRecord[] = [
            {
                id: '1',
                teamName: 'Team Alpha',
                captainName: 'John Doe',
                registeredBy: 'John Doe',
                registeredAt: new Date('2024-01-15'),
                status: RegistrationStatus.APPROVED,
                hasCheckedIn: true,
                checkedInAt: new Date('2024-01-16'),
                teamSize: 5,
            },
            {
                id: '2',
                teamName: 'Team Beta',
                captainName: 'Jane Smith',
                registeredBy: 'Jane Smith',
                registeredAt: new Date('2024-01-14'),
                status: RegistrationStatus.PENDING,
                hasCheckedIn: false,
                teamSize: 4,
            },
            {
                id: '3',
                teamName: 'Team Gamma',
                captainName: 'Bob Johnson',
                registeredBy: 'Bob Johnson',
                registeredAt: new Date('2024-01-13'),
                status: RegistrationStatus.WAITLISTED,
                hasCheckedIn: false,
                teamSize: 6,
            },
            {
                id: '4',
                teamName: 'Team Delta',
                captainName: 'Alice Brown',
                registeredBy: 'Alice Brown',
                registeredAt: new Date('2024-01-12'),
                status: RegistrationStatus.REJECTED,
                hasCheckedIn: false,
                teamSize: 3,
            },
        ];
        setRegistrations(mockData);
        setFilteredRegistrations(mockData);
    }, []);

    // Filter registrations
    useEffect(() => {
        let filtered = registrations;

        if (searchText) {
            filtered = filtered.filter(reg =>
                reg.teamName.toLowerCase().includes(searchText.toLowerCase()) ||
                reg.captainName.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(reg => reg.status === statusFilter);
        }

        if (checkedInFilter !== 'all') {
            filtered = filtered.filter(reg =>
                checkedInFilter === 'checked' ? reg.hasCheckedIn : !reg.hasCheckedIn
            );
        }

        setFilteredRegistrations(filtered);
    }, [searchText, statusFilter, checkedInFilter, registrations]);

    const getStatusColor = (status: RegistrationStatus) => {
        const colors = {
            [RegistrationStatus.PENDING]: 'orange',
            [RegistrationStatus.APPROVED]: 'green',
            [RegistrationStatus.REJECTED]: 'red',
            [RegistrationStatus.WAITLISTED]: 'blue',
            [RegistrationStatus.CANCELLED]: 'gray',
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status: RegistrationStatus) => {
        const texts = {
            [RegistrationStatus.PENDING]: 'Chờ duyệt',
            [RegistrationStatus.APPROVED]: 'Đã duyệt',
            [RegistrationStatus.REJECTED]: 'Đã từ chối',
            [RegistrationStatus.WAITLISTED]: 'Danh sách chờ',
            [RegistrationStatus.CANCELLED]: 'Đã hủy',
        };
        return texts[status] || status;
    };

    const handleApprove = (id: string) => {
        setRegistrations(prev =>
            prev.map(reg =>
                reg.id === id
                    ? { ...reg, status: RegistrationStatus.APPROVED, hasCheckedIn: true }
                    : reg
            )
        );
        message.success('Đã duyệt đội tham gia');
    };

    const handleReject = (id: string) => {
        setRegistrations(prev =>
            prev.map(reg =>
                reg.id === id
                    ? { ...reg, status: RegistrationStatus.REJECTED }
                    : reg
            )
        );
        message.success('Đã từ chối đội tham gia');
    };

    const handleMoveToWaitlist = (id: string) => {
        setRegistrations(prev =>
            prev.map(reg =>
                reg.id === id
                    ? { ...reg, status: RegistrationStatus.WAITLISTED }
                    : reg
            )
        );
        message.success('Đã chuyển vào danh sách chờ');
    };

    const handleCheckIn = (id: string) => {
        setRegistrations(prev =>
            prev.map(reg =>
                reg.id === id
                    ? { ...reg, hasCheckedIn: true, checkedInAt: new Date() }
                    : reg
            )
        );
        message.success('Đã check-in thành công');
    };

    const handleBulkAction = (action: string) => {
        switch (action) {
            case 'approve':
                setRegistrations(prev =>
                    prev.map(reg =>
                        selectedRowKeys.includes(reg.id)
                            ? { ...reg, status: RegistrationStatus.APPROVED }
                            : reg
                    )
                );
                message.success(`Đã duyệt ${selectedRowKeys.length} đội`);
                break;
            case 'reject':
                setRegistrations(prev =>
                    prev.map(reg =>
                        selectedRowKeys.includes(reg.id)
                            ? { ...reg, status: RegistrationStatus.REJECTED }
                            : reg
                    )
                );
                message.success(`Đã từ chối ${selectedRowKeys.length} đội`);
                break;
            case 'checkin':
                setRegistrations(prev =>
                    prev.map(reg =>
                        selectedRowKeys.includes(reg.id)
                            ? { ...reg, hasCheckedIn: true, checkedInAt: new Date() }
                            : reg
                    )
                );
                message.success(`Đã check-in ${selectedRowKeys.length} đội`);
                break;
        }
        setSelectedRowKeys([]);
    };

    const columns: ColumnsType<RegistrationRecord> = [
        {
            title: 'Tên đội',
            dataIndex: 'teamName',
            render: (text, record) => (
                <Space>
                    <Avatar
                        size="small"
                        src={record.teamLogo}
                        icon={<TeamOutlined />}
                    />
                    <div>
                        <Text strong>{text}</Text>
                        <div>
                            <small>
                                <UserOutlined /> {record.captainName}
                            </small>
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Thời gian đăng ký',
            dataIndex: 'registeredAt',
            render: (date: Date) => (
                <div>
                    <div>{date.toLocaleDateString('vi-VN')}</div>
                    <small>{date.toLocaleTimeString('vi-VN')}</small>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status: RegistrationStatus) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Check-in',
            dataIndex: 'hasCheckedIn',
            render: (checkedIn: boolean, record) => (
                checkedIn ? (
                    <Tooltip title={`Đã check-in lúc ${record.checkedInAt?.toLocaleTimeString('vi-VN')}`}>
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                            Đã check-in
                        </Tag>
                    </Tooltip>
                ) : (
                    <Tag color="orange" icon={<ClockCircleOutlined />}>
                        Chưa check-in
                    </Tag>
                )
            ),
        },
        {
            title: 'Số thành viên',
            dataIndex: 'teamSize',
            align: 'center',
            render: (size: number) => (
                <Badge count={size} style={{ backgroundColor: '#1890ff' }} />
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
              <Dropdown menu={{ items: getMenuItems(record) }} trigger={['click']}>
                <Button icon={<MoreOutlined />} size="small" />
              </Dropdown>
            ),
        },
    ];

    const onFinish = (values: any): void => {
        updateData('settings', values);
        message.success('Cập nhật cài đặt đăng ký thành công');
    };

    const registrationStats = {
        total: registrations.length,
        approved: registrations.filter(r => r.status === RegistrationStatus.APPROVED).length,
        pending: registrations.filter(r => r.status === RegistrationStatus.PENDING).length,
        waitlisted: registrations.filter(r => r.status === RegistrationStatus.WAITLISTED).length,
        checkedIn: registrations.filter(r => r.hasCheckedIn).length,
    };
  const getMenuItems = (record: any): MenuProps['items'] => {
  const items: MenuProps['items'] = [];

  if (record.status === RegistrationStatus.PENDING) {
    items.push(
      {
        key: 'approve',
        icon: <CheckCircleOutlined />,
        label: 'Duyệt đăng ký',
        onClick: () => handleApprove(record.id),
      },
      {
        key: 'reject',
        icon: <CloseCircleOutlined />,
        label: 'Từ chối',
        onClick: () => handleReject(record.id),
      },
      {
        key: 'waitlist',
        icon: <ClockCircleOutlined />,
        label: 'Chuyển vào danh sách chờ',
        onClick: () => handleMoveToWaitlist(record.id),
      },
    );
  }

  if (!record.hasCheckedIn) {
    items.push({
      key: 'checkin',
      icon: <CheckCircleOutlined />,
      label: 'Check-in',
      onClick: () => handleCheckIn(record.id),
    });
  }

  items.push(
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'Xem chi tiết',
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Chỉnh sửa',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Xóa',
      danger: true,
    },
  );

  return items;
};
    return (
        <div>
            <Row gutter={[24, 16]}>
                {/* Statistics Cards */}
                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        <Col span={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Tổng đăng ký"
                                    value={registrationStats.total}
                                    color="#1890ff"
                                    icon={<TeamOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Đã duyệt"
                                    value={registrationStats.approved}
                                    color="#52c41a"
                                    icon={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Chờ duyệt"
                                    value={registrationStats.pending}
                                    color="#faad14"
                                    icon={<ClockCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Danh sách chờ"
                                    value={registrationStats.waitlisted}
                                    color="#1890ff"
                                    icon={<ClockCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Đã check-in"
                                    value={registrationStats.checkedIn}
                                    color="#52c41a"
                                    icon={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Slot trống"
                                    value={(data?.basicInfo.maxTeams || 0) - registrationStats.approved}
                                    color="#f5222d"
                                    icon={<TeamOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Registration List Table */}
                <Col span={24}>
                    <Card
                        title={
                            <Space>
                                <TeamOutlined />
                                <span>Danh sách đội đăng ký</span>
                                <Badge
                                    count={registrationStats.total}
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                            </Space>
                        }
                        size="small"
                        extra={
                            <Space>
                                <Button icon={<ExportOutlined />}>
                                    Xuất Excel
                                </Button>
                                <Button type="primary">
                                    Thêm đội thủ công
                                </Button>
                            </Space>
                        }
                    >
                        {/* Filters */}
                        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                            <Col span={8}>
                                <Input
                                    placeholder="Tìm kiếm tên đội, đội trưởng..."
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    allowClear
                                />
                            </Col>
                            <Col span={6}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Lọc theo trạng thái"
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                >
                                    <Option value="all">Tất cả trạng thái</Option>
                                    {Object.values(RegistrationStatus).map(status => (
                                        <Option key={status} value={status}>
                                            <Tag color={getStatusColor(status)}>
                                                {getStatusText(status)}
                                            </Tag>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Lọc theo check-in"
                                    value={checkedInFilter}
                                    onChange={setCheckedInFilter}
                                >
                                    <Option value="all">Tất cả</Option>
                                    <Option value="checked">Đã check-in</Option>
                                    <Option value="not-checked">Chưa check-in</Option>
                                </Select>
                            </Col>
                            <Col span={4}>
                                <Button icon={<FilterOutlined />}>
                                    Thêm bộ lọc
                                </Button>
                            </Col>
                        </Row>

                        {/* Bulk Actions */}
                        {selectedRowKeys.length > 0 && (
                            <div style={{ marginBottom: 16 }}>
                                <Space>
                                    <Text>Đã chọn {selectedRowKeys.length} đội:</Text>
                                    <Button
                                        size="small"
                                        onClick={() => handleBulkAction('approve')}
                                        icon={<CheckCircleOutlined />}
                                    >
                                        Duyệt
                                    </Button>
                                    <Button
                                        size="small"
                                        danger
                                        onClick={() => handleBulkAction('reject')}
                                        icon={<CloseCircleOutlined />}
                                    >
                                        Từ chối
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => handleBulkAction('checkin')}
                                        icon={<CheckCircleOutlined />}
                                    >
                                        Check-in
                                    </Button>
                                    <Button size="small" onClick={() => setSelectedRowKeys([])}>
                                        Bỏ chọn
                                    </Button>
                                </Space>
                            </div>
                        )}

                        {/* Registration Table */}
                        <Table
                            columns={columns}
                            dataSource={filteredRegistrations}
                            rowKey="id"
                            size="small"
                            rowSelection={{
                                selectedRowKeys,
                                onChange: setSelectedRowKeys,
                            }}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} đội`,
                            }}
                        />
                    </Card>
                </Col>

                {/* Registration Settings */}
                <Col span={24}>
                    <Card
                        title={
                            <Space>
                                <TeamOutlined />
                                <span>Cài đặt đăng ký</span>
                            </Space>
                        }
                        size="small"
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={data.settings || {}}
                        >
                            <Row gutter={[24, 16]}>
                                <Col span={12}>
                                    <Form.Item
                                        name="maxTeams"
                                        label="Số đội tối đa"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số đội tối đa' },
                                            { type: 'number', min: 2, message: 'Tối thiểu 2 đội' },
                                        ]}
                                    >
                                        <InputNumber
                                            min={2}
                                            max={512}
                                            style={{ width: '100%' }}
                                            addonAfter="đội"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        name="requireApproval"
                                        label="Yêu cầu phê duyệt"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                    <Text type="secondary">
                                        Khi bật, mọi đăng ký cần được phê duyệt thủ công
                                    </Text>
                                </Col>

                                <Col span={12}>
                                    <Card title="Check-in" size="small">
                                        <Form.Item
                                            name="checkinEnabled"
                                            label="Bật check-in"
                                            valuePropName="checked"
                                        >
                                            <Switch />
                                        </Form.Item>

                                        <Form.Item
                                            name="checkinDuration"
                                            label="Thời gian check-in"
                                            tooltip="Thời gian cho phép check-in trước khi giải đấu bắt đầu"
                                        >
                                            <Select style={{ width: '100%' }}>
                                                <Option value={15}>15 phút</Option>
                                                <Option value={30}>30 phút</Option>
                                                <Option value={60}>1 giờ</Option>
                                                <Option value={120}>2 giờ</Option>
                                            </Select>
                                        </Form.Item>
                                    </Card>
                                </Col>

                                <Col span={12}>
                                    <Card title="Yêu cầu bổ sung" size="small">
                                        <Form.Item
                                            name="requireRank"
                                            label="Yêu cầu rank tối thiểu"
                                        >
                                            <Select placeholder="Chọn rank" allowClear>
                                                <Option value="diamond">Diamond trở lên</Option>
                                                <Option value="platinum">Platinum trở lên</Option>
                                                <Option value="gold">Gold trở lên</Option>
                                                <Option value="silver">Silver trở lên</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="allowWaitlist"
                                            label="Bật danh sách chờ"
                                            valuePropName="checked"
                                        >
                                            <Switch />
                                        </Form.Item>
                                    </Card>
                                </Col>

                                <Col span={24}>
                                    <Divider />
                                    <div style={{ textAlign: 'right' }}>
                                        <Button type="primary" htmlType="submit" size="large">
                                            Lưu cài đặt
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};


export default TournamentRegistrationManagement;
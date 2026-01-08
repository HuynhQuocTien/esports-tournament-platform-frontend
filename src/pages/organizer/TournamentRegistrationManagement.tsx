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
    Modal,
    Spin,
    Descriptions,
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
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { TournamentStepProps } from '@/common/types/tournament';
import { RegistrationStatus } from '@/common/interfaces/tournament/registration-status';
import type { ColumnsType } from 'antd/es/table';
import { StatisticCard } from '@/components/tournament/StatisticCard';
import { tournamentService } from '@/services/tournamentService';
import type { RegistrationResponse, RegistrationListResponse } from '@/common/interfaces/tournament/tournament';
import type { Team } from '@/common/types';

const { Text, Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

interface RegistrationRecord {
    id: string;
    teamId: string;
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
    registration?: RegistrationResponse;
}

const TournamentRegistrationManagement: React.FC<TournamentStepProps> = ({ data, updateData }) => {
    const [form] = Form.useForm();
    const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState<RegistrationRecord[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'all'>('all');
    const [checkedInFilter, setCheckedInFilter] = useState<'all' | 'checked' | 'not-checked'>('all');
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        pending: 0,
        waitlisted: 0,
        checkedIn: 0,
    });

    // Load registrations from API
    const loadRegistrations = async () => {
        if (!data?.basicInfo?.id) return;
        
        try {
            setLoading(true);
            const response = await tournamentService.getRegistrations(data.basicInfo.id, statusFilter !== 'all' ? statusFilter : undefined);
            const registrationsData = response.data?.data || [];
            // updateData('registrations', registrationsData);
            const formattedRegistrations: RegistrationRecord[] = registrationsData.map(reg => {
                // Map data from API response
                const team = reg.team || {} as any;
                return {
                    id: reg.id,
                    teamId: reg.teamId || team.id,
                    teamName: team.name || 'Unknown Team',
                    teamLogo: team.logoUrl,
                    captainName: team.captain?.fullname || team.captainName || 'Unknown Captain',
                    captainAvatar: team.captain?.avatar,
                    registeredBy: reg.registeredBy?.fullname || reg.registeredBy?.username || 'Unknown',
                    registeredAt: new Date(reg.registeredAt),
                    status: reg.status as RegistrationStatus,
                    hasCheckedIn: reg.hasCheckedIn || false,
                    checkedInAt: reg.checkedInAt ? new Date(reg.checkedInAt) : undefined,
                    teamSize: team.members?.length || team.teamSize || 0,
                    customData: reg.registrationData,
                    registration: reg,
                };
            });

            
            setRegistrations(formattedRegistrations);
            setFilteredRegistrations(formattedRegistrations);
            
            // Calculate statistics
            calculateStatistics(formattedRegistrations);
        } catch (error: any) {
            console.error('Error loading registrations:', error);
            message.error(error.response?.data?.message || 'Không thể tải danh sách đăng ký');
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const calculateStatistics = (regs: RegistrationRecord[]) => {
        const stats = {
            total: regs.length,
            approved: regs.filter(r => r.status === RegistrationStatus.APPROVED).length,
            pending: regs.filter(r => r.status === RegistrationStatus.PENDING).length,
            waitlisted: regs.filter(r => r.status === RegistrationStatus.WAITLISTED).length,
            checkedIn: regs.filter(r => r.hasCheckedIn).length,
        };
        setStats(stats);
    };

    // Initial load
    useEffect(() => {
        if (data?.basicInfo?.id) {
            loadRegistrations();
        }
    }, [data?.basicInfo?.id, statusFilter]);

    // Filter registrations
    useEffect(() => {
        let filtered = registrations;

        if (searchText) {
            filtered = filtered.filter(reg =>
                reg.teamName.toLowerCase().includes(searchText.toLowerCase()) ||
                reg.captainName.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (checkedInFilter !== 'all') {
            filtered = filtered.filter(reg =>
                checkedInFilter === 'checked' ? reg.hasCheckedIn : !reg.hasCheckedIn
            );
        }

        setFilteredRegistrations(filtered);
    }, [searchText, checkedInFilter, registrations]);

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

    const handleApprove = async (id: string) => {
        const registration = registrations.find(r => r.id === id);
        if (!registration || !data?.basicInfo?.id) return;
        
        try {
            setLoadingAction(`approve-${id}`);
            await tournamentService.updateRegistrationStatus(
                data.basicInfo.id,
                registration.id,  // Sử dụng registration.id, không phải teamId
                { 
                    status: RegistrationStatus.APPROVED,
                    reason: 'Đã được phê duyệt bởi quản trị viên'
                }
            );
            
            // Refresh data
            await loadRegistrations();
            message.success('Đã duyệt đội tham gia');
        } catch (error: any) {
            console.error('Error approving registration:', error);
            message.error(error.response?.data?.message || 'Không thể duyệt đăng ký');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleReject = async (id: string) => {
        const registration = registrations.find(r => r.id === id);
        if (!registration || !data?.basicInfo?.id) return;
        
        confirm({
            title: 'Xác nhận từ chối',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn từ chối đăng ký này không?',
            onOk: async () => {
                try {
                    setLoadingAction(`reject-${id}`);
                    await tournamentService.updateRegistrationStatus(
                        data.basicInfo.id,
                        registration.id,
                        { 
                            status: RegistrationStatus.REJECTED,
                            reason: 'Đã bị từ chối bởi quản trị viên'
                        }
                    );
                    
                    // Refresh data
                    await loadRegistrations();
                    message.success('Đã từ chối đội tham gia');
                } catch (error: any) {
                    console.error('Error rejecting registration:', error);
                    message.error(error.response?.data?.message || 'Không thể từ chối đăng ký');
                } finally {
                    setLoadingAction(null);
                }
            }
        });
    };

    const handleMoveToWaitlist = async (id: string) => {
        const registration = registrations.find(r => r.id === id);
        if (!registration || !data?.basicInfo?.id) return;
        
        try {
            setLoadingAction(`waitlist-${id}`);
            await tournamentService.updateRegistrationStatus(
                data.basicInfo.id,
                registration.id,
                { 
                    status: RegistrationStatus.WAITLISTED,
                    reason: 'Đã được chuyển vào danh sách chờ'
                }
            );
            
            // Refresh data
            await loadRegistrations();
            message.success('Đã chuyển vào danh sách chờ');
        } catch (error: any) {
            console.error('Error moving to waitlist:', error);
            message.error(error.response?.data?.message || 'Không thể chuyển vào danh sách chờ');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleCheckIn = async (id: string) => {
        const registration = registrations.find(r => r.id === id);
        if (!registration || !data?.basicInfo?.id) return;
        
        try {
            setLoadingAction(`checkin-${id}`);
            await tournamentService.checkIn(data.basicInfo.id, {
                teamId: registration.teamId
            });
            
            // Refresh data
            await loadRegistrations();
            message.success('Đã check-in thành công');
        } catch (error: any) {
            console.error('Error checking in:', error);
            message.error(error.response?.data?.message || 'Không thể check-in');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleDelete = async (id: string) => {
        const registration = registrations.find(r => r.id === id);
        if (!registration || !data?.basicInfo?.id) return;
        
        confirm({
            title: 'Xác nhận hủy đăng ký',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn hủy đăng ký này không?',
            okText: 'Xóa',
            okType: 'danger',
            onOk: async () => {
                try {
                    setLoadingAction(`delete-${id}`);
                    await tournamentService.cancelRegistration(
                        data.basicInfo.id,
                        {
                            teamId: registration.teamId,
                            reason: 'Đã xóa bởi quản trị viên'
                        }
                    );
                    
                    // Refresh data
                    await loadRegistrations();
                    message.success('Đã hủy đăng ký thành công');
                } catch (error: any) {
                    console.error('Error deleting registration:', error);
                    message.error(error.response?.data?.message || 'Không thể hủy đăng ký');
                } finally {
                    setLoadingAction(null);
                }
            }
        });
    };

    const handleBulkAction = async (action: string) => {
        if (selectedRowKeys.length === 0) return;
        
        confirm({
            title: `Xác nhận thao tác hàng loạt`,
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc chắn muốn ${getBulkActionText(action)} ${selectedRowKeys.length} đội không?`,
            onOk: async () => {
                try {
                    for (const key of selectedRowKeys) {
                        const registration = registrations.find(r => r.id === key);
                        if (!registration || !data?.basicInfo?.id) continue;
                        
                        switch (action) {
                            case 'approve':
                                await tournamentService.updateRegistrationStatus(
                                    data.basicInfo.id,
                                    registration.id,
                                    { 
                                        status: RegistrationStatus.APPROVED,
                                        reason: 'Đã được phê duyệt hàng loạt'
                                    }
                                );
                                break;
                            case 'reject':
                                await tournamentService.updateRegistrationStatus(
                                    data.basicInfo.id,
                                    registration.id,
                                    { 
                                        status: RegistrationStatus.REJECTED,
                                        reason: 'Đã bị từ chối hàng loạt'
                                    }
                                );
                                break;
                            case 'checkin':
                                await tournamentService.checkIn(data.basicInfo.id, {
                                    teamId: registration.teamId
                                });
                                break;
                        }
                        
                        // Small delay to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    
                    // Refresh data
                    await loadRegistrations();
                    message.success(`Đã ${getBulkActionText(action)} ${selectedRowKeys.length} đội`);
                    setSelectedRowKeys([]);
                } catch (error: any) {
                    console.error('Error performing bulk action:', error);
                    message.error(error.response?.data?.message || 'Không thể thực hiện thao tác hàng loạt');
                }
            }
        });
    };

    const getBulkActionText = (action: string) => {
        switch (action) {
            case 'approve': return 'duyệt';
            case 'reject': return 'từ chối';
            case 'checkin': return 'check-in';
            default: return 'thực hiện';
        }
    };

    const handleViewDetails = (record: RegistrationRecord) => {
        Modal.info({
            title: `Chi tiết đăng ký - ${record.teamName}`,
            width: 600,
            content: (
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Tên đội">{record.teamName}</Descriptions.Item>
                    <Descriptions.Item label="Đội trưởng">{record.captainName}</Descriptions.Item>
                    <Descriptions.Item label="Thời gian đăng ký">
                        {record.registeredAt.toLocaleString('vi-VN')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={getStatusColor(record.status)}>
                            {getStatusText(record.status)}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Check-in">
                        {record.hasCheckedIn ? 
                            `Đã check-in lúc ${record.checkedInAt?.toLocaleString('vi-VN')}` : 
                            'Chưa check-in'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số thành viên">
                        {record.teamSize} người
                    </Descriptions.Item>
                    {record.customData && (
                        <Descriptions.Item label="Thông tin bổ sung">
                            <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                                {JSON.stringify(record.customData, null, 2)}
                            </pre>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            ),
        });
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
            render: (status: RegistrationStatus, record) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Check-in',
            dataIndex: 'hasCheckedIn',
            render: (checkedIn: boolean, record) => {
                if (loadingAction === `checkin-${record.id}`) {
                    return <Spin size="small" />;
                }
                
                return checkedIn ? (
                    <Tooltip title={`Đã check-in lúc ${record.checkedInAt?.toLocaleTimeString('vi-VN')}`}>
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                            Đã check-in
                        </Tag>
                    </Tooltip>
                ) : (
                    <Tag color="orange" icon={<ClockCircleOutlined />}>
                        Chưa check-in
                    </Tag>
                );
            },
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
            render: (_, record) => {
                if (loadingAction?.startsWith(record.id)) {
                    return <Spin size="small" />;
                }
                
                return (
                    <Dropdown menu={{ items: getMenuItems(record) }} trigger={['click']}>
                        <Button icon={<MoreOutlined />} size="small" />
                    </Dropdown>
                );
            },
        },
    ];

    const onFinish = async (values: any): Promise<void> => {
        try {
            await updateData('settings', values);
            message.success('Cập nhật cài đặt đăng ký thành công');
        } catch (error) {
            message.error('Không thể cập nhật cài đặt');
        }
    };

    const getMenuItems = (record: RegistrationRecord): MenuProps['items'] => {
        const items: MenuProps['items'] = [];

        // Chỉ hiển thị approve/reject/waitlist cho PENDING
        if (record.status === RegistrationStatus.PENDING) {
            items.push(
                {
                    key: 'approve',
                    icon: <CheckCircleOutlined />,
                    label: 'Duyệt đăng ký',
                    onClick: () => handleApprove(record.id),
                    disabled: !!loadingAction,
                },
                {
                    key: 'reject',
                    icon: <CloseCircleOutlined />,
                    label: 'Từ chối',
                    onClick: () => handleReject(record.id),
                    disabled: !!loadingAction,
                },
                {
                    key: 'waitlist',
                    icon: <ClockCircleOutlined />,
                    label: 'Chuyển vào danh sách chờ',
                    onClick: () => handleMoveToWaitlist(record.id),
                    disabled: !!loadingAction,
                },
            );
        }

        // Hiển thị check-in cho APPROVED chưa check-in
        if (record.status === RegistrationStatus.APPROVED && !record.hasCheckedIn) {
            items.push({
                key: 'checkin',
                icon: <CheckCircleOutlined />,
                label: 'Check-in',
                onClick: () => handleCheckIn(record.id),
                disabled: !!loadingAction,
            });
        }

        // Hiển thị view details cho tất cả
        items.push(
            {
                key: 'view',
                icon: <EyeOutlined />,
                label: 'Xem chi tiết',
                onClick: () => handleViewDetails(record),
            }
        );

        // Hiển thị delete cho organizer
        items.push({
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Hủy đăng ký',
            danger: true,
            onClick: () => handleDelete(record.id),
            disabled: !!loadingAction,
        });

        return items;
    };

    return (
        <div>
            <Row gutter={[24, 16]}>
                {/* Statistics Cards */}
                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Tổng đăng ký"
                                    value={stats.total}
                                    color="#1890ff"
                                    icon={<TeamOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Đã duyệt"
                                    value={stats.approved}
                                    color="#52c41a"
                                    icon={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Chờ duyệt"
                                    value={stats.pending}
                                    color="#faad14"
                                    icon={<ClockCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Danh sách chờ"
                                    value={stats.waitlisted}
                                    color="#1890ff"
                                    icon={<ClockCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Đã check-in"
                                    value={stats.checkedIn}
                                    color="#52c41a"
                                    icon={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4}>
                            <Card size="small">
                                <StatisticCard
                                    title="Slot trống"
                                    value={Math.max(0, (data?.basicInfo.maxTeams || 0) - stats.approved)}
                                    color={stats.approved >= (data?.basicInfo.maxTeams || 0) ? "#f5222d" : "#52c41a"}
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
                                    count={stats.total}
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                            </Space>
                        }
                        size="small"
                        extra={
                            <Space>
                                <Button 
                                    icon={<ExportOutlined />}
                                    onClick={() => message.info('Tính năng đang phát triển')}
                                >
                                    Xuất Excel
                                </Button>
                                <Button 
                                    type="primary"
                                    onClick={() => message.info('Tính năng đang phát triển')}
                                >
                                    Thêm đội thủ công
                                </Button>
                            </Space>
                        }
                    >
                        {/* Filters */}
                        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                            <Col xs={24} sm={12} md={8}>
                                <Input
                                    placeholder="Tìm kiếm tên đội, đội trưởng..."
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Lọc theo trạng thái"
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    allowClear
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
                            <Col xs={24} sm={12} md={6}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Lọc theo check-in"
                                    value={checkedInFilter}
                                    onChange={setCheckedInFilter}
                                    allowClear
                                >
                                    <Option value="all">Tất cả</Option>
                                    <Option value="checked">Đã check-in</Option>
                                    <Option value="not-checked">Chưa check-in</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={4}>
                                <Button 
                                    icon={<FilterOutlined />}
                                    onClick={() => message.info('Tính năng đang phát triển')}
                                    style={{ width: '100%' }}
                                >
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
                                        disabled={!!loadingAction}
                                    >
                                        Duyệt
                                    </Button>
                                    <Button
                                        size="small"
                                        danger
                                        onClick={() => handleBulkAction('reject')}
                                        icon={<CloseCircleOutlined />}
                                        disabled={!!loadingAction}
                                    >
                                        Từ chối
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => handleBulkAction('checkin')}
                                        icon={<CheckCircleOutlined />}
                                        disabled={!!loadingAction}
                                    >
                                        Check-in
                                    </Button>
                                    <Button 
                                        size="small" 
                                        onClick={() => setSelectedRowKeys([])}
                                        disabled={!!loadingAction}
                                    >
                                        Bỏ chọn
                                    </Button>
                                </Space>
                            </div>
                        )}

                        {/* Registration Table */}
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 50 }}>
                                <Spin tip="Đang tải danh sách đăng ký..." />
                            </div>
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={filteredRegistrations}
                                rowKey="id"
                                size="small"
                                rowSelection={{
                                    selectedRowKeys,
                                    onChange: setSelectedRowKeys,
                                    getCheckboxProps: (record) => ({
                                        disabled: !!loadingAction,
                                    }),
                                }}
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    showTotal: (total) => `Tổng ${total} đội`,
                                }}
                                locale={{
                                    emptyText: 'Chưa có đội nào đăng ký',
                                }}
                            />
                        )}
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
                                <Col xs={24} md={12}>
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

                                <Col xs={24} md={12}>
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

                                <Col xs={24} md={12}>
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

                                <Col xs={24} md={12}>
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
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            size="large"
                                            loading={loading}
                                        >
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
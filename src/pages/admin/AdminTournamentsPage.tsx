import React, { useState } from "react";
import dayjs from "dayjs";
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
  DatePicker,
  Select
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  TrophyOutlined,
  CalendarOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

interface Tournament {
  id: string;
  name: string;
  date: string;
  prize: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  game: string;
  participants: number;
}

export const AdminTournamentsPage: React.FC = () => {
  const [data, setData] = useState<Tournament[]>([
    { 
      id: "1", 
      name: "Esports Cup 2025", 
      date: "2025-10-05", 
      prize: "1,000,000,000 VNĐ",
      status: 'upcoming',
      game: 'Valorant',
      participants: 32
    },
    { 
      id: "2", 
      name: "League of Legends Championship", 
      date: "2025-09-15", 
      prize: "500,000,000 VNĐ",
      status: 'ongoing',
      game: 'League of Legends',
      participants: 16
    },
    { 
      id: "3", 
      name: "CS2 Masters", 
      date: "2025-08-20", 
      prize: "750,000,000 VNĐ",
      status: 'completed',
      game: 'Counter-Strike 2',
      participants: 24
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newTournament: Tournament = {
        id: Date.now().toString(),
        ...values,
        participants: 0,
        date: values.date.format('YYYY-MM-DD')
      };
      setData([...data, newTournament]);
      setIsModalOpen(false);
      message.success("Thêm giải đấu thành công!");
      form.resetFields();
    });
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
    form.setFieldsValue({
      ...tournament,
      date: tournament.date ? dayjs(tournament.date) : null
    });
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      setData(data.map(item => 
        item.id === editingTournament?.id ? { 
          ...item, 
          ...values,
          date: values.date.format('YYYY-MM-DD')
        } : item
      ));
      setIsModalOpen(false);
      setEditingTournament(null);
      message.success("Cập nhật giải đấu thành công!");
      form.resetFields();
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa giải đấu này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        setData(data.filter(item => item.id !== id));
        message.success("Xóa giải đấu thành công!");
      },
    });
  };

  const getStatusTag = (status: string) => {
    const config = {
      upcoming: { color: 'blue', text: 'Sắp diễn ra' },
      ongoing: { color: 'green', text: 'Đang diễn ra' },
      completed: { color: 'default', text: 'Đã kết thúc' }
    };
    const statusConfig = config[status as keyof typeof config];
    return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>;
  };

  const columns = [
    {
      title: "Tên giải đấu",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Tournament) => (
        <div>
          <Text strong style={{ fontSize: 14, display: 'block' }}>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Game: {record.game}</Text>
        </div>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (
        <Space>
          <CalendarOutlined style={{ color: '#1890ff' }} />
          <Text>{date}</Text>
        </Space>
      ),
    },
    {
      title: "Giải thưởng",
      dataIndex: "prize",
      key: "prize",
      render: (prize: string) => (
        <Tag 
          color="gold"
          style={{ fontWeight: 600, fontSize: 12 }}
        >
          🏆 {prize}
        </Tag>
      ),
    },
    {
      title: "Tham gia",
      dataIndex: "participants",
      key: "participants",
      render: (participants: number) => (
        <Text strong>{participants} đội</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_ : any, record: Tournament) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ 
            margin: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            🏅 Quản lý giải đấu
          </Title>
          <Text type="secondary">Tạo và quản lý các giải đấu Esports</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => {
            setEditingTournament(null);
            setIsModalOpen(true);
            form.resetFields();
          }}
        >
          Thêm giải đấu
        </Button>
      </div>

      <Card
        style={{
          borderRadius: 16,
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
        />
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrophyOutlined />
            {editingTournament ? "Chỉnh sửa giải đấu" : "Thêm giải đấu mới"}
          </div>
        }
        open={isModalOpen}
        onOk={editingTournament ? handleUpdate : handleAdd}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTournament(null);
          form.resetFields();
        }}
        okText={editingTournament ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item 
            name="name" 
            label="Tên giải đấu" 
            rules={[{ required: true, message: 'Vui lòng nhập tên giải đấu!' }]}
          >
            <Input placeholder="Nhập tên giải đấu" size="large" />
          </Form.Item>
          <Form.Item 
            name="game" 
            label="Game" 
            rules={[{ required: true, message: 'Vui lòng chọn game!' }]}
          >
            <Select placeholder="Chọn game" size="large">
              <Option value="Valorant">Valorant</Option>
              <Option value="League of Legends">League of Legends</Option>
              <Option value="Counter-Strike 2">Counter-Strike 2</Option>
              <Option value="DOTA 2">DOTA 2</Option>
              <Option value="PUBG Mobile">PUBG Mobile</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="date" 
            label="Ngày bắt đầu" 
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              size="large" 
              format="DD/MM/YYYY"
            />
          </Form.Item>
          <Form.Item 
            name="prize" 
            label="Giải thưởng"
          >
            <Input placeholder="Nhập giải thưởng" size="large" />
          </Form.Item>
          <Form.Item 
            name="status" 
            label="Trạng thái"
            initialValue="upcoming"
          >
            <Select size="large">
              <Option value="upcoming">Sắp diễn ra</Option>
              <Option value="ongoing">Đang diễn ra</Option>
              <Option value="completed">Đã kết thúc</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
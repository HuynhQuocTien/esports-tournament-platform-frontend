import { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Team {
  id: string;
  name: string;
  members: number;
}

export const AdminTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([{ id: "1", name: "Team Alpha", members: 5 }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      setTeams([...teams, { id: Date.now().toString(), ...values }]);
      setIsModalOpen(false);
      message.success("Thêm đội thành công!");
      form.resetFields();
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>👥 Quản lý đội tham gia</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Thêm đội
        </Button>
      </div>

      <Table
        dataSource={teams}
        rowKey="id"
        columns={[
          { title: "Tên đội", dataIndex: "name" },
          { title: "Số thành viên", dataIndex: "members" },
        ]}
      />

      <Modal title="Thêm đội" open={isModalOpen} onOk={handleAdd} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên đội" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="members" label="Số thành viên" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
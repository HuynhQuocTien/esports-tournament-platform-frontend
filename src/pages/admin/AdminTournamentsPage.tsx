import { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Tournament {
  id: string;
  name: string;
  date: string;
  prize: string;
}

export const AdminTournamentsPage: React.FC = () => {
  const [data, setData] = useState<Tournament[]>([
    { id: "1", name: "Esports Cup 2025", date: "2025-10-05", prize: "1B VNĐ" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      setData([...data, { id: Date.now().toString(), ...values }]);
      setIsModalOpen(false);
      form.resetFields();
      message.success("Thêm giải đấu thành công!");
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Quản lý giải đấu</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Thêm giải đấu
        </Button>
      </div>

      <Table
        dataSource={data}
        rowKey="id"
        columns={[
          { title: "Tên giải đấu", dataIndex: "name" },
          { title: "Ngày bắt đầu", dataIndex: "date" },
          { title: "Giải thưởng", dataIndex: "prize" },
        ]}
      />

      <Modal
        title="Thêm giải đấu"
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên giải đấu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="prize" label="Giải thưởng">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
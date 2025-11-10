import React from "react";
import { Table, Typography, Button } from "antd";
import { Link } from "react-router-dom"; // Giả sử bạn dùng router

const { Title, Text } = Typography;

const data = [
  { key: 1, team: "Team Alpha", win: 10, lose: 2, points: 30 },
  { key: 2, team: "Team Beta", win: 8, lose: 4, points: 24 },
  { key: 3, team: "Team Gamma", win: 7, lose: 5, points: 21 },
  { key: 4, team: "Team Delta", win: 6, lose: 6, points: 18 },
];

const columns = [
  { title: "Hạng", dataIndex: "key", key: "rank" },
  { title: "Đội", dataIndex: "team", key: "team" },
  { title: "Thắng", dataIndex: "win", key: "win" },
  { title: "Thua", dataIndex: "lose", key: "lose" },
  { title: "Điểm", dataIndex: "points", key: "points" },
];

export const RankingSection: React.FC = () => {
  return (
    <section
      style={{
        marginBottom: 80,
        background: "var(--ant-color-bg-container)",
        border: "1px solid var(--ant-color-border-secondary)",
        padding: 24,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>BẢNG XẾP HẠNG</Title>
        <Link to="/rankings">
          <Button type="link">Xem tất cả →</Button>
        </Link>
      </div>
      <Text type="secondary">Cập nhật kết quả và thứ hạng mới nhất</Text>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        style={{ marginTop: 24, borderRadius: 12 }}
      />
    </section>
  );
};
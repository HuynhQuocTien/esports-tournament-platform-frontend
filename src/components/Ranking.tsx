import React from "react";
import { Table } from "antd";

const Ranking: React.FC = () => {
  const dataSource = [
    { key: "1", team: "Team A", points: 30 },
    { key: "2", team: "Team B", points: 28 },
    { key: "3", team: "Team C", points: 25 },
  ];

  const columns = [
    { title: "Đội", dataIndex: "team", key: "team" },
    { title: "Điểm", dataIndex: "points", key: "points" },
  ];

  return (
    <div style={{ padding: "40px 80px" }}>
      <h2 style={{ marginBottom: 24 }}>📊 Bảng Xếp Hạng</h2>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default Ranking;

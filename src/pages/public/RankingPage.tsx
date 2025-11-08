import React from "react";
import { Card, Table, Typography } from "antd";

const { Title } = Typography;

const mockRanking = [
  { key: "1", team: "Đội A", wins: 5, losses: 1, points: 15 },
  { key: "2", team: "Đội B", wins: 4, losses: 2, points: 12 },
  { key: "3", team: "Đội C", wins: 3, losses: 3, points: 9 },
  { key: "4", team: "Đội D", wins: 2, losses: 4, points: 6 },
];

const PAGE_BACKGROUND_COLOR = "#f5f7fa";
const CARD_BACKGROUND_COLOR = "#f0f5ff";
const CARD_BORDER_COLOR = "#d6e4ff";

export const RankingPage: React.FC = () => {
  const columns = [
    { title: "Đội", dataIndex: "team", key: "team" },
    { title: "Thắng", dataIndex: "wins", key: "wins" },
    { title: "Thua", dataIndex: "losses", key: "losses" },
    { title: "Điểm", dataIndex: "points", key: "points" },
  ];

  return (
    <div
      style={{
        padding: 32,
        background: PAGE_BACKGROUND_COLOR,
        minHeight: "100vh",
      }}
    >
      <Card
        style={{
          background: CARD_BACKGROUND_COLOR,
          borderRadius: 10,
          border: `1px solid ${CARD_BORDER_COLOR}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Title level={2}>Bảng xếp hạng</Title>
        <Table
          dataSource={mockRanking}
          columns={columns}
          pagination={false}
          rowKey="key"
        />
      </Card>
    </div>
  );
};

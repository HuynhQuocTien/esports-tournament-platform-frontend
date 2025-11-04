import { Table } from "antd";

export const AdminRankingPage: React.FC = () => {
  const ranking = [
    { rank: 1, team: "Team Alpha", points: 1500 },
    { rank: 2, team: "Team Bravo", points: 1300 },
    { rank: 3, team: "Team Delta", points: 1200 },
  ];

  return (
    <div>
      <h2>Bảng xếp hạng</h2>
      <Table
        dataSource={ranking}
        rowKey="rank"
        columns={[
          { title: "Hạng", dataIndex: "rank" },
          { title: "Đội", dataIndex: "team" },
          { title: "Điểm", dataIndex: "points" },
        ]}
      />
    </div>
  );
};
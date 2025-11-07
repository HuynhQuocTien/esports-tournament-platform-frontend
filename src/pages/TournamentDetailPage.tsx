import { useParams } from "react-router-dom";
import { Card, List, Typography } from "antd";
import type { MatchSchedule, TournamentDetail } from "../common/types";
import { v4 as uuidv4 } from "uuid";

const { Title, Paragraph } = Typography;

const mockDetails: TournamentDetail[] = [
  {
    id: uuidv4(),
    name: "Esports Cup 2025",
    description:
      "Giải đấu Esports lớn nhất năm với sự tham gia của 16 đội hàng đầu.",
    schedule: [
      { match: "Đội A vs Đội B", time: "2025-10-05 18:00" },
      { match: "Đội C vs Đội D", time: "2025-10-06 20:00" },
    ],
  },
  {
    id: uuidv4(),
    name: "Champion League",
    description: "Giải đấu Liên Minh Huyền Thoại chuyên nghiệp.",
    schedule: [
      { match: "Đội X vs Đội Y", time: "2025-10-07 19:00" },
      { match: "Đội Z vs Đội W", time: "2025-10-08 21:00" },
    ],
  },
];

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const detail = mockDetails.find((t) => t.id === id);

  if (!detail) {
    return <p>Không tìm thấy giải đấu</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>{detail.name}</Title>
        <Paragraph>{detail.description}</Paragraph>

        <Title level={3}>Lịch thi đấu</Title>
        <List<MatchSchedule>
          bordered
          dataSource={detail.schedule}
          renderItem={(item) => (
            <List.Item>
              <strong>{item.match}</strong> - {item.time}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

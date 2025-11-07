import React from "react";
import { useParams } from "react-router-dom";
import { Card, List, Typography } from "antd";
import type { TournamentDetail } from "../common/types";
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

const PAGE_BACKGROUND_COLOR = "#f5f7fa";
const CARD_BACKGROUND_COLOR = "#f0f5ff";
const CARD_BORDER_COLOR = "#d6e4ff";

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const detail = mockDetails.find((t) => t.id === id);

  if (!detail) {
    return (
      <div style={{ padding: 32, background: "#f5f7fa", minHeight: "100vh" }}>
        <p>Không tìm thấy giải đấu</p>
      </div>
    );
  }

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
          background: CARD_BACKGROUND_COLOR, // <-- THAY ĐỔI
          borderRadius: 10,
          border: `1px solid ${CARD_BORDER_COLOR}`, // <-- THAY ĐỔI
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
        variant="borderless" // Bạn có thể giữ hoặc bỏ 'borderless' tùy ý
      >
        <Title level={2}>{detail.name}</Title>
        <Paragraph>{detail.description}</Paragraph>

        <Title level={3}>Lịch thi đấu</Title>
        <List
          bordered
          dataSource={detail.schedule}
          // List sẽ giữ nền trắng mặc định
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
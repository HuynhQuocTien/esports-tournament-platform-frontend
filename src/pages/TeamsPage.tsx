import React from "react";
import { Card, List, Avatar, Typography } from "antd";
import type { Team } from "../common/types";

const { Title } = Typography;

const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Đội A",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=teamA",
    members: ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5"],
  },
  {
    id: "team-2",
    name: "Đội B",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=teamB",
    members: ["Player 6", "Player 7", "Player 8", "Player 9", "Player 10"],
  },
];

const PAGE_BACKGROUND_COLOR = "#f5f7fa";
const CARD_BACKGROUND_COLOR = "#f0f5ff";
const CARD_BORDER_COLOR = "#d6e4ff";

export const TeamsPage: React.FC = () => {
  return (
    <div
      style={{
        padding: 32,
        background: PAGE_BACKGROUND_COLOR,
        minHeight: "100vh",
      }}
    >
      {/* Card "trang" */}
      <Card
        style={{
          background: CARD_BACKGROUND_COLOR, // <-- THAY ĐỔI
          borderRadius: 10,
          border: `1px solid ${CARD_BORDER_COLOR}`, // <-- THAY ĐỔI
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Title level={2}>Các đội tham gia</Title>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={mockTeams}
          // List.Item sẽ trong suốt, để lộ nền Card "trang"
          renderItem={(team) => (
            <List.Item>
              {/* Card "item" - giữ nền trắng mặc định */}
              <Card
                hoverable
                title={
                  <span style={{ fontWeight: 600 }}>
                    <Avatar src={team.logo} style={{ marginRight: 8 }} />
                    {team.name}
                  </span>
                }
                style={{
                  border: "1px solid #e6e6e6",
                  borderRadius: 10,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  // Nền trắng (mặc định)
                }}
              >
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {team.members.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

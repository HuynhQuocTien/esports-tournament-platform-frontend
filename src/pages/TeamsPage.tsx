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

export const TeamsPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>Các đội tham gia</Title>
        <List<Team>
          grid={{ gutter: 16, column: 2 }}
          dataSource={mockTeams}
          renderItem={(team) => (
            <List.Item>
              <Card
                title={
                  <span>
                    <Avatar src={team.logo} style={{ marginRight: 8 }} />
                    {team.name}
                  </span>
                }
              >
                <ul>
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

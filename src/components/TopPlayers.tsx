import React from "react";
import { List, Avatar, Card } from "antd";

const TopPlayers: React.FC = () => {
  const players = [
    { name: "Player One", team: "Team A" },
    { name: "Player Two", team: "Team B" },
    { name: "Player Three", team: "Team C" },
  ];

  return (
    <div style={{ padding: "40px 80px" }}>
      <h2 style={{ marginBottom: 24 }}>🎮 Top Người Chơi</h2>
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={players}
          renderItem={(p) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{p.name.charAt(0)}</Avatar>}
                title={p.name}
                description={`Đội: ${p.team}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default TopPlayers;

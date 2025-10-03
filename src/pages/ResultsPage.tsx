import React from "react";
import { Card, List, Typography } from "antd";
import type { MatchResult } from "../types";

const { Title } = Typography;

const mockResults: MatchResult[] = [
  { match: "Đội A vs Đội B", winner: "Đội A", score: "2 - 1" },
  { match: "Đội C vs Đội D", winner: "Đội D", score: "0 - 2" },
  { match: "Đội E vs Đội F", winner: "Đội E", score: "2 - 0" },
];

export const ResultsPage: React.FC = () => {
   return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>Kết quả gần đây</Title>
        <List<MatchResult>
          bordered
          dataSource={mockResults}
          renderItem={(item) => (
            <List.Item>
              <div style={{ flex: 1 }}>
                <strong>{item.match}</strong>
              </div>
              <div>
                <span style={{ marginRight: 16 }}>
                  🏆 {item.winner}
                </span>
                <span>{item.score}</span>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

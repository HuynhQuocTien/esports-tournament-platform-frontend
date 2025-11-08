import React from "react";
import { Card, List, Typography } from "antd";
import type { MatchResult } from "../../common/types";

const { Title } = Typography;

const mockResults: MatchResult[] = [
  { match: "Đội A vs Đội B", winner: "Đội A", score: "2 - 1" },
  { match: "Đội C vs Đội D", winner: "Đội D", score: "0 - 2" },
  { match: "Đội E vs Đội F", winner: "Đội E", score: "2 - 0" },
];

const PAGE_BACKGROUND_COLOR = "#f5f7fa";
const CARD_BACKGROUND_COLOR = "#f0f5ff";
const CARD_BORDER_COLOR = "#d6e4ff";
const THEME_PRIMARY_COLOR = "#722ed1";

export const ResultsPage: React.FC = () => {
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
        <Title level={2}>Kết quả gần đây</Title>
        <List
          bordered
          dataSource={mockResults}
          renderItem={(item) => (
            <List.Item>
              <div style={{ flex: 1, fontWeight: 500 }}>{item.match}</div>
              <div>
                <span
                  style={{
                    marginRight: 16,
                    color: THEME_PRIMARY_COLOR,
                  }}
                >
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

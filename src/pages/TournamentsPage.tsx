import { Card, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";

export const TournamentsPage: React.FC = () => {
  const mockTournaments = useMemo(() => [
    { id: uuidv4(), name: "Esports Cup 2025", description: "Giải đấu lớn nhất năm" },
    { id: uuidv4(), name: "Champion League", description: "Giải chuyên nghiệp" },
  ], []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách giải đấu</h2>
      <Row gutter={[16, 16]}>
        {mockTournaments.map((t) => (
          <Col span={8} key={t.id}>
            <Card title={t.name} bordered>
              <p>{t.description}</p>
              <Link to={`/tournaments/${t.id}`}>
                <Button type="primary">Xem chi tiết</Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

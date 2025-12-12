import { useState, useEffect } from "react";
import { tournamentService } from "@/services/tournamentService";
import TournamentCard from "@/components/tournament/TournamentCard";
import TournamentFilter from "@/components/tournament/TournamentFilter";
import EmptyState from "@/components/tournament/Empty";
import { Button, Row, Col } from "antd";
import type { ITournament } from "@/common/interfaces/tournament/tournament";

export default function MyTournamentPage() {
    const [tournaments, setTournaments] =  useState<ITournament[]>([]);
    const [filter, setFilter] = useState("all");

    const fetchData = async () => {
        const {data} = await tournamentService.listMine();
        setTournaments(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = tournaments.filter((t: any) => {
        if (filter === "all") return true;
        if (filter === "draft") return t.status === "DRAFT";
        if (filter === "published") return t.status === "PUBLISHED";
        if (filter === "ongoing") return t.status === "ONGOING";
        if (filter === "finished") return t.status === "FINISHED";
        return true;
    });

    return (
        <div style={{ maxWidth: 1100, margin: "auto", padding: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 600 }}>Giải đấu của tôi</h2>

        <Button
          type="primary"
          size="large"
          onClick={() => (window.location.href = "create-league")}
        >
          + Tạo giải đấu
        </Button>
      </div>

      {/* Tabs lọc */}
      <TournamentFilter current={filter} onChange={setFilter} />

      {/* Danh sách */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <Row gutter={[20, 20]}>
          {filtered.map((t: any) => (
            <Col xs={24} sm={12} md={8} key={t.id}>
              <TournamentCard
                tournament={t}
                onEdit={() => (window.location.href = `/tournaments/setup/${t.id}`)}
                onDelete={() => console.log("delete", t.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
    );
}
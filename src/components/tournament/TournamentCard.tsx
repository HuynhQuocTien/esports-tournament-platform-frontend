import { EditOutlined } from "@ant-design/icons";
import { Avatar, Card, Tag } from "antd";

interface Props {
    tournament: any;
    onEdit: () => void;
    onDelete: () => void;
}

export default function TournamentCard({ tournament, onEdit, onDelete }: Props) {
    const statusColors = {
        DRAFT: "default",
        PUBLISHED: "green",
        ONGOING: "blue",
        COMPLETED: "gray",
    };
    return (
        <Card
            hoverable
            cover={
                <img
                    alt={tournament.name}
                    src={tournament.bannerUrl || "/default-tournament.png"}
                    style = {{ height: 200, objectFit: "cover" }}
                />
            }

            actions={[
                <EditOutlined key="edit" onClick={onEdit} />,
                <EditOutlined key="delete" onClick={onDelete} />,
            ]}
        >
            <Card.Meta
                avatar={
                    <Avatar
                        src={tournament.logoUrl || "/default-avatar.png"}
                        size={60}
                    />
                }
                title={tournament.name}
                description={
                    <>  
                        <div>Game: {tournament.game}</div>
                        <div>Định dạng: {tournament.format}</div>
                        <div>Đội tối đa: {tournament.maxTeams}</div>
                        <div>Ngày bắt đầu: {tournament.startDate}</div>
                        <Tag color={statusColors["DRAFT"]}>
                            {tournament.status}
                        </Tag>
                    </>
                }
            />
        </Card>
    );
}
import { tournamentService } from '@/services/tournamentService';
import { Tabs, Card, Table, Button, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const { TabPane } = Tabs;

const TournamentDetail = () => {
    const { id } = useParams();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const res = await tournamentService.getById(id);
                setTournament(res.data);
            } catch (err) {
                console.error("Failed to fetch tournament:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchTournament();
    }, [id]);

    if (loading) return <Spin style={{ display: 'block', margin: '100px auto' }} />;

    return (
        <Card title={tournament.name}>
        <Tabs defaultActiveKey="overview">
            <TabPane tab="Overview" key="overview">
            <p><strong>Game:</strong> {tournament.game}</p>
            <p><strong>Format:</strong> {tournament.format}</p>
            <p><strong>Type:</strong> {tournament.type}</p>
            <p><strong>Match Format:</strong> {tournament.matchFormat}</p>
            <p><strong>Number of Sets:</strong> {tournament.numberOfSets}</p>
            <p><strong>Start Date:</strong> {tournament.startDate}</p>
            <p><strong>Registration:</strong> {tournament.registrationStart} - {tournament.registrationEnd}</p>
            <p><strong>Status:</strong> {tournament.status}</p>
            </TabPane>

            <TabPane tab="Matches" key="matches">
            <Button type="primary">Create Match</Button>
            <Table
                dataSource={tournament.brackets.flatMap(b => b.matches)}
                columns={[
                { title: 'Match ID', dataIndex: 'id' },
                { title: 'Team A', dataIndex: 'teamA' },
                { title: 'Team B', dataIndex: 'teamB' },
                { title: 'Score', dataIndex: 'score' },
                { title: 'Date', dataIndex: 'matchDate' },
                ]}
            />
            </TabPane>

            <TabPane tab="Registrations" key="registrations">
            <Table
                dataSource={tournament.registrations}
                columns={[
                { title: 'Team / Player', dataIndex: 'name' },
                { title: 'Status', dataIndex: 'status' },
                { title: 'Registered At', dataIndex: 'createdAt' },
                {
                    title: 'Action',
                    render: (_, record) => <Button>Approve / Reject</Button>
                }
                ]}
            />
            </TabPane>

            <TabPane tab="Prizes" key="prizes">
            {tournament.prizes?.map((prize, idx) => (
                <p key={idx}>{prize.name}: {prize.amount}</p>
            ))}
            </TabPane>

            <TabPane tab="Settings" key="settings">
            <p><strong>Location:</strong> {tournament.location}</p>
            <p><strong>Phone:</strong> {tournament.phoneNumber}</p>
            <p><strong>Published:</strong> {tournament.isPublished ? 'Yes' : 'No'}</p>
            <p><strong>Active:</strong> {tournament.isActive ? 'Yes' : 'No'}</p>
            </TabPane>

            <TabPane tab="History" key="history">
            <p>Activity log coming soon...</p>
            </TabPane>
        </Tabs>
        </Card>
    )
    }

export default TournamentDetail;

import { Text } from "recharts";

export const StatisticCard: React.FC<{
    title: string;
    value: number;
    color: string;
    icon: React.ReactNode;
}> = ({ title, value, color, icon }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, color, marginBottom: 8 }}>
            {icon}
        </div>
        <Text style={{ fontSize: 28, color }}>
            {value}
        </Text>
        <div>
            <Text type="secondary">{title}</Text>
        </div>
    </div>
);

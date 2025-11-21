import { Empty } from "antd";

export default function EmptyState() {
  return (
    <div style={{ padding: "50px 0" }}>
      <Empty description="Bạn chưa tạo giải đấu nào." />
    </div>
  );
}

import { Tabs } from "antd";

type Props = {
  current: string;
  onChange: (key: string) => void;
};

export default function TournamentFilter({ current, onChange }: Props) {
  return (
    <Tabs
      activeKey={current}
      onChange={onChange}
      items={[
        { key: "all", label: "Tất cả" },
        { key: "published", label: "Đã xuất bản" },
        { key: "draft", label: "Nháp" },
        { key: "ongoing", label: "Đang diễn ra" },
        { key: "finished", label: "Đã kết thúc" },
      ]}
    />
  );
}

import dayjs from "dayjs";

export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M VNĐ`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K VNĐ`;
  }
  return `${amount} VNĐ`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "Chưa xác định";
  return dayjs(dateString).format("DD/MM/YYYY HH:mm");
};

export const formatDateShort = (dateString?: string): string => {
  if (!dateString) return "TBA";
  return dayjs(dateString).format("DD/MM");
};

export const getGameIcon = (game: string): string => {
  const icons: Record<string, string> = {
    "CS2": "🔫",
    "Valorant": "💥",
    "League of Legends": "⚔️",
    "Dota 2": "🛡️",
    "PUBG": "🎯",
    "Mobile Legends": "📱",
    "Arena of Valor": "🏹",
    "FIFA": "⚽",
    "Call of Duty": "🎖️",
    "Overwatch": "⚡",
  };
  return icons[game] || "🎮";
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "LIVE": return "red";
    case "REGISTRATION_OPEN": return "green";
    case "UPCOMING": return "orange";
    case "COMPLETED": return "gray";
    case "DRAFT": return "blue";
    case "REGISTRATION_CLOSED": return "volcano";
    default: return "default";
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "LIVE": return "Đang diễn ra";
    case "REGISTRATION_OPEN": return "Đang mở đăng ký";
    case "UPCOMING": return "Sắp diễn ra";
    case "COMPLETED": return "Đã kết thúc";
    case "DRAFT": return "Bản nháp";
    case "REGISTRATION_CLOSED": return "Đã đóng đăng ký";
    default: return status;
  }
};

export const getFormatText = (format: string): string => {
  switch (format) {
    case "SINGLE_ELIMINATION": return "Loại trực tiếp";
    case "DOUBLE_ELIMINATION": return "Loại kép";
    case "ROUND_ROBIN": return "Vòng tròn";
    case "SWISS": return "Thụy Sĩ";
    default: return format;
  }
};

export const getMatchStatus = (status: string): { text: string; color: string } => {
  switch (status) {
    case "PENDING": return { text: "Chờ", color: "default" };
    case "SCHEDULED": return { text: "Đã lịch", color: "blue" };
    case "LIVE": return { text: "Đang diễn ra", color: "red" };
    case "COMPLETED": return { text: "Đã kết thúc", color: "green" };
    case "CANCELLED": return { text: "Hủy", color: "gray" };
    default: return { text: status, color: "default" };
  }
};

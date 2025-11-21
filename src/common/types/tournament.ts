// Object chứa tất cả giá trị
export const TournamentFormatValues = [
  "SINGLE_ELIMINATION",
  "DOUBLE_ELIMINATION",
  // "ROUND_ROBIN",
  // "SWISS_SYSTEM",
  // "GROUP_STAGE",
  // "HYBRID",
] as const;

// Union type từ mảng
export type TournamentFormat = typeof TournamentFormatValues[number];

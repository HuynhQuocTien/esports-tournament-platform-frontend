export const RegistrationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WAITLISTED: 'waitlisted',
  CANCELLED: 'cancelled'
} as const;

export type RegistrationStatus = typeof RegistrationStatus[keyof typeof RegistrationStatus];

// labels
export const STATUS_LABELS = {
  [RegistrationStatus.PENDING]: 'Chờ duyệt',
  [RegistrationStatus.APPROVED]: 'Đã duyệt',
  [RegistrationStatus.REJECTED]: 'Đã từ chối',
  [RegistrationStatus.WAITLISTED]: 'Danh sách chờ',
  [RegistrationStatus.CANCELLED]: 'Đã hủy'
};

// Colors
export const STATUS_COLORS = {
  [RegistrationStatus.PENDING]: 'orange',
  [RegistrationStatus.APPROVED]: 'green',
  [RegistrationStatus.REJECTED]: 'red',
  [RegistrationStatus.WAITLISTED]: 'blue',
  [RegistrationStatus.CANCELLED]: 'gray'
};

export const getStatusOptions = () => {
  return Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
    color: STATUS_COLORS[value]
  }));
};
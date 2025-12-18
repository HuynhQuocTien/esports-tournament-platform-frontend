/**
 * Utility functions for formatting data
 */

/**
 * Format date to Vietnamese locale string
 * @param dateString - Date string or Date object to format
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | Date | null | undefined,
  options: {
    showTime?: boolean;
    showYear?: boolean;
    locale?: string;
    timeZone?: string;
  } = {}
): string => {
  if (!dateString) return 'Chưa có thông tin';

  const {
    showTime = false,
    showYear = true,
    locale = 'vi-VN',
    timeZone = 'Asia/Ho_Chi_Minh'
  } = options;

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Ngày không hợp lệ';
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      ...(showYear && { year: 'numeric' }),
      ...(showTime && {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      timeZone
    };

    // For time-only display
    if (!showYear && !showTime) {
      return date.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        timeZone
      });
    }

    return date.toLocaleDateString(locale, dateOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Lỗi định dạng ngày';
  }
};

/**
 * Format date with relative time (e.g., "2 ngày trước")
 * @param dateString - Date string or Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (
  dateString: string | Date | null | undefined
): string => {
  if (!dateString) return 'Chưa có thông tin';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Ngày không hợp lệ';

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
      return 'Vừa xong';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays === 1) {
      return 'Hôm qua';
    } else if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    } else if (diffInMonths === 1) {
      return '1 tháng trước';
    } else if (diffInMonths < 12) {
      return `${diffInMonths} tháng trước`;
    } else if (diffInYears === 1) {
      return '1 năm trước';
    } else {
      return `${diffInYears} năm trước`;
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Lỗi định dạng thời gian';
  }
};

/**
 * Format date range (from - to)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined
): string => {
  if (!startDate || !endDate) return 'Chưa có thông tin';

  const start = formatDate(startDate, { showTime: true });
  const end = formatDate(endDate, { showTime: true });

  return `${start} - ${end}`;
};

/**
 * Format currency amount
 * @param amount - Amount to format
 * @param options - Currency formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | string | null | undefined,
  options: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
    compactDisplay?: 'short' | 'long';
  } = {}
): string => {
  if (amount === null || amount === undefined || amount === '') {
    return '$0';
  }

  const {
    currency = 'USD',
    locale = 'vi-VN',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    notation = 'standard',
    compactDisplay = 'short'
  } = options;

  try {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
      return 'Số tiền không hợp lệ';
    }

    // For compact notation (e.g., 1K, 1M)
    if (notation === 'compact' && numericAmount >= 1000) {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        notation: 'compact',
        compactDisplay,
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      });
      return formatter.format(numericAmount);
    }

    // Standard notation
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    });

    return formatter.format(numericAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return 'Lỗi định dạng tiền tệ';
  }
};

/**
 * Format currency without symbol
 * @param amount - Amount to format
 * @returns Formatted number string
 */
export const formatNumber = (
  amount: number | string | null | undefined
): string => {
  if (amount === null || amount === undefined || amount === '') {
    return '0';
  }

  try {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
      return 'Số không hợp lệ';
    }

    return new Intl.NumberFormat('vi-VN').format(numericAmount);
  } catch (error) {
    console.error('Error formatting number:', error);
    return 'Lỗi định dạng số';
  }
};

/**
 * Format large numbers with abbreviations
 * @param num - Number to format
 * @returns Formatted string (e.g., 1.5K, 2.3M)
 */
export const formatCompactNumber = (
  num: number | string | null | undefined
): string => {
  if (num === null || num === undefined || num === '') {
    return '0';
  }

  try {
    const number = typeof num === 'string' ? parseFloat(num) : num;

    if (isNaN(number)) {
      return 'Số không hợp lệ';
    }

    if (number === 0) return '0';

    const absNumber = Math.abs(number);
    const sign = number < 0 ? '-' : '';

    const format = (value: number, suffix: string): string => {
      const rounded = Math.round(value * 10) / 10;
      return `${sign}${rounded}${suffix}`;
    };

    if (absNumber >= 1000000000) {
      return format(absNumber / 1000000000, 'B');
    } else if (absNumber >= 1000000) {
      return format(absNumber / 1000000, 'M');
    } else if (absNumber >= 1000) {
      return format(absNumber / 1000, 'K');
    } else if (absNumber >= 1) {
      return `${sign}${Math.round(absNumber)}`;
    } else {
      return `${sign}${absNumber.toFixed(1)}`;
    }
  } catch (error) {
    console.error('Error formatting compact number:', error);
    return 'Lỗi định dạng';
  }
};

/**
 * Format percentage
 * @param value - Percentage value (0-100 or 0-1)
 * @param options - Formatting options
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number | string | null | undefined,
  options: {
    isDecimal?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  if (value === null || value === undefined || value === '') {
    return '0%';
  }

  const {
    isDecimal = false,
    minimumFractionDigits = 0,
    maximumFractionDigits = 1
  } = options;

  try {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
      return 'Tỷ lệ không hợp lệ';
    }

    const percentageValue = isDecimal ? numericValue * 100 : numericValue;

    return new Intl.NumberFormat('vi-VN', {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits
    }).format(percentageValue / 100);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return 'Lỗi định dạng phần trăm';
  }
};

/**
 * Format duration in seconds to HH:MM:SS
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 0) return '00:00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num: number): string => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  } else {
    return `${pad(minutes)}:${pad(secs)}`;
  }
};

/**
 * Format file size
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 100
): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Format Vietnamese phone number
 * @param phoneNumber - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (
  phoneNumber: string | null | undefined
): string => {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if it's a valid Vietnamese phone number
  if (cleaned.length === 10) {
    // Format: 090 123 4567
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('84')) {
    // Format: +84 90 123 4567
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('+84')) {
    // Format: +84 90 123 4567
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  // Return original if can't format
  return phoneNumber;
};

/**
 * Format tournament status for display
 * @param status - Tournament status
 * @returns Formatted status with color
 */
export const formatTournamentStatus = (
  status: string | null | undefined
): { text: string; color: string } => {
  const statusMap: Record<string, { text: string; color: string }> = {
    DRAFT: { text: 'Bản nháp', color: 'default' },
    UPCOMING: { text: 'Sắp diễn ra', color: 'blue' },
    REGISTRATION: { text: 'Đang đăng ký', color: 'green' },
    LIVE: { text: 'Đang diễn ra', color: 'orange' },
    COMPLETED: { text: 'Đã kết thúc', color: 'default' },
    CANCELLED: { text: 'Đã hủy', color: 'red' },
  };

  return statusMap[status?.toUpperCase() || ''] || { text: status || 'Không xác định', color: 'default' };
};

/**
 * Format game name with icon/color
 * @param gameName - Game name
 * @returns Formatted game info
 */
export const formatGameInfo = (
  gameName: string | null | undefined
): { name: string; color: string; icon: string } => {
  const gameMap: Record<string, { name: string; color: string; icon: string }> = {
    'valorant': { name: 'Valorant', color: '#ff4655', icon: '🔫' },
    'league of legends': { name: 'League of Legends', color: '#005580', icon: '⚔️' },
    'lol': { name: 'League of Legends', color: '#005580', icon: '⚔️' },
    'cs:go': { name: 'CS:GO', color: '#f5c842', icon: '🎯' },
    'csgo': { name: 'CS:GO', color: '#f5c842', icon: '🎯' },
    'counter-strike': { name: 'CS:GO', color: '#f5c842', icon: '🎯' },
    'dota 2': { name: 'Dota 2', color: '#e74c3c', icon: '🛡️' },
    'dota2': { name: 'Dota 2', color: '#e74c3c', icon: '🛡️' },
    'pubg': { name: 'PUBG', color: '#f39c12', icon: '🎮' },
    'fortnite': { name: 'Fortnite', color: '#8e44ad', icon: '🏹' },
    'overwatch': { name: 'Overwatch', color: '#f1c40f', icon: '⚡' },
    'overwatch 2': { name: 'Overwatch 2', color: '#f1c40f', icon: '⚡' },
    'apex legends': { name: 'Apex Legends', color: '#e74c3c', icon: '🚀' },
    'apex': { name: 'Apex Legends', color: '#e74c3c', icon: '🚀' },
    'rainbow six siege': { name: 'Rainbow Six Siege', color: '#2c3e50', icon: '🔍' },
    'r6': { name: 'Rainbow Six Siege', color: '#2c3e50', icon: '🔍' },
    'rocket league': { name: 'Rocket League', color: '#3498db', icon: '🚗' },
  };

  if (!gameName) {
    return { name: 'Không xác định', color: '#95a5a6', icon: '🎮' };
  }

  const lowerCaseGame = gameName.toLowerCase();
  return gameMap[lowerCaseGame] || { 
    name: gameName, 
    color: '#95a5a6', 
    icon: '🎮' 
  };
};

export default {
  formatDate,
  formatRelativeTime,
  formatDateRange,
  formatCurrency,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatDuration,
  formatFileSize,
  truncateText,
  formatPhoneNumber,
  formatTournamentStatus,
  formatGameInfo,
};
import { io, Socket } from 'socket.io-client';

class NotificationSocket {
  private socket: Socket | null = null;
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  connect() {
    if (this.socket?.connected) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

    this.socket = io(`${wsUrl}/notifications`, {
      auth: { token: this.token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to notification socket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification socket');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  ackImportantNotification(notificationId: string) {
    this.socket?.emit('ack-important-notification', { notificationId });
  }

  markAsRead(notificationId: string) {
    this.socket?.emit('mark-as-read', { notificationId });
  }
}

export default NotificationSocket;
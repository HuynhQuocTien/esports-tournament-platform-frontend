import { io, Socket } from 'socket.io-client';

class NotificationService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string, userId: string) {
    if (this.socket?.connected) return;

    this.socket = io(`${process.env.REACT_APP_API_URL}/notifications`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to notifications');
      this.socket?.emit('subscribe', { userId });
    });

    this.socket.on('new-notification', (notification) => {
      this.emit('new-notification', notification);
    });

    this.socket.on('notification-read', (notificationId) => {
      this.emit('notification-read', notificationId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notifications');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  markAsRead(notificationId: string) {
    this.socket?.emit('mark-as-read', { notificationId });
  }
}

export default new NotificationService();
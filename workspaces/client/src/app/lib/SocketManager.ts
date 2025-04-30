import { ClientSocketEvents } from '../../../../shared/types/ClientSocketEvents';
import { io, Socket } from 'socket.io-client';

export class SocketManager {
  private socket: Socket | null = null;

  constructor() {}

  connect(token: string, url: string) {
    if (this.socket) return;

    this.socket = io(url, {
      auth: { token },
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {});

    this.socket.on('disconnect', () => {
      this.socket = null;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emitEvent = <T extends keyof ClientSocketEvents>(
    event: T,
    data: ClientSocketEvents[T],
  ): void => {
    console.log('test emit');
    if (!this.socket) return;

    this.socket.emit(event, data);
  };

  get instance(): Socket | null {
    return this.socket;
  }
}

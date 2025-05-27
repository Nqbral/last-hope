import { ClientSocketEvents } from '@last-hope/shared/types/ClientSocketEvents';
import { AUTH_EVENTS } from '@last-hope/shared/consts/AuthEvents';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { io, Socket } from 'socket.io-client';

interface SocketAuth {
  token: string;
}

export type Listener<T> = (data: T) => void;

export class SocketManager {
  private socket: Socket | null = null;
  private token: string | null = null;

  public isInit: boolean = false;

  constructor() {}

  connect(token: string) {
    this.socket = io(process.env.NEXT_PUBLIC_WS_API_SOCKET_URL as string, {
      auth: { token },
      transports: ['websocket'],
      withCredentials: true,
    });

    this.token = token;
    this.isInit = true;

    this.socket.on('connect', () => {
      this.isInit = true;
    });

    this.socket.on('disconnect', () => {
      this.isInit = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isInit = false;
    }
  }

  updateToken(newToken: string) {
    this.token = newToken;

    if (this.socket) {
      if (this.socket.connected) {
        this.socket.emit(AUTH_EVENTS.UPDATE_TOKEN, { token: newToken });
        return;
      }

      (this.socket.auth as SocketAuth).token = newToken;
    }
  }

  emitEvent = <T extends keyof ClientSocketEvents>(
    event: T,
    data: ClientSocketEvents[T],
  ): void => {
    if (!this.socket) return;

    this.socket.emit(event, data);
  };

  get instance(): Socket | null {
    return this.socket;
  }

  addListener<T>(event: ServerEvents, listener: Listener<T>): this {
    if (this.socket) this.socket.on(event, listener);

    return this;
  }

  removeListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket?.off(event, listener);

    return this;
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

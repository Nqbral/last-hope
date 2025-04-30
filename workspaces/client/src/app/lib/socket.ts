import { io, Socket } from 'socket.io-client';
import { ClientSocketEvents } from '@shared/client/ClientEvent';

let socket: Socket | null = null;

export const initSocket = (accessToken: string): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_API_SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket'],
      withCredentials: true,
    });
  }

  return socket;
};

export const emitEvent = <T extends keyof ClientSocketEvents>(
  event: T,
  data: ClientSocketEvents[T],
) => {
  const socketInstance = getSocket();

  socketInstance.emit(event, data);
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

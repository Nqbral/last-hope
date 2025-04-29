import { io, Socket } from 'socket.io-client';

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

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

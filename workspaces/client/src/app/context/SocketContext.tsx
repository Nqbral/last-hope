'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('playerToken');

    const newSocket = io(process.env.NEXT_PUBLIC_WS_API_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Socket connecté:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('⚡️ Socket déconnecté');
      setIsConnected(false);
    });

    newSocket.on('assign_token', (data) => {
      if (data.token) {
        console.log('🎟️ Nouveau token reçu du serveur', data.token);
        localStorage.setItem('clientToken', data.token);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

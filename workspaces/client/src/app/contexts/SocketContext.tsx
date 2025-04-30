import { useAuth } from '@contexts/AuthContext';
import { SocketManager } from '@lib/SocketManager';
import React, { createContext, useContext, useEffect, useRef } from 'react';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_API_SOCKET_URL as string;

const SocketContext = createContext<SocketManager | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuth();
  const socketManagerRef = useRef(new SocketManager());

  useEffect(() => {
    if (accessToken) {
      socketManagerRef.current.connect(accessToken, SOCKET_URL);
    } else {
      socketManagerRef.current.disconnect();
    }
  }, [accessToken]);

  return (
    <SocketContext.Provider value={socketManagerRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

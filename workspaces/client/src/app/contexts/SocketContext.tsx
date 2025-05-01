import { useAuth } from '@contexts/AuthContext';
import { SocketManager } from '@lib/SocketManager';
import React, { createContext, useContext, useEffect, useRef } from 'react';

const SocketContext = createContext<SocketManager | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuth();
  const socketManagerRef = useRef(new SocketManager());

  useEffect(() => {
    if (accessToken) {
      if (socketManagerRef.current.isInit) {
        socketManagerRef.current.updateToken(accessToken);
        return;
      }

      socketManagerRef.current.connect(accessToken);
      return;
    }

    socketManagerRef.current.disconnect();
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

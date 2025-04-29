'use client';

import { useAuth } from '@contexts/AuthContext';
import { disconnectSocket, initSocket } from '@lib/socket';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, isLoading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!isLoading && accessToken) {
      const newSocket = initSocket(accessToken);
      setSocket(newSocket);
    }

    return () => {
      disconnectSocket();
    };
  }, [accessToken, isLoading]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

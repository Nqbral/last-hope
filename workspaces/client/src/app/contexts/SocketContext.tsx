import { useAuth } from '@contexts/AuthContext';
import { ServerEvents } from '@last-hope/shared/enums/ServerEvents';
import { ClientSocketEvents } from '@last-hope/shared/types/ClientSocketEvents';
import { SocketManager } from '@lib/SocketManager';
import { Listener } from '@lib/SocketManager';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type SocketContextType = {
  socketManager: React.RefObject<SocketManager | null>;
  emitEvent: <T extends keyof ClientSocketEvents>(
    event: T,
    data: ClientSocketEvents[T],
  ) => void;
  addListener: <T>(event: ServerEvents, listener: Listener<T>) => void;
  removeListener: <T>(event: ServerEvents, listener: Listener<T>) => void;
  isConnectedSocket: boolean;
  userId: string | null;
  lastLobby: string | null;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketManagerRef = useRef(new SocketManager());
  const { accessToken } = useAuth();
  const [isConnectedSocket, setIsConnectedSocket] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastLobby, setLastLobby] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      if (socketManagerRef.current.isInit) {
        socketManagerRef.current.updateToken(accessToken);
        setIsConnectedSocket(true);

        return;
      }

      socketManagerRef.current.connect(accessToken);
      setIsConnectedSocket(true);
      return;
    }

    setIsConnectedSocket(false);
    socketManagerRef.current.disconnect();
  }, [accessToken, setIsConnectedSocket]);

  useEffect(() => {
    const socketManager = socketManagerRef.current;

    if (!socketManager || !isConnectedSocket) return;

    const onAuthenticated = (payload: { userId: string; lobbyId: string }) => {
      setUserId(payload.userId);
      setLastLobby(payload.lobbyId);

      console.log(payload.lobbyId);
    };

    socketManager.addListener(ServerEvents.Authenticated, onAuthenticated);

    return () => {
      socketManager.removeListener(ServerEvents.Authenticated, onAuthenticated);
    };
  }, [isConnectedSocket]);

  const emitEvent = <T extends keyof ClientSocketEvents>(
    event: T,
    data: ClientSocketEvents[T],
  ): void => {
    socketManagerRef.current?.emitEvent(event, data);
  };

  const addListener = <T,>(event: ServerEvents, listener: Listener<T>) => {
    socketManagerRef.current?.addListener(event, listener);
  };

  const removeListener = <T,>(event: ServerEvents, listener: Listener<T>) => {
    socketManagerRef.current?.removeListener(event, listener);
  };

  return (
    <SocketContext.Provider
      value={{
        socketManager: socketManagerRef,
        emitEvent,
        addListener,
        removeListener,
        isConnectedSocket,
        userId,
        lastLobby,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

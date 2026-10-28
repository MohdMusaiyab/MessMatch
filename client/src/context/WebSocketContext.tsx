"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

type WebSocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();

  const connect = () => {
    if (socket && !socket.connected) {
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    const wsUrl =
      process.env.NEXT_PUBLIC_WS_URL ||
      (process.env.NEXT_PUBLIC_BACKEND_URL
        ? process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/api\/v1\/?$/, "")
        : "http://localhost:4000");

    const token = session?.accessToken;

    const socketInstance = io(wsUrl, {
      auth: { token },
      withCredentials: true,
      transports: ["polling", "websocket"],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      upgrade: true,
      rememberUpgrade: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false);
      if (reason === "io server disconnect") {
        socketInstance.connect();
      }
    });

    socketInstance.on("reconnect", () => {
      setIsConnected(true);
    });

    socketInstance.on("reconnect_attempt", () => {});

    socketInstance.on("reconnect_error", (error) => {
      console.error("WebSocket reconnection error:", error);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("WebSocket reconnection failed");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    });

    socketInstance.on("receiveMessage", () => {});

    socketInstance.on("messageError", (error) => {
      console.error("WebSocket message error:", error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [session?.accessToken]);

  useEffect(() => {
    if (socket) {
      const checkConnection = setInterval(() => {
        if (socket.connected !== isConnected) {
          setIsConnected(socket.connected);
        }
      }, 1000);

      return () => clearInterval(checkConnection);
    }
  }, [socket, isConnected]);

  return (
    <WebSocketContext.Provider
      value={{ socket, isConnected, connect, disconnect }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

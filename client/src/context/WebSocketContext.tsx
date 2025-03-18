"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type WebSocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Debugging: Log WebSocket initialization
    console.log("Initializing WebSocket connection...");

    // Initialize the WebSocket connection
    const socketInstance = io("http://localhost:4000", {
      withCredentials: true,
    });

    // Debugging: Log connection events
    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    });

    // Debugging: Log errors
    socketInstance.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    // Debugging: Log custom events (optional)
    socketInstance.on("receiveMessage", (message) => {
      console.log("Received message via WebSocket:", message);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting WebSocket...");
      socketInstance.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
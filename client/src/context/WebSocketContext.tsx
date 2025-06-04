"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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

  // ADDED: Connect function
  const connect = () => {
    if (socket && !socket.connected) {
      socket.connect();
    }
  };

  // ADDED: Disconnect function
  const disconnect = () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    console.log("Initializing WebSocket connection...");

    // FIXED: Initialize with proper configuration
    const socketInstance = io(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}`, {
      withCredentials: true,
      transports: ["polling", "websocket"], // FIXED: Start with polling, upgrade to websocket
      autoConnect: true, // CHANGED: Auto-connect for better UX
      reconnectionAttempts: 10, // INCREASED: More reconnection attempts
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000, // ADDED: Max delay between reconnections
      timeout: 20000, // ADDED: Connection timeout
      forceNew: false, // ADDED: Reuse existing connection
      upgrade: true, // ADDED: Allow transport upgrades
      rememberUpgrade: true, // ADDED: Remember successful upgrades
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
      setIsConnected(false);
      
      // ADDED: Handle different disconnect reasons
      if (reason === "io server disconnect") {
        // Server disconnected, reconnect manually
        socketInstance.connect();
      }
    });

    // ADDED: Reconnection event handlers
    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("Reconnected to WebSocket server after", attemptNumber, "attempts");
      setIsConnected(true);
    });

    socketInstance.on("reconnect_attempt", (attemptNumber) => {
      console.log("Attempting to reconnect...", attemptNumber);
    });

    socketInstance.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("Failed to reconnect to WebSocket server");
    });

    // Connection error handler
    socketInstance.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
      
      // ADDED: Detailed error logging
      if (error.message.includes("xhr poll error")) {
        console.error("Network connectivity issue detected");
      } else if (error.message.includes("timeout")) {
        console.error("Connection timeout - server may be slow");
      }
    });

    // Message handlers
    socketInstance.on("receiveMessage", (message) => {
      console.log("Received message via WebSocket:", message);
    });

    // ADDED: Error message handler
    socketInstance.on("messageError", (error) => {
      console.error("Message error:", error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up WebSocket connection...");
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []); // Empty dependency array to run only once

  // ADDED: Connection state monitoring
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
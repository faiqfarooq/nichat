'use client';

import { createContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';

// Create context
export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only initialize socket if user is authenticated
    if (!session?.user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
      auth: {
        token: session.user.id, // Use user ID as authentication
      },
    });

    // Set up event listeners
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Save socket instance
    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [session]);

  // Custom reconnect function
  const reconnect = () => {
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
  };

  // Context value
  const value = {
    socket,
    isConnected,
    reconnect,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
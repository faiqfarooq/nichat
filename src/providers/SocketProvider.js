'use client';

import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getApiUrl } from '@/lib/apiUtils';
import { useSession } from '@/components/auth/CustomSessionProvider';

// Create context
export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only initialize socket if user is authenticated
    if (status !== 'authenticated' || !session) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    // First, make sure the Socket.IO server is running
    fetch(getApiUrl('/api/socket'))
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to start Socket.IO server');
        }
        return response.text();
      })
      .then(() => {
        console.log('Socket.IO server is running');
      })
      .catch(error => {
        console.error('Socket.IO server error:', error);
      });

    // Connect to the Socket.IO server
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
      auth: {
        token: session.user.id, // Use user ID as authentication
      },
      path: '/api/socket',
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
  }, [session, status, socket]);

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

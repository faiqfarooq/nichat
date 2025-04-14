'use client';

import { createContext, useContext } from 'react';
import { useCall } from '@/hooks/useCall';
import CallNotification from '@/components/call/CallNotification';

// Create context
const CallNotificationContext = createContext({});

/**
 * Provider component for call notifications
 * This wraps the application and provides call notification functionality
 */
export const CallNotificationProvider = ({ children }) => {
  const { CallModal, incomingCall, acceptCall, declineCall } = useCall();
  
  return (
    <CallNotificationContext.Provider value={{ incomingCall, acceptCall, declineCall }}>
      {children}
      <CallModal />
      <CallNotification 
        incomingCall={incomingCall}
        onAccept={acceptCall}
        onDecline={declineCall}
      />
    </CallNotificationContext.Provider>
  );
};

/**
 * Hook to use the call notification context
 */
export const useCallNotification = () => useContext(CallNotificationContext);

export default CallNotificationProvider;

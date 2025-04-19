'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '@/components/auth/CustomSessionProvider';

// Create context
const CallNotificationContext = createContext();

export function useCallNotification() {
  return useContext(CallNotificationContext);
}

export default function CallNotificationProvider({ children }) {
  const { data: session } = useSession();
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  
  // Function to handle incoming calls
  const handleIncomingCall = (call) => {
    setIncomingCall(call);
  };
  
  // Function to accept a call
  const acceptCall = (callId) => {
    if (incomingCall && incomingCall.id === callId) {
      setActiveCall(incomingCall);
      setIncomingCall(null);
    }
  };
  
  // Function to reject a call
  const rejectCall = (callId) => {
    if (incomingCall && incomingCall.id === callId) {
      setIncomingCall(null);
    }
  };
  
  // Function to end an active call
  const endCall = () => {
    setActiveCall(null);
  };
  
  // Function to initiate a call
  const initiateCall = (recipient) => {
    const newCall = {
      id: Date.now().toString(),
      caller: session?.user,
      recipient,
      timestamp: new Date(),
      status: 'outgoing'
    };
    
    setActiveCall(newCall);
    return newCall;
  };
  
  // Value to be provided to consumers
  const value = {
    incomingCall,
    activeCall,
    handleIncomingCall,
    acceptCall,
    rejectCall,
    endCall,
    initiateCall
  };
  
  return (
    <CallNotificationContext.Provider value={value}>
      {children}
    </CallNotificationContext.Provider>
  );
}

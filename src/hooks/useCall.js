'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSocket } from './useSocket';
import CallModal from '@/components/call/CallModal';

/**
 * Hook for managing WebRTC calls
 * @returns {Object} Call management functions and state
 */
export const useCall = () => {
  const { socket } = useSocket();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callInfo, setCallInfo] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const callTimeoutRef = useRef(null);
  const notificationSoundRef = useRef(null);
  
  // Initialize notification sound
  useEffect(() => {
    if (typeof window !== 'undefined') {
      notificationSoundRef.current = new Audio('/notification.mp3');
      notificationSoundRef.current.loop = true;
    }
    
    return () => {
      if (notificationSoundRef.current) {
        notificationSoundRef.current.pause();
        notificationSoundRef.current.currentTime = 0;
      }
    };
  }, []);
  
  // Set up socket event listeners for incoming calls
  useEffect(() => {
    if (!socket) return;
    
    // Handle incoming call
    const handleIncomingCall = (data) => {
      console.log('Incoming call:', data);
      
      // Set incoming call data
      setIncomingCall({
        callId: data.callId,
        callType: data.callType,
        offer: data.offer,
        caller: data.caller,
      });
      
      // Play notification sound
      if (notificationSoundRef.current) {
        notificationSoundRef.current.play().catch(error => {
          console.error('Error playing notification sound:', error);
        });
      }
    };
    
    // Add event listeners
    socket.on('call:incoming', handleIncomingCall);
    
    // Clean up
    return () => {
      socket.off('call:incoming', handleIncomingCall);
    };
  }, [socket]);
  
  /**
   * Start a new call
   * @param {string} recipientId - The ID of the call recipient
   * @param {string} recipientName - The name of the call recipient
   * @param {string} recipientAvatar - The avatar URL of the call recipient
   * @param {string} callType - The type of call ('audio' or 'video')
   * @returns {Promise<void>}
   */
  const startCall = useCallback(async (recipientId, recipientName, recipientAvatar, callType = 'audio') => {
    if (!socket || !recipientId) {
      throw new Error('Socket connection or recipient ID not available');
    }
    
    // Set call info
    setCallInfo({
      callerId: socket.id,
      calleeId: recipientId,
      calleeName: recipientName,
      calleeAvatar: recipientAvatar,
      callType,
      isIncoming: false,
    });
    
    // Open call modal
    setIsCallModalOpen(true);
    
    // Set up timeout for unanswered calls
    callTimeoutRef.current = setTimeout(() => {
      // If call is not answered within 30 seconds, close the modal
      setIsCallModalOpen(false);
      setCallInfo(null);
    }, 30000);
    
    // Listen for call accepted event
    const handleCallAccepted = (data) => {
      // Clear timeout
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
      }
      
      // Call is now in progress
      console.log('Call accepted by recipient');
    };
    
    // Listen for call rejected event
    const handleCallRejected = (data) => {
      // Clear timeout
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
      }
      
      // Close call modal
      setIsCallModalOpen(false);
      setCallInfo(null);
      
      console.log('Call rejected by recipient', data.reason);
    };
    
    // Add event listeners
    socket.on('call:accepted', handleCallAccepted);
    socket.on('call:rejected', handleCallRejected);
    
    // Return cleanup function
    return () => {
      // Remove event listeners
      socket.off('call:accepted', handleCallAccepted);
      socket.off('call:rejected', handleCallRejected);
      
      // Clear timeout
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
      }
    };
  }, [socket]);
  
  /**
   * Accept an incoming call
   */
  const acceptCall = useCallback(() => {
    if (!socket || !incomingCall) return;
    
    // Stop notification sound
    if (notificationSoundRef.current) {
      notificationSoundRef.current.pause();
      notificationSoundRef.current.currentTime = 0;
    }
    
    // Accept call
    socket.emit('call:accept', {
      callId: incomingCall.callId,
    });
    
    // Set call info for the modal
    setCallInfo({
      callerId: incomingCall.caller.id,
      calleeId: socket.id,
      callerName: incomingCall.caller.name,
      callerAvatar: incomingCall.caller.avatar,
      callType: incomingCall.callType,
      isIncoming: true,
      offer: incomingCall.offer,
    });
    
    // Open call modal
    setIsCallModalOpen(true);
    
    // Clear incoming call
    setIncomingCall(null);
  }, [socket, incomingCall]);
  
  /**
   * Decline an incoming call
   */
  const declineCall = useCallback(() => {
    if (!socket || !incomingCall) return;
    
    // Stop notification sound
    if (notificationSoundRef.current) {
      notificationSoundRef.current.pause();
      notificationSoundRef.current.currentTime = 0;
    }
    
    // Decline call
    socket.emit('call:reject', {
      callId: incomingCall.callId,
      reason: 'declined',
    });
    
    // Clear incoming call
    setIncomingCall(null);
  }, [socket, incomingCall]);
  
  /**
   * Handle closing the call modal
   */
  const handleCloseCallModal = useCallback(() => {
    setIsCallModalOpen(false);
    setCallInfo(null);
    
    // Clear timeout
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
  }, []);
  
  /**
   * Call modal component
   */
  const CallModalComponent = useCallback(() => {
    if (!isCallModalOpen || !callInfo) return null;
    
    return (
      <CallModal
        isOpen={isCallModalOpen}
        onClose={handleCloseCallModal}
        callType={callInfo.callType}
        callerId={callInfo.callerId}
        calleeId={callInfo.calleeId}
        isIncoming={callInfo.isIncoming}
        callerName={callInfo.isIncoming ? callInfo.callerName : callInfo.calleeName}
        callerAvatar={callInfo.isIncoming ? callInfo.callerAvatar : callInfo.calleeAvatar}
        offer={callInfo.isIncoming ? callInfo.offer : undefined}
      />
    );
  }, [isCallModalOpen, callInfo, handleCloseCallModal]);
  
  return {
    startCall,
    acceptCall,
    declineCall,
    CallModal: CallModalComponent,
    isCallActive: isCallModalOpen,
    incomingCall,
  };
};

export default useCall;

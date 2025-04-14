'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSocket } from './useSocket';
import CallModal from '@/components/call/CallModal';
import * as WebRTC from '@/lib/webrtc';

/**
 * Enhanced hook for managing WebRTC calls with improved quality and reliability
 * @returns {Object} Call management functions and state
 */
export const useCall = () => {
  const { socket } = useSocket();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callInfo, setCallInfo] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callQuality, setCallQuality] = useState({ overall: 100 });
  const [networkStatus, setNetworkStatus] = useState('stable');
  const callTimeoutRef = useRef(null);
  const notificationSoundRef = useRef(null);
  const qualityReportIntervalRef = useRef(null);
  
  // Initialize notification sound with enhanced reliability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create notification sound
      notificationSoundRef.current = new Audio('/notification.mp3');
      notificationSoundRef.current.loop = true;
      
      // Preload the sound for faster playback
      notificationSoundRef.current.preload = 'auto';
      
      // Try to load the sound in advance
      notificationSoundRef.current.load();
    }
    
    return () => {
      if (notificationSoundRef.current) {
        notificationSoundRef.current.pause();
        notificationSoundRef.current.currentTime = 0;
      }
    };
  }, []);
  
  // Set up socket event listeners for incoming calls with enhanced handling
  useEffect(() => {
    if (!socket) return;
    
    // Handle incoming call with enhanced metadata
    const handleIncomingCall = (data) => {
      console.log('Incoming call:', data);
      
      // Check if WebRTC is supported
      if (!WebRTC.isWebRTCSupported()) {
        console.error('WebRTC is not supported in this browser');
        // Notify caller that call was rejected due to lack of support
        socket.emit('call:reject', {
          callId: data.callId,
          reason: 'unsupported',
        });
        return;
      }
      
      // Set incoming call data with enhanced metadata
      setIncomingCall({
        callId: data.callId,
        callType: data.callType,
        offer: data.offer,
        caller: data.caller,
        timestamp: data.timestamp || Date.now(),
        priority: data.priority || 'normal',
      });
      
      // Play notification sound with retry mechanism
      if (notificationSoundRef.current) {
        const playWithRetry = (retries = 3) => {
          notificationSoundRef.current.play().catch(error => {
            console.error('Error playing notification sound:', error);
            if (retries > 0) {
              // Retry after a short delay (user interaction might enable audio)
              setTimeout(() => playWithRetry(retries - 1), 500);
            }
          });
        };
        
        playWithRetry();
      }
    };
    
    // Handle call quality updates from other participants
    const handleQualityUpdate = (data) => {
      if (callInfo && (data.callId === callInfo.callId)) {
        console.log('Received call quality update:', data);
        setCallQuality(prevQuality => ({
          ...prevQuality,
          remote: data.quality
        }));
      }
    };
    
    // Add event listeners
    socket.on('call:incoming', handleIncomingCall);
    socket.on('call:quality-update', handleQualityUpdate);
    
    // Clean up
    return () => {
      socket.off('call:incoming', handleIncomingCall);
      socket.off('call:quality-update', handleQualityUpdate);
    };
  }, [socket, callInfo]);
  
  /**
   * Start a new call with enhanced quality monitoring
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
    
    // Check if WebRTC is supported
    if (!WebRTC.isWebRTCSupported()) {
      throw new Error('WebRTC is not supported in this browser');
    }
    
    // Check if screen sharing is supported for video calls
    if (callType === 'video' && !WebRTC.isScreenSharingSupported()) {
      console.warn('Screen sharing is not supported in this browser');
    }
    
    // Generate a unique call ID
    const callId = `call-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Set call info with enhanced metadata
    setCallInfo({
      callId,
      callerId: socket.id,
      calleeId: recipientId,
      calleeName: recipientName,
      calleeAvatar: recipientAvatar,
      callType,
      isIncoming: false,
      startTime: Date.now(),
    });
    
    // Open call modal
    setIsCallModalOpen(true);
    
    // Set up timeout for unanswered calls
    callTimeoutRef.current = setTimeout(() => {
      // If call is not answered within 30 seconds, close the modal
      setIsCallModalOpen(false);
      setCallInfo(null);
      
      // Notify the user that the call was not answered
      console.log('Call not answered');
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
      
      // Start quality monitoring
      startQualityMonitoring(callId);
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
      
      // Stop quality monitoring
      stopQualityMonitoring();
      
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
      
      // Stop quality monitoring
      stopQualityMonitoring();
    };
  }, [socket]);
  
  /**
   * Start monitoring call quality and reporting metrics
   * @param {string} callId - The ID of the call
   */
  const startQualityMonitoring = useCallback((callId) => {
    // Clear any existing interval
    if (qualityReportIntervalRef.current) {
      clearInterval(qualityReportIntervalRef.current);
    }
    
    // Set up interval to report call quality metrics
    qualityReportIntervalRef.current = setInterval(() => {
      if (!socket || !callInfo) return;
      
      // Get call quality metrics from WebRTC connection
      // This would be implemented in the CallModal component
      // and passed back via context or props
      
      // For now, we'll just report the current quality state
      socket.emit('call:quality-metrics', {
        callId,
        metrics: {
          overall: callQuality.overall,
          audio: callQuality.audio || 100,
          video: callQuality.video || 100,
          timestamp: Date.now(),
        },
      });
    }, 10000); // Report every 10 seconds
  }, [socket, callInfo, callQuality]);
  
  /**
   * Stop quality monitoring
   */
  const stopQualityMonitoring = useCallback(() => {
    if (qualityReportIntervalRef.current) {
      clearInterval(qualityReportIntervalRef.current);
      qualityReportIntervalRef.current = null;
    }
  }, []);
  
  /**
   * Accept an incoming call with enhanced handling
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
    
    // Set call info for the modal with enhanced metadata
    setCallInfo({
      callId: incomingCall.callId,
      callerId: incomingCall.caller.id,
      calleeId: socket.id,
      callerName: incomingCall.caller.name,
      callerAvatar: incomingCall.caller.avatar,
      callType: incomingCall.callType,
      isIncoming: true,
      offer: incomingCall.offer,
      startTime: Date.now(),
    });
    
    // Open call modal
    setIsCallModalOpen(true);
    
    // Start quality monitoring
    startQualityMonitoring(incomingCall.callId);
    
    // Clear incoming call
    setIncomingCall(null);
  }, [socket, incomingCall, startQualityMonitoring]);
  
  /**
   * Decline an incoming call with enhanced handling
   */
  const declineCall = useCallback(() => {
    if (!socket || !incomingCall) return;
    
    // Stop notification sound
    if (notificationSoundRef.current) {
      notificationSoundRef.current.pause();
      notificationSoundRef.current.currentTime = 0;
    }
    
    // Decline call with reason
    socket.emit('call:reject', {
      callId: incomingCall.callId,
      reason: 'declined',
      timestamp: Date.now(),
    });
    
    // Clear incoming call
    setIncomingCall(null);
  }, [socket, incomingCall]);
  
  /**
   * Handle closing the call modal with enhanced cleanup
   */
  const handleCloseCallModal = useCallback(() => {
    setIsCallModalOpen(false);
    setCallInfo(null);
    
    // Clear timeout
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
    
    // Stop quality monitoring
    stopQualityMonitoring();
    
    // Reset call quality
    setCallQuality({ overall: 100 });
    setNetworkStatus('stable');
  }, [stopQualityMonitoring]);
  
  /**
   * Call modal component with enhanced props
   */
  const CallModalComponent = useCallback(() => {
    if (!isCallModalOpen || !callInfo) return null;
    
    return (
      <CallModal
        isOpen={isCallModalOpen}
        onClose={handleCloseCallModal}
        callId={callInfo.callId}
        callType={callInfo.callType}
        callerId={callInfo.callerId}
        calleeId={callInfo.calleeId}
        isIncoming={callInfo.isIncoming}
        callerName={callInfo.isIncoming ? callInfo.callerName : callInfo.calleeName}
        callerAvatar={callInfo.isIncoming ? callInfo.callerAvatar : callInfo.calleeAvatar}
        offer={callInfo.isIncoming ? callInfo.offer : undefined}
        onQualityChange={setCallQuality}
        onNetworkStatusChange={setNetworkStatus}
        startTime={callInfo.startTime}
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

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallNotification } from "@/providers/CallNotificationProvider";
import CallModal from "./CallModal";

export default function CallNotification() {
  const { incomingCall, activeCall, acceptCall, rejectCall, endCall } = useCallNotification();
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationSound, setNotificationSound] = useState(null);
  
  // Initialize notification sound
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNotificationSound(new Audio('/notification.mp3'));
    }
    
    return () => {
      if (notificationSound) {
        notificationSound.pause();
        notificationSound.currentTime = 0;
      }
    };
  }, []);
  
  // Handle incoming call
  useEffect(() => {
    if (incomingCall) {
      setShowNotification(true);
      
      // Play notification sound
      if (notificationSound) {
        notificationSound.loop = true;
        notificationSound.play().catch(err => console.error("Error playing notification sound:", err));
      }
    } else {
      setShowNotification(false);
      
      // Stop notification sound
      if (notificationSound) {
        notificationSound.pause();
        notificationSound.currentTime = 0;
      }
    }
  }, [incomingCall, notificationSound]);
  
  // Handle active call
  useEffect(() => {
    if (activeCall) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [activeCall]);
  
  // Handle accept call
  const handleAcceptCall = () => {
    if (incomingCall) {
      acceptCall(incomingCall.id);
      setShowNotification(false);
      setShowModal(true);
    }
  };
  
  // Handle reject call
  const handleRejectCall = () => {
    if (incomingCall) {
      rejectCall(incomingCall.id);
      setShowNotification(false);
    }
  };
  
  // Handle close modal
  const handleCloseModal = () => {
    if (activeCall) {
      endCall();
    }
    setShowModal(false);
  };
  
  return (
    <>
      {/* Incoming call notification */}
      <AnimatePresence>
        {showNotification && incomingCall && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 right-4 z-50 w-80 bg-dark-lighter rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4 overflow-hidden">
                {incomingCall.caller?.avatar ? (
                  <img
                    src={incomingCall.caller.avatar}
                    alt={incomingCall.caller.name || "Caller"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-xl text-primary font-bold">
                    {(incomingCall.caller?.name || "User").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">
                  {incomingCall.caller?.name || "Someone"} is calling...
                </h3>
                <p className="text-gray-400 text-sm">
                  {incomingCall.type === "video" ? "Video call" : "Audio call"}
                </p>
              </div>
            </div>
            
            <div className="flex border-t border-gray-800">
              <button
                onClick={handleRejectCall}
                className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptCall}
                className="flex-1 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 transition-colors"
              >
                Accept
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Call modal */}
      {(showModal || activeCall) && (
        <CallModal
          isOpen={showModal}
          onClose={handleCloseModal}
          callType={activeCall?.type || "audio"}
          callerId={activeCall?.caller?.id}
          calleeId={activeCall?.recipient?.id}
          isIncoming={activeCall?.status === "incoming"}
          callerName={
            activeCall?.status === "incoming"
              ? activeCall?.caller?.name
              : activeCall?.recipient?.name
          }
          callerAvatar={
            activeCall?.status === "incoming"
              ? activeCall?.caller?.avatar
              : activeCall?.recipient?.avatar
          }
          offer={activeCall?.offer}
        />
      )}
    </>
  );
}

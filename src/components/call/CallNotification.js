'use client';

import { motion, AnimatePresence } from 'framer-motion';

/**
 * Component for displaying incoming call notifications
 */
const CallNotification = ({ incomingCall, onAccept, onDecline }) => {
  
  return (
    <AnimatePresence>
      {incomingCall && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          className="fixed top-4 right-4 z-50 w-80 bg-dark-lighter rounded-lg shadow-xl overflow-hidden border border-gray-700"
        >
          <div className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3 overflow-hidden">
                {incomingCall.caller.avatar ? (
                  <img 
                    src={incomingCall.caller.avatar} 
                    alt={incomingCall.caller.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-xl text-primary font-bold">
                    {incomingCall.caller.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">
                  {incomingCall.caller.name}
                </h3>
                <div className="flex items-center text-gray-400 text-sm">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  <span>Incoming {incomingCall.callType} call</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <button
                onClick={onDecline}
                className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg mr-2 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded-lg transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CallNotification;

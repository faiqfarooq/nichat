"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/hooks/useSocket";
import { v4 as uuidv4 } from "uuid";

const CallModal = ({
  isOpen,
  onClose,
  callType = 'audio',
  callerId,
  calleeId,
  isIncoming = false,
  callerName,
  callerAvatar,
  offer,
}) => {
  const { socket } = useSocket();
  const [callStatus, setCallStatus] = useState(
    isIncoming ? "incoming" : "connecting"
  );
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === "audio");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionState, setConnectionState] = useState("new");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callTimerRef = useRef(null);
  const callIdRef = useRef(isIncoming ? null : uuidv4());

  // Configuration for WebRTC
  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      {
        urls: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
    ],
    iceCandidatePoolSize: 10,
  };

  // Format call duration
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Initialize WebRTC
  const initializeWebRTC = async () => {
    try {
      // Create peer connection
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Get local media stream
      const constraints = {
        audio: true,
        video: callType === "video" ? { width: 1280, height: 720 } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to peer connection
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // Set up remote stream
      const remoteStream = new MediaStream();
      setRemoteStream(remoteStream);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }

      // Listen for remote tracks
      peerConnectionRef.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("call:ice-candidate", {
            callId: callIdRef.current,
            candidate: event.candidate,
          });
        }
      };

      // Handle connection state changes
      peerConnectionRef.current.onconnectionstatechange = () => {
        setConnectionState(peerConnectionRef.current.connectionState);

        if (peerConnectionRef.current.connectionState === "connected") {
          setCallStatus("connected");
          startCallTimer();
        } else if (peerConnectionRef.current.connectionState === "failed") {
          // Try ICE restart
          handleIceRestart();
        } else if (
          peerConnectionRef.current.connectionState === "disconnected"
        ) {
          setCallStatus("reconnecting");
        }
      };

      // If outgoing call, create and send offer
      if (!isIncoming) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);

        socket.emit("call:offer", {
          callId: callIdRef.current,
          recipientId: calleeId,
          callType,
          offer: peerConnectionRef.current.localDescription,
        });

        setCallStatus("calling");
      }
    } catch (error) {
      console.error("Error initializing WebRTC:", error);
      setCallStatus("error");
    }
  };

  // Handle incoming call
  const handleIncomingCall = async (offer) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit("call:answer", {
        callId: callIdRef.current,
        answer: peerConnectionRef.current.localDescription,
      });

      setCallStatus("connecting");
    } catch (error) {
      console.error("Error handling incoming call:", error);
      setCallStatus("error");
    }
  };

  // Handle ICE restart
  const handleIceRestart = async () => {
    try {
      if (
        peerConnectionRef.current &&
        peerConnectionRef.current.connectionState === "failed"
      ) {
        // Notify the other peer about ICE restart
        socket.emit("call:ice-restart", {
          callId: callIdRef.current,
        });

        // Create a new offer with ICE restart
        const offer = await peerConnectionRef.current.createOffer({
          iceRestart: true,
        });

        await peerConnectionRef.current.setLocalDescription(offer);

        // Send the new offer
        socket.emit("call:offer", {
          callId: callIdRef.current,
          recipientId: isIncoming ? callerId : calleeId,
          callType,
          offer: peerConnectionRef.current.localDescription,
          isIceRestart: true,
        });

        setCallStatus("reconnecting");
      }
    } catch (error) {
      console.error("Error during ICE restart:", error);
    }
  };

  // Start call timer
  const startCallTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }

    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  // Accept incoming call
  const handleAcceptCall = async () => {
    try {
      await initializeWebRTC();

      // Notify caller that call was accepted
      socket.emit("call:accept", {
        callId: callIdRef.current,
      });
      
      // Process the offer if available
      if (offer && peerConnectionRef.current) {
        await handleIncomingCall(offer);
      }

      setCallStatus("connecting");
    } catch (error) {
      console.error("Error accepting call:", error);
      setCallStatus("error");
    }
  };

  // Decline incoming call
  const handleDeclineCall = () => {
    socket.emit("call:reject", {
      callId: callIdRef.current,
      reason: "declined",
    });

    cleanupCall();
    onClose();
  };

  // End active call
  const handleEndCall = () => {
    socket.emit("call:end", {
      callId: callIdRef.current,
    });

    cleanupCall();
    onClose();
  };

  // Toggle audio mute
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream && callType === "video") {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  // Toggle screen sharing
  const toggleScreenSharing = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing and revert to camera
        const constraints = {
          audio: true,
          video: callType === "video" ? { width: 1280, height: 720 } : false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Replace tracks in peer connection
        const senders = peerConnectionRef.current.getSenders();

        stream.getTracks().forEach((track, index) => {
          if (senders[index]) {
            senders[index].replaceTrack(track);
          }
        });

        // Update local stream
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        // Replace video track in peer connection
        const senders = peerConnectionRef.current.getSenders();
        const videoSender = senders.find(
          (sender) => sender.track && sender.track.kind === "video"
        );

        if (videoSender && screenStream.getVideoTracks()[0]) {
          videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
        }

        // Keep audio from original stream
        const newStream = new MediaStream();

        // Add audio track from original stream
        if (localStream.getAudioTracks()[0]) {
          newStream.addTrack(localStream.getAudioTracks()[0]);
        }

        // Add video track from screen sharing
        if (screenStream.getVideoTracks()[0]) {
          newStream.addTrack(screenStream.getVideoTracks()[0]);

          // Listen for screen sharing end
          screenStream.getVideoTracks()[0].onended = () => {
            toggleScreenSharing();
          };
        }

        // Update local stream
        setLocalStream(newStream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
        }

        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error("Error toggling screen sharing:", error);
    }
  };

  // Clean up call resources
  const cleanupCall = () => {
    // Stop call timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    // Stop local media tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Reset state
    setCallStatus("ended");
    setRemoteStream(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(callType === "audio");
    setIsScreenSharing(false);
  };

  // Set up socket event listeners
  useEffect(() => {
    if (!socket || !isOpen) return;

    // For incoming calls
    if (isIncoming) {
      callIdRef.current = callerId;
    }

    // Handle call accepted
    const handleCallAccepted = (data) => {
      if (data.callId === callIdRef.current) {
        setCallStatus("connecting");
      }
    };

    // Handle call rejected
    const handleCallRejected = (data) => {
      if (data.callId === callIdRef.current) {
        setCallStatus("rejected");
        setTimeout(() => {
          cleanupCall();
          onClose();
        }, 2000);
      }
    };

    // Handle call answer (WebRTC answer)
    const handleCallAnswer = async (data) => {
      if (data.callId === callIdRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        } catch (error) {
          console.error("Error setting remote description:", error);
        }
      }
    };

    // Handle ICE candidates
    const handleIceCandidate = async (data) => {
      if (data.callId === callIdRef.current && data.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    };

    // Handle ICE restart request
    const handleIceRestart = async (data) => {
      if (data.callId === callIdRef.current) {
        try {
          const offer = await peerConnectionRef.current.createOffer({
            iceRestart: true,
          });

          await peerConnectionRef.current.setLocalDescription(offer);

          socket.emit("call:offer", {
            callId: callIdRef.current,
            recipientId: isIncoming ? callerId : calleeId,
            callType,
            offer: peerConnectionRef.current.localDescription,
            isIceRestart: true,
          });
        } catch (error) {
          console.error("Error handling ICE restart:", error);
        }
      }
    };

    // Handle call end
    const handleCallEnd = (data) => {
      if (data.callId === callIdRef.current) {
        setCallStatus("ended");
        setTimeout(() => {
          cleanupCall();
          onClose();
        }, 1000);
      }
    };

    // Handle incoming offer (for ICE restart)
    const handleIncomingOffer = async (data) => {
      if (data.callId === callIdRef.current && data.isIceRestart) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );

          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);

          socket.emit("call:answer", {
            callId: callIdRef.current,
            answer: peerConnectionRef.current.localDescription,
          });
        } catch (error) {
          console.error(
            "Error handling incoming offer for ICE restart:",
            error
          );
        }
      }
    };

    // Add event listeners
    socket.on("call:accepted", handleCallAccepted);
    socket.on("call:rejected", handleCallRejected);
    socket.on("call:answer", handleCallAnswer);
    socket.on("call:ice-candidate", handleIceCandidate);
    socket.on("call:ice-restart", handleIceRestart);
    socket.on("call:end", handleCallEnd);
    socket.on("call:offer", handleIncomingOffer);

    // Initialize WebRTC for outgoing calls
    if (!isIncoming) {
      initializeWebRTC();
    }

    // Clean up
    return () => {
      socket.off("call:accepted", handleCallAccepted);
      socket.off("call:rejected", handleCallRejected);
      socket.off("call:answer", handleCallAnswer);
      socket.off("call:ice-candidate", handleIceCandidate);
      socket.off("call:ice-restart", handleIceRestart);
      socket.off("call:end", handleCallEnd);
      socket.off("call:offer", handleIncomingOffer);
    };
  }, [socket, isOpen, isIncoming, callerId, calleeId, callType]);

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen && callStatus !== "new") {
      cleanupCall();
    }

    return () => {
      if (callStatus !== "new") {
        cleanupCall();
      }
    };
  }, [isOpen]);

  // Handle incoming call offer
  useEffect(() => {
    if (isIncoming && isOpen && callStatus === "incoming" && offer) {
      // Store the offer to be processed when the call is accepted
      console.log("Received incoming call offer:", offer);
    }
  }, [isIncoming, isOpen, callStatus, offer]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-dark-lighter rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Call status bar */}
          <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-gradient-to-b from-black to-transparent flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  callStatus === "connected"
                    ? "bg-green-500"
                    : callStatus === "reconnecting"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-white font-medium">
                {callStatus === "incoming" && "Incoming call..."}
                {callStatus === "calling" && "Calling..."}
                {callStatus === "connecting" && "Connecting..."}
                {callStatus === "connected" && formatDuration(callDuration)}
                {callStatus === "reconnecting" && "Reconnecting..."}
                {callStatus === "rejected" && "Call rejected"}
                {callStatus === "ended" && "Call ended"}
                {callStatus === "error" && "Call failed"}
              </span>
            </div>

            {/* Connection quality indicator */}
            {callStatus === "connected" && (
              <div className="flex space-x-1">
                <div
                  className={`h-3 w-1 rounded-sm ${
                    connectionState === "connected"
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`h-4 w-1 rounded-sm ${
                    connectionState === "connected"
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`h-5 w-1 rounded-sm ${
                    connectionState === "connected"
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                ></div>
              </div>
            )}
          </div>

          {/* Video container */}
          <div className="relative w-full h-[600px] bg-dark">
            {/* Remote video (full size) */}
            {callType === "video" && (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${
                  callStatus !== "connected" ? "hidden" : ""
                }`}
              />
            )}

            {/* Audio-only call UI */}
            {(callType === "audio" || callStatus !== "connected") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-4 overflow-hidden">
                  {callerAvatar ? (
                    <img
                      src={callerAvatar}
                      alt={callerName || "Caller"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl text-primary font-bold">
                      {(callerName || "User").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-white text-2xl font-semibold mb-2">
                  {callerName || "User"}
                </h3>
                <p className="text-gray-400">
                  {callStatus === "incoming" && "is calling you..."}
                  {callStatus === "calling" && "ringing..."}
                  {callStatus === "connecting" && "connecting..."}
                  {callStatus === "connected" && formatDuration(callDuration)}
                  {callStatus === "reconnecting" && "reconnecting..."}
                  {callStatus === "rejected" && "call rejected"}
                  {callStatus === "ended" && "call ended"}
                  {callStatus === "error" && "call failed"}
                </p>

                {/* Audio visualizer (fake) */}
                {callStatus === "connected" && callType === "audio" && (
                  <div className="flex items-center space-x-1 mt-6">
                    <div className="w-1 h-3 bg-primary rounded-full animate-sound-wave"></div>
                    <div className="w-1 h-5 bg-primary rounded-full animate-sound-wave animation-delay-100"></div>
                    <div className="w-1 h-8 bg-primary rounded-full animate-sound-wave animation-delay-200"></div>
                    <div className="w-1 h-4 bg-primary rounded-full animate-sound-wave animation-delay-300"></div>
                    <div className="w-1 h-6 bg-primary rounded-full animate-sound-wave animation-delay-400"></div>
                  </div>
                )}
              </div>
            )}

            {/* Local video (picture-in-picture) */}
            {callType === "video" && (
              <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-dark shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Video off indicator */}
                {isVideoOff && (
                  <div className="absolute inset-0 bg-dark-lighter flex items-center justify-center">
                    <div className="text-white text-sm">Camera off</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Call controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            {/* Incoming call controls */}
            {callStatus === "incoming" && (
              <div className="flex justify-center space-x-8">
                <button
                  onClick={handleDeclineCall}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 3l18 18M10.5 10.677a11.186 11.186 0 0 0 2.823 2.823M5.5 5.677a11.186 11.186 0 0 0 2.823 2.823M16.5 16.677a11.186 11.186 0 0 0 2.823 2.823M21.5 21.677a11.186 11.186 0 0 0 2.823 2.823"></path>
                  </svg>
                </button>
                <button
                  onClick={handleAcceptCall}
                  className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-lg transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </button>
              </div>
            )}

            {/* Active call controls */}
            {callStatus !== "incoming" && (
              <div className="flex justify-center space-x-4">
                {/* Mute button */}
                <button
                  onClick={toggleAudio}
                  className={`w-12 h-12 rounded-full ${
                    isMuted
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  } flex items-center justify-center text-white transition-colors`}
                  disabled={callStatus !== "connected"}
                >
                  {isMuted ? (
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 1l22 22M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  )}
                </button>

                {/* Video toggle button (only for video calls) */}
                {callType === "video" && (
                  <button
                    onClick={toggleVideo}
                    className={`w-12 h-12 rounded-full ${
                      isVideoOff
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    } flex items-center justify-center text-white transition-colors`}
                    disabled={callStatus !== "connected"}
                  >
                    {isVideoOff ? (
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect
                          x="1"
                          y="5"
                          width="15"
                          height="14"
                          rx="2"
                          ry="2"
                        ></rect>
                      </svg>
                    )}
                  </button>
                )}

                {/* Screen sharing button (only for video calls) */}
                {callType === "video" && (
                  <button
                    onClick={toggleScreenSharing}
                    className={`w-12 h-12 rounded-full ${
                      isScreenSharing
                        ? "bg-purple-500 hover:bg-purple-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    } flex items-center justify-center text-white transition-colors`}
                    disabled={callStatus !== "connected"}
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="2"
                        y="3"
                        width="20"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </button>
                )}

                {/* End call button */}
                <button
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CallModal;

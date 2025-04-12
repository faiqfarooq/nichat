'use client';

/**
 * WebRTC utility functions for handling voice and video calls
 */

/**
 * Default configuration for RTCPeerConnection
 * Includes STUN and TURN servers for NAT traversal
 */
export const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    }
  ],
  iceCandidatePoolSize: 10,
};

/**
 * Create a new RTCPeerConnection with the provided configuration
 * @param {RTCConfiguration} config - Configuration for the RTCPeerConnection
 * @returns {RTCPeerConnection} - The created RTCPeerConnection
 */
export const createPeerConnection = (config = rtcConfig) => {
  try {
    const pc = new RTCPeerConnection(config);
    console.log('Created RTCPeerConnection');
    return pc;
  } catch (error) {
    console.error('Error creating RTCPeerConnection:', error);
    throw new Error('Failed to create peer connection');
  }
};

/**
 * Get user media (audio and/or video)
 * @param {boolean} audio - Whether to include audio
 * @param {boolean|MediaTrackConstraints} video - Whether to include video, or video constraints
 * @returns {Promise<MediaStream>} - The media stream
 */
export const getUserMedia = async (audio = true, video = false) => {
  try {
    const constraints = {
      audio,
      video,
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('Got user media stream:', stream);
    return stream;
  } catch (error) {
    console.error('Error getting user media:', error);
    throw new Error('Failed to access media devices');
  }
};

/**
 * Get display media for screen sharing
 * @param {boolean} audio - Whether to include audio
 * @returns {Promise<MediaStream>} - The screen sharing stream
 */
export const getDisplayMedia = async (audio = true) => {
  try {
    const constraints = {
      video: {
        cursor: 'always',
        displaySurface: 'monitor',
      },
      audio,
    };
    
    const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    console.log('Got display media stream:', stream);
    return stream;
  } catch (error) {
    console.error('Error getting display media:', error);
    throw new Error('Failed to access screen sharing');
  }
};

/**
 * Add tracks from a media stream to a peer connection
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {MediaStream} stream - The media stream
 * @returns {RTCRtpSender[]} - The added senders
 */
export const addTracksToConnection = (peerConnection, stream) => {
  if (!peerConnection || !stream) return [];
  
  const senders = [];
  stream.getTracks().forEach(track => {
    const sender = peerConnection.addTrack(track, stream);
    senders.push(sender);
  });
  
  return senders;
};

/**
 * Replace a track in an RTCRtpSender
 * @param {RTCRtpSender} sender - The RTCRtpSender
 * @param {MediaStreamTrack} track - The new track
 * @returns {Promise<void>}
 */
export const replaceTrack = async (sender, track) => {
  if (!sender) return;
  
  try {
    await sender.replaceTrack(track);
    console.log('Track replaced successfully');
  } catch (error) {
    console.error('Error replacing track:', error);
    throw new Error('Failed to replace track');
  }
};

/**
 * Create an offer
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {boolean} iceRestart - Whether to restart ICE
 * @returns {Promise<RTCSessionDescriptionInit>} - The created offer
 */
export const createOffer = async (peerConnection, iceRestart = false) => {
  if (!peerConnection) throw new Error('Peer connection is required');
  
  try {
    const offer = await peerConnection.createOffer({ iceRestart });
    await peerConnection.setLocalDescription(offer);
    console.log('Created offer:', offer);
    return offer;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw new Error('Failed to create offer');
  }
};

/**
 * Create an answer
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @returns {Promise<RTCSessionDescriptionInit>} - The created answer
 */
export const createAnswer = async (peerConnection) => {
  if (!peerConnection) throw new Error('Peer connection is required');
  
  try {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    console.log('Created answer:', answer);
    return answer;
  } catch (error) {
    console.error('Error creating answer:', error);
    throw new Error('Failed to create answer');
  }
};

/**
 * Set remote description
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {RTCSessionDescriptionInit} description - The remote description
 * @returns {Promise<void>}
 */
export const setRemoteDescription = async (peerConnection, description) => {
  if (!peerConnection) throw new Error('Peer connection is required');
  
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(description));
    console.log('Set remote description');
  } catch (error) {
    console.error('Error setting remote description:', error);
    throw new Error('Failed to set remote description');
  }
};

/**
 * Add ICE candidate
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {RTCIceCandidateInit} candidate - The ICE candidate
 * @returns {Promise<void>}
 */
export const addIceCandidate = async (peerConnection, candidate) => {
  if (!peerConnection) throw new Error('Peer connection is required');
  
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    console.log('Added ICE candidate');
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
    throw new Error('Failed to add ICE candidate');
  }
};

/**
 * Toggle audio track enabled state
 * @param {MediaStream} stream - The media stream
 * @returns {boolean} - The new enabled state
 */
export const toggleAudio = (stream) => {
  if (!stream) return false;
  
  const audioTrack = stream.getAudioTracks()[0];
  if (!audioTrack) return false;
  
  audioTrack.enabled = !audioTrack.enabled;
  return audioTrack.enabled;
};

/**
 * Toggle video track enabled state
 * @param {MediaStream} stream - The media stream
 * @returns {boolean} - The new enabled state
 */
export const toggleVideo = (stream) => {
  if (!stream) return false;
  
  const videoTrack = stream.getVideoTracks()[0];
  if (!videoTrack) return false;
  
  videoTrack.enabled = !videoTrack.enabled;
  return videoTrack.enabled;
};

/**
 * Stop all tracks in a media stream
 * @param {MediaStream} stream - The media stream
 */
export const stopMediaStream = (stream) => {
  if (!stream) return;
  
  stream.getTracks().forEach(track => {
    track.stop();
  });
  
  console.log('Media stream stopped');
};

/**
 * Check if the browser supports WebRTC
 * @returns {boolean} - Whether WebRTC is supported
 */
export const isWebRTCSupported = () => {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.RTCPeerConnection
  );
};

/**
 * Check if the browser supports screen sharing
 * @returns {boolean} - Whether screen sharing is supported
 */
export const isScreenSharingSupported = () => {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getDisplayMedia
  );
};

/**
 * Format call duration in MM:SS format
 * @param {number} seconds - The duration in seconds
 * @returns {string} - The formatted duration
 */
export const formatCallDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Get connection state description
 * @param {RTCPeerConnectionState} state - The connection state
 * @returns {string} - The state description
 */
export const getConnectionStateDescription = (state) => {
  switch (state) {
    case 'new':
      return 'Initializing...';
    case 'connecting':
      return 'Connecting...';
    case 'connected':
      return 'Connected';
    case 'disconnected':
      return 'Disconnected';
    case 'failed':
      return 'Connection failed';
    case 'closed':
      return 'Connection closed';
    default:
      return 'Unknown state';
  }
};

/**
 * Get ICE connection state description
 * @param {RTCIceConnectionState} state - The ICE connection state
 * @returns {string} - The state description
 */
export const getIceConnectionStateDescription = (state) => {
  switch (state) {
    case 'new':
      return 'Waiting for connection...';
    case 'checking':
      return 'Connecting...';
    case 'connected':
    case 'completed':
      return 'Connected';
    case 'disconnected':
      return 'Disconnected';
    case 'failed':
      return 'Connection failed';
    case 'closed':
      return 'Connection closed';
    default:
      return 'Unknown state';
  }
};

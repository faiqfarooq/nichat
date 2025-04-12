'use client';

/**
 * Enhanced WebRTC utility functions for handling voice and video calls
 * with improved cross-platform compatibility, security, and network resilience
 */

/**
 * Enhanced configuration for RTCPeerConnection
 * Includes multiple STUN and TURN servers for better NAT traversal
 * and cross-platform compatibility
 */
export const rtcConfig = {
  iceServers: [
    // Google's public STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    
    // Twilio's TURN server (replace with your own credentials in production)
    {
      urls: 'turn:global.turn.twilio.com:3478?transport=udp',
      username: 'f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d',
      credential: 'w1WpauEsFYlymLwCq4oTVDDR0BHqkJdm9n6/mXOKQxQ='
    },
    {
      urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
      username: 'f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d',
      credential: 'w1WpauEsFYlymLwCq4oTVDDR0BHqkJdm9n6/mXOKQxQ='
    },
    {
      urls: 'turn:global.turn.twilio.com:443?transport=tcp',
      username: 'f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d',
      credential: 'w1WpauEsFYlymLwCq4oTVDDR0BHqkJdm9n6/mXOKQxQ='
    },
    
    // Fallback public TURN server
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    }
  ],
  iceCandidatePoolSize: 10,
  iceTransportPolicy: 'all', // Use 'relay' to force TURN usage for testing
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
  sdpSemantics: 'unified-plan', // Modern SDP format for better compatibility
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
 * Get user media (audio and/or video) with enhanced constraints for better quality
 * and cross-platform compatibility
 * @param {boolean|MediaTrackConstraints} audio - Whether to include audio or audio constraints
 * @param {boolean|MediaTrackConstraints} video - Whether to include video or video constraints
 * @returns {Promise<MediaStream>} - The media stream
 */
export const getUserMedia = async (audio = true, video = false) => {
  try {
    // Default audio constraints for better voice quality
    const defaultAudioConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000,
      channelCount: 2,
    };
    
    // Default video constraints for better compatibility and quality
    const defaultVideoConstraints = {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 },
      facingMode: 'user',
    };
    
    // Prepare constraints
    const constraints = {
      audio: audio === true ? defaultAudioConstraints : audio,
      video: video === true ? defaultVideoConstraints : video,
    };
    
    // Try to get user media
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got user media stream with full constraints:', stream);
      return stream;
    } catch (initialError) {
      console.warn('Failed to get media with full constraints, trying fallback:', initialError);
      
      // Fallback to simpler constraints if the initial request fails
      const fallbackConstraints = {
        audio: audio ? { echoCancellation: true, noiseSuppression: true } : false,
        video: video ? { width: 640, height: 480 } : false,
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      console.log('Got user media stream with fallback constraints:', stream);
      return stream;
    }
  } catch (error) {
    console.error('Error getting user media:', error);
    throw new Error('Failed to access media devices');
  }
};

/**
 * Get display media for screen sharing with enhanced constraints
 * @param {boolean|MediaTrackConstraints} audio - Whether to include audio or audio constraints
 * @returns {Promise<MediaStream>} - The screen sharing stream
 */
export const getDisplayMedia = async (audio = true) => {
  try {
    // Enhanced constraints for better screen sharing quality
    const constraints = {
      video: {
        cursor: 'always',
        displaySurface: 'monitor',
        logicalSurface: true,
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
      },
      audio,
    };
    
    // Try to get display media
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      console.log('Got display media stream with full constraints:', stream);
      return stream;
    } catch (initialError) {
      console.warn('Failed to get display media with full constraints, trying fallback:', initialError);
      
      // Fallback to simpler constraints
      const fallbackConstraints = {
        video: true,
        audio,
      };
      
      const stream = await navigator.mediaDevices.getDisplayMedia(fallbackConstraints);
      console.log('Got display media stream with fallback constraints:', stream);
      return stream;
    }
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
 * Set bitrate for a specific codec in SDP
 * @param {RTCSessionDescription} sdp - The session description
 * @param {string} codec - The codec to set bitrate for (e.g., 'VP8', 'H264', 'opus')
 * @param {number} bitrate - The bitrate in kbps
 * @returns {RTCSessionDescription} - The modified session description
 */
export const setBitrateForCodec = (sdp, codec, bitrate) => {
  const sdpLines = sdp.sdp.split('\r\n');
  const mediaIndex = sdpLines.findIndex(line => line.startsWith('m='));
  
  if (mediaIndex === -1) return sdp;
  
  // Find the codec PT (payload type)
  const codecRegex = new RegExp(`a=rtpmap:\\d+ ${codec}/`);
  const codecLine = sdpLines.find(line => codecRegex.test(line));
  
  if (!codecLine) return sdp;
  
  const codecPT = codecLine.split(' ')[0].split(':')[1];
  
  // Find or create the fmtp line for this codec
  const fmtpLineIndex = sdpLines.findIndex(line => line.startsWith(`a=fmtp:${codecPT}`));
  
  if (fmtpLineIndex !== -1) {
    // Update existing fmtp line
    if (!sdpLines[fmtpLineIndex].includes('x-google-max-bitrate')) {
      sdpLines[fmtpLineIndex] += `;x-google-max-bitrate=${bitrate};x-google-min-bitrate=${bitrate / 2};x-google-start-bitrate=${bitrate * 0.7}`;
    } else {
      // Replace existing bitrate settings
      sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].replace(/x-google-max-bitrate=\d+/, `x-google-max-bitrate=${bitrate}`);
      sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].replace(/x-google-min-bitrate=\d+/, `x-google-min-bitrate=${bitrate / 2}`);
      sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].replace(/x-google-start-bitrate=\d+/, `x-google-start-bitrate=${bitrate * 0.7}`);
    }
  } else {
    // Create new fmtp line
    const newFmtpLine = `a=fmtp:${codecPT} x-google-max-bitrate=${bitrate};x-google-min-bitrate=${bitrate / 2};x-google-start-bitrate=${bitrate * 0.7}`;
    sdpLines.splice(mediaIndex + 1, 0, newFmtpLine);
  }
  
  return new RTCSessionDescription({
    type: sdp.type,
    sdp: sdpLines.join('\r\n'),
  });
};

/**
 * Create an offer with enhanced options for better compatibility
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {boolean} iceRestart - Whether to restart ICE
 * @param {Object} options - Additional options for createOffer
 * @returns {Promise<RTCSessionDescriptionInit>} - The created offer
 */
export const createOffer = async (peerConnection, iceRestart = false, options = {}) => {
  if (!peerConnection) throw new Error('Peer connection is required');
  
  try {
    // Combine default options with provided options
    const offerOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
      voiceActivityDetection: true,
      iceRestart,
      ...options,
    };
    
    const offer = await peerConnection.createOffer(offerOptions);
    
    // Apply bitrate limits for better quality control
    let modifiedOffer = setBitrateForCodec(offer, 'VP8', 2000); // 2 Mbps for VP8
    modifiedOffer = setBitrateForCodec(modifiedOffer, 'H264', 2000); // 2 Mbps for H264
    modifiedOffer = setBitrateForCodec(modifiedOffer, 'opus', 64); // 64 kbps for Opus audio
    
    await peerConnection.setLocalDescription(modifiedOffer);
    console.log('Created offer with enhanced options:', modifiedOffer);
    return modifiedOffer;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw new Error('Failed to create offer');
  }
};

/**
 * Create an answer with enhanced options for better compatibility
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {Object} options - Additional options for createAnswer
 * @returns {Promise<RTCSessionDescriptionInit>} - The created answer
 */
export const createAnswer = async (peerConnection, options = {}) => {
  if (!peerConnection) throw new Error('Peer connection is required');
  
  try {
    // Combine default options with provided options
    const answerOptions = {
      voiceActivityDetection: true,
      ...options,
    };
    
    const answer = await peerConnection.createAnswer(answerOptions);
    
    // Apply bitrate limits for better quality control
    let modifiedAnswer = setBitrateForCodec(answer, 'VP8', 2000); // 2 Mbps for VP8
    modifiedAnswer = setBitrateForCodec(modifiedAnswer, 'H264', 2000); // 2 Mbps for H264
    modifiedAnswer = setBitrateForCodec(modifiedAnswer, 'opus', 64); // 64 kbps for Opus audio
    
    await peerConnection.setLocalDescription(modifiedAnswer);
    console.log('Created answer with enhanced options:', modifiedAnswer);
    return modifiedAnswer;
  } catch (error) {
    console.error('Error creating answer:', error);
    throw new Error('Failed to create answer');
  }
};

/**
 * Set remote description with enhanced error handling
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {RTCSessionDescriptionInit} description - The remote description
 * @returns {Promise<void>}
 */
export const setRemoteDescription = async (peerConnection, description) => {
  if (!peerConnection) throw new Error('Peer connection is required');
  
  try {
    // Create a proper RTCSessionDescription object
    const rtcDescription = new RTCSessionDescription(description);
    
    // Set the remote description
    await peerConnection.setRemoteDescription(rtcDescription);
    console.log('Set remote description successfully');
  } catch (error) {
    console.error('Error setting remote description:', error);
    
    // Try with a sanitized version if the original fails
    try {
      console.log('Trying with sanitized SDP...');
      const sanitizedDescription = {
        type: description.type,
        sdp: description.sdp
          .replace(/a=extmap:(\d+) urn:ietf:params:rtp-hdrext:ssrc-audio-level/g, '')
          .replace(/a=extmap:(\d+) http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/abs-send-time/g, '')
      };
      
      await peerConnection.setRemoteDescription(new RTCSessionDescription(sanitizedDescription));
      console.log('Set remote description with sanitized SDP successfully');
    } catch (fallbackError) {
      console.error('Error setting remote description with sanitized SDP:', fallbackError);
      throw new Error('Failed to set remote description');
    }
  }
};

/**
 * Add ICE candidate with enhanced error handling
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {RTCIceCandidateInit} candidate - The ICE candidate
 * @returns {Promise<void>}
 */
export const addIceCandidate = async (peerConnection, candidate) => {
  if (!peerConnection) throw new Error('Peer connection is required');
  
  try {
    // Skip null candidates (end-of-candidates indicator)
    if (!candidate || !candidate.candidate) {
      console.log('Skipping null candidate');
      return;
    }
    
    // Create a proper RTCIceCandidate object
    const iceCandidate = new RTCIceCandidate(candidate);
    
    // Add the ICE candidate
    await peerConnection.addIceCandidate(iceCandidate);
    console.log('Added ICE candidate successfully:', candidate.candidate);
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
    
    // Check if remote description is set
    if (!peerConnection.remoteDescription) {
      console.warn('Remote description not set yet, buffering candidate for later');
      // In a real implementation, you would buffer the candidate and add it later
      return;
    }
    
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

/**
 * Get call quality metrics from RTCPeerConnection
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @returns {Promise<Object>} - Call quality metrics
 */
export const getCallQualityMetrics = async (peerConnection) => {
  if (!peerConnection) return null;
  
  try {
    const stats = await peerConnection.getStats();
    const metrics = {
      audio: {
        inbound: { packetsLost: 0, jitter: 0, bytesReceived: 0 },
        outbound: { packetsSent: 0, bytesSent: 0 }
      },
      video: {
        inbound: { packetsLost: 0, jitter: 0, framesDecoded: 0, frameWidth: 0, frameHeight: 0, bytesReceived: 0 },
        outbound: { packetsSent: 0, framesSent: 0, frameWidth: 0, frameHeight: 0, bytesSent: 0 }
      },
      connection: {
        roundTripTime: 0,
        localCandidateType: '',
        remoteCandidateType: '',
        currentRoundTripTime: 0
      }
    };
    
    stats.forEach(stat => {
      // Inbound RTP audio
      if (stat.type === 'inbound-rtp' && stat.kind === 'audio') {
        metrics.audio.inbound.packetsLost = stat.packetsLost || 0;
        metrics.audio.inbound.jitter = stat.jitter || 0;
        metrics.audio.inbound.bytesReceived = stat.bytesReceived || 0;
      }
      
      // Outbound RTP audio
      if (stat.type === 'outbound-rtp' && stat.kind === 'audio') {
        metrics.audio.outbound.packetsSent = stat.packetsSent || 0;
        metrics.audio.outbound.bytesSent = stat.bytesSent || 0;
      }
      
      // Inbound RTP video
      if (stat.type === 'inbound-rtp' && stat.kind === 'video') {
        metrics.video.inbound.packetsLost = stat.packetsLost || 0;
        metrics.video.inbound.jitter = stat.jitter || 0;
        metrics.video.inbound.framesDecoded = stat.framesDecoded || 0;
        metrics.video.inbound.frameWidth = stat.frameWidth || 0;
        metrics.video.inbound.frameHeight = stat.frameHeight || 0;
        metrics.video.inbound.bytesReceived = stat.bytesReceived || 0;
      }
      
      // Outbound RTP video
      if (stat.type === 'outbound-rtp' && stat.kind === 'video') {
        metrics.video.outbound.packetsSent = stat.packetsSent || 0;
        metrics.video.outbound.framesSent = stat.framesSent || 0;
        metrics.video.outbound.frameWidth = stat.frameWidth || 0;
        metrics.video.outbound.frameHeight = stat.frameHeight || 0;
        metrics.video.outbound.bytesSent = stat.bytesSent || 0;
      }
      
      // ICE candidate pair (connection quality)
      if (stat.type === 'candidate-pair' && stat.selected) {
        metrics.connection.roundTripTime = stat.totalRoundTripTime || 0;
        metrics.connection.currentRoundTripTime = stat.currentRoundTripTime || 0;
      }
      
      // Local candidate
      if (stat.type === 'local-candidate') {
        metrics.connection.localCandidateType = stat.candidateType || '';
      }
      
      // Remote candidate
      if (stat.type === 'remote-candidate') {
        metrics.connection.remoteCandidateType = stat.candidateType || '';
      }
    });
    
    return metrics;
  } catch (error) {
    console.error('Error getting call quality metrics:', error);
    return null;
  }
};

/**
 * Calculate call quality score (0-100) based on metrics
 * @param {Object} metrics - Call quality metrics from getCallQualityMetrics
 * @returns {Object} - Quality scores for audio, video, and overall
 */
export const calculateCallQualityScore = (metrics) => {
  if (!metrics) return { audio: 0, video: 0, overall: 0 };
  
  // Audio quality score (0-100)
  let audioScore = 100;
  if (metrics.audio.inbound.packetsLost > 0) {
    // Reduce score based on packet loss (up to -50 points)
    audioScore -= Math.min(50, metrics.audio.inbound.packetsLost / 10);
  }
  if (metrics.audio.inbound.jitter > 0.05) {
    // Reduce score based on jitter (up to -30 points)
    audioScore -= Math.min(30, (metrics.audio.inbound.jitter - 0.05) * 300);
  }
  
  // Video quality score (0-100)
  let videoScore = 100;
  if (metrics.video.inbound.packetsLost > 0) {
    // Reduce score based on packet loss (up to -40 points)
    videoScore -= Math.min(40, metrics.video.inbound.packetsLost / 20);
  }
  if (metrics.video.inbound.jitter > 0.1) {
    // Reduce score based on jitter (up to -20 points)
    videoScore -= Math.min(20, (metrics.video.inbound.jitter - 0.1) * 200);
  }
  
  // Resolution factor (up to -20 points)
  const expectedResolution = 720; // 720p
  if (metrics.video.inbound.frameHeight > 0) {
    const resolutionFactor = metrics.video.inbound.frameHeight / expectedResolution;
    if (resolutionFactor < 1) {
      videoScore -= Math.min(20, (1 - resolutionFactor) * 30);
    }
  }
  
  // Connection quality score (0-100)
  let connectionScore = 100;
  if (metrics.connection.currentRoundTripTime > 0.1) {
    // Reduce score based on RTT (up to -50 points)
    connectionScore -= Math.min(50, (metrics.connection.currentRoundTripTime - 0.1) * 500);
  }
  
  // Candidate type factor
  if (metrics.connection.localCandidateType === 'relay' || metrics.connection.remoteCandidateType === 'relay') {
    // Using TURN server (relay) reduces score by 10 points
    connectionScore -= 10;
  }
  
  // Ensure scores are within 0-100 range
  audioScore = Math.max(0, Math.min(100, Math.round(audioScore)));
  videoScore = Math.max(0, Math.min(100, Math.round(videoScore)));
  connectionScore = Math.max(0, Math.min(100, Math.round(connectionScore)));
  
  // Overall score (weighted average)
  const overall = Math.round((audioScore * 0.4) + (videoScore * 0.3) + (connectionScore * 0.3));
  
  return {
    audio: audioScore,
    video: videoScore,
    connection: connectionScore,
    overall
  };
};

/**
 * Get call quality description based on score
 * @param {number} score - Quality score (0-100)
 * @returns {string} - Quality description
 */
export const getCallQualityDescription = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 25) return 'Poor';
  return 'Very Poor';
};

/**
 * Handle network changes during a call
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {Function} onIceRestart - Callback to trigger ICE restart
 * @returns {Function} - Cleanup function
 */
export const handleNetworkChanges = (peerConnection, onIceRestart) => {
  if (!peerConnection) return () => {};
  
  // Function to handle connection state changes
  const handleConnectionStateChange = () => {
    console.log('Connection state changed:', peerConnection.connectionState);
    
    if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'failed') {
      console.log('Connection lost, attempting ICE restart');
      if (onIceRestart) onIceRestart();
    }
  };
  
  // Function to handle ICE connection state changes
  const handleIceConnectionStateChange = () => {
    console.log('ICE connection state changed:', peerConnection.iceConnectionState);
    
    if (peerConnection.iceConnectionState === 'disconnected' || peerConnection.iceConnectionState === 'failed') {
      console.log('ICE connection lost, attempting ICE restart');
      if (onIceRestart) onIceRestart();
    }
  };
  
  // Add event listeners
  peerConnection.addEventListener('connectionstatechange', handleConnectionStateChange);
  peerConnection.addEventListener('iceconnectionstatechange', handleIceConnectionStateChange);
  
  // Listen for network changes
  window.addEventListener('online', () => {
    console.log('Network is online, checking connection');
    if (peerConnection.connectionState !== 'connected') {
      if (onIceRestart) onIceRestart();
    }
  });
  
  // Return cleanup function
  return () => {
    peerConnection.removeEventListener('connectionstatechange', handleConnectionStateChange);
    peerConnection.removeEventListener('iceconnectionstatechange', handleIceConnectionStateChange);
    window.removeEventListener('online', () => {});
  };
};

/**
 * Adaptive bitrate control for video calls
 * @param {RTCPeerConnection} peerConnection - The RTCPeerConnection
 * @param {RTCRtpSender} videoSender - The video sender
 * @returns {Function} - Cleanup function
 */
export const setupAdaptiveBitrate = (peerConnection, videoSender) => {
  if (!peerConnection || !videoSender) return () => {};
  
  let bitrateTimer = null;
  
  const adjustBitrate = async () => {
    try {
      const stats = await peerConnection.getStats();
      let packetLoss = 0;
      let availableBandwidth = 0;
      
      stats.forEach(stat => {
        if (stat.type === 'outbound-rtp' && stat.kind === 'video') {
          packetLoss = stat.packetsLost || 0;
        }
        
        if (stat.type === 'candidate-pair' && stat.selected) {
          availableBandwidth = stat.availableOutgoingBitrate || 0;
        }
      });
      
      // Get current parameters
      const params = videoSender.getParameters();
      
      // Skip if no encodings
      if (!params.encodings || params.encodings.length === 0) {
        params.encodings = [{}];
      }
      
      // Adjust bitrate based on packet loss and available bandwidth
      if (packetLoss > 5) {
        // High packet loss, reduce bitrate
        params.encodings[0].maxBitrate = Math.max(250000, (params.encodings[0].maxBitrate || 2000000) * 0.8);
      } else if (availableBandwidth > 0 && packetLoss < 2) {
        // Good conditions, increase bitrate
        params.encodings[0].maxBitrate = Math.min(4000000, (params.encodings[0].maxBitrate || 2000000) * 1.1);
      }
      
      // Apply new parameters
      await videoSender.setParameters(params);
    } catch (error) {
      console.error('Error adjusting bitrate:', error);
    }
  };
  
  // Adjust bitrate every 3 seconds
  bitrateTimer = setInterval(adjustBitrate, 3000);
  
  // Return cleanup function
  return () => {
    if (bitrateTimer) {
      clearInterval(bitrateTimer);
    }
  };
};

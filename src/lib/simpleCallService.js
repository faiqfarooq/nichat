'use client';

/**
 * A simplified call service that simulates call functionality without WebRTC
 * This is used as a fallback when WebRTC is not working properly
 */
class SimpleCallService {
  constructor(socket) {
    this.socket = socket;
    this.callId = null;
    this.callType = null; // 'audio' or 'video'
    this.isCaller = false;
    this.isCallActive = false;
    
    // Callbacks
    this.onLocalStream = null;
    this.onRemoteStream = null;
    this.onCallEstablished = null;
    this.onCallEnded = null;
    this.onCallError = null;
    
    // Bind socket event handlers
    this.bindSocketEvents();
  }
  
  /**
   * Bind socket event handlers for signaling
   */
  bindSocketEvents() {
    if (!this.socket) return;
    
    // Handle incoming call offer
    this.socket.on('call:offer', (data) => {
      try {
        const { callId, callType, caller } = data;
        
        console.log('Received call offer:', { callId, callType, caller });
        
        // Store call information
        this.callId = callId;
        this.callType = callType;
        this.isCaller = false;
      } catch (error) {
        console.error('Error handling call offer:', error);
        if (this.onCallError) this.onCallError(error);
      }
    });
    
    // Handle call answer
    this.socket.on('call:answer', (data) => {
      try {
        const { callId } = data;
        
        // Verify this is for our call
        if (callId !== this.callId) return;
        
        console.log('Call answered:', callId);
        
        // Simulate connection established
        setTimeout(() => {
          this.isCallActive = true;
          if (this.onCallEstablished) this.onCallEstablished();
        }, 1000);
      } catch (error) {
        console.error('Error handling call answer:', error);
        if (this.onCallError) this.onCallError(error);
      }
    });
    
    // Handle call end
    this.socket.on('call:end', (data) => {
      const { callId } = data;
      
      // Verify this is for our call
      if (callId !== this.callId) return;
      
      // End the call
      this.endCall();
    });
  }
  
  /**
   * Start a call to a recipient
   * @param {string} recipientId - The ID of the call recipient
   * @param {string} callType - The type of call ('audio' or 'video')
   */
  async startCall(recipientId, callType) {
    try {
      console.log(`Starting ${callType} call to ${recipientId}`);
      
      // Set call information
      this.callId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.callType = callType;
      this.isCaller = true;
      
      console.log(`Call ID: ${this.callId}`);
      
      // Simulate getting user media
      await this.simulateGetUserMedia(callType);
      
      // Check if socket is connected
      if (!this.socket || !this.socket.connected) {
        console.error('Socket is not connected');
        throw new Error('Socket is not connected');
      }
      
      // Send offer to recipient
      console.log('Sending offer to recipient:', {
        callId: this.callId,
        recipientId,
        callType,
      });
      
      // Try multiple ways to ensure the call offer reaches the recipient
      
      // Method 1: Standard call:offer event
      this.socket.emit('call:offer', {
        callId: this.callId,
        recipientId,
        callType,
        offer: {}, // Empty object as placeholder
      });
      
      // Method 2: Direct to recipient's room
      this.socket.emit('direct:message', {
        targetUserId: recipientId,
        event: 'call:offer',
        data: {
          callId: this.callId,
          callType,
          caller: {
            id: this.socket.id,
            name: 'Caller',
            avatar: null
          },
          offer: {}
        }
      });
      
      console.log('Offer sent via multiple channels');
      
      // Simulate connection after a delay (for testing)
      if (this.isCaller) {
        setTimeout(() => {
          this.isCallActive = true;
          if (this.onCallEstablished) this.onCallEstablished();
        }, 5000);
      }
      
      return this.callId;
    } catch (error) {
      console.error('Error starting call:', error);
      if (this.onCallError) this.onCallError(error);
      throw error;
    }
  }
  
  /**
   * Answer an incoming call
   */
  async answerCall() {
    try {
      console.log('Answering call:', this.callId);
      
      // Simulate getting user media
      await this.simulateGetUserMedia(this.callType);
      
      // Send answer to caller
      this.socket.emit('call:answer', {
        callId: this.callId,
        answer: {}, // Empty object as placeholder
      });
      
      console.log('Answer sent');
      
      // Simulate connection established
      setTimeout(() => {
        this.isCallActive = true;
        if (this.onCallEstablished) this.onCallEstablished();
      }, 1000);
    } catch (error) {
      console.error('Error answering call:', error);
      if (this.onCallError) this.onCallError(error);
      throw error;
    }
  }
  
  /**
   * Simulate getting user media
   * @param {string} callType - The type of call ('audio' or 'video')
   */
  async simulateGetUserMedia(callType) {
    try {
      console.log(`Simulating getUserMedia for ${callType} call`);
      
      // Create a dummy stream
      const dummyStream = new MediaStream();
      
      // Notify about local stream
      if (this.onLocalStream) this.onLocalStream(dummyStream);
      
      // Simulate remote stream after a delay
      setTimeout(() => {
        if (this.onRemoteStream) this.onRemoteStream(dummyStream);
      }, 2000);
      
      return dummyStream;
    } catch (error) {
      console.error('Error simulating getUserMedia:', error);
      throw error;
    }
  }
  
  /**
   * End the current call
   */
  endCall() {
    console.log('Ending call:', this.callId);
    
    // Only end the call if we have a call ID
    if (!this.callId) {
      console.log('No active call to end');
      return;
    }
    
    // Notify peer that call has ended
    if (this.socket && this.socket.connected && this.callId) {
      console.log('Emitting call:end event');
      this.socket.emit('call:end', {
        callId: this.callId,
      });
    } else {
      console.log('Socket not available or not connected, cannot emit call:end');
    }
    
    // Reset call state
    this.isCallActive = false;
    
    // Store call ID before resetting
    const callId = this.callId;
    this.callId = null;
    
    // Trigger callback
    if (this.onCallEnded) {
      console.log('Triggering onCallEnded callback');
      this.onCallEnded(callId);
    }
  }
  
  /**
   * Toggle audio mute state (simulated)
   * @returns {boolean} New mute state
   */
  toggleAudio() {
    console.log('Toggle audio (simulated)');
    return true;
  }
  
  /**
   * Toggle video state (simulated)
   * @returns {boolean} New video state
   */
  toggleVideo() {
    console.log('Toggle video (simulated)');
    return true;
  }
}

export default SimpleCallService;

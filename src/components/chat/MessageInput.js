'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageInput = forwardRef(({ onSendMessage, onTyping, replyTo, onCancelReply }, ref) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recordingTimerRef = useRef(null);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));
  
  // Popular emoji sets
  const emojiSets = [
    { category: 'Smileys', emojis: ['😊', '😂', '🥰', '😍', '😒', '😭', '😎', '🥺', '😴', '🤔', '😅', '😘'] },
    { category: 'Gestures', emojis: ['👍', '👌', '👏', '🙏', '🤝', '👋', '✌️', '🤟', '🤘', '👊', '✊', '🤜'] },
    { category: 'Objects', emojis: ['🎁', '🎉', '💯', '⭐', '❤️', '🔥', '💤', '💪', '👑', '🏆', '💰', '⚡'] },
  ];
  
  // Handle message input change
  const handleChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Signal that the user is typing
    if (newMessage.trim() && onTyping) {
      onTyping();
    }
    
    // Set composing state for animation
    if (newMessage.length > 0 && !isComposing) {
      setIsComposing(true);
    } else if (newMessage.length === 0 && isComposing) {
      setIsComposing(false);
    }
  };
  
  // Handle message submit
  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!message.trim() && !isRecording) return;
    
    // If recording, stop and send audio
    if (isRecording) {
      handleStopRecording();
      return;
    }
    
    // Send text message
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsComposing(false);
    }
    
    // Close emoji picker if open
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
    }
    
    // Focus the input after sending
    inputRef.current?.focus();
  };
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji);
    inputRef.current?.focus();
  };
  
  // Handle file selection for attachments
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset attachment menu
    setShowAttachmentMenu(false);
    
    // Determine content type
    let contentType = 'file';
    let resourceType = 'raw';
    
    if (file.type.startsWith('image/')) {
      contentType = 'image';
      resourceType = 'image';
    } else if (file.type.startsWith('audio/')) {
      contentType = 'audio';
      resourceType = 'video'; // Cloudinary uses 'video' resource type for audio files
    } else if (file.type.startsWith('video/')) {
      contentType = 'video';
      resourceType = 'video';
    }
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('resourceType', resourceType);
      
      // Show loading state (could add a loading indicator here)
      
      // Upload the file to the appropriate endpoint
      const uploadEndpoint = contentType === 'image' 
        ? '/api/upload/image' 
        : '/api/upload/file';
      
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      const data = await response.json();
      
      // Send file message with the uploaded file URL
      onSendMessage(
        file.name,
        contentType,
        replyTo?._id,
        {
          fileUrl: data.url,
          fileName: data.fileName || file.name,
          fileSize: data.fileSize || file.size,
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      // Reset input
      e.target.value = '';
    }
  };
  
  // Trigger file input click based on type
  const handleAttachment = (type) => {
    // Set accept filter based on type
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' 
        ? 'image/*' 
        : type === 'audio'
        ? 'audio/*'
        : type === 'video'
        ? 'video/*'
        : '*';
      
      fileInputRef.current.click();
    }
    
    // Close attachment menu
    setShowAttachmentMenu(false);
  };
  
  // Media recorder reference
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  // Handle voice recording start
  const handleStartRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Close menus
      setShowAttachmentMenu(false);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check your browser permissions.');
    }
  };
  
  // Handle voice recording stop
  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      setIsRecording(false);
      return;
    }
    
    // Stop recording
    mediaRecorderRef.current.stop();
    
    // Stop timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    
    // Process the recorded audio
    mediaRecorderRef.current.onstop = async () => {
      try {
        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Create a file name
        const fileName = `voice_message_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
        
        // Create a File object from the Blob
        const audioFile = new File([audioBlob], fileName, { type: 'audio/webm' });
        
        // Create form data for upload
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('resourceType', 'video'); // Cloudinary uses 'video' resource type for audio files
        
        // Upload the audio file
        const response = await fetch('/api/upload/file', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload audio file');
        }
        
        const data = await response.json();
        
        // Send the audio message with the uploaded file URL
        onSendMessage(
          fileName,
          "audio",
          replyTo?._id,
          {
            fileUrl: data.url,
            fileName: data.fileName || fileName,
            fileSize: data.fileSize || audioBlob.size,
          }
        );
      } catch (error) {
        console.error('Error uploading audio:', error);
        alert('Failed to upload audio. Please try again.');
        
        // Fallback to local URL if upload fails
        const audioUrl = URL.createObjectURL(new Blob(audioChunksRef.current, { type: 'audio/webm' }));
        const fileName = `voice_message_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
        
        onSendMessage(
          fileName,
          "audio",
          replyTo?._id,
          {
            fileUrl: audioUrl,
            fileName: fileName,
            fileSize: new Blob(audioChunksRef.current, { type: 'audio/webm' }).size,
          }
        );
      } finally {
        // Stop all tracks in the stream
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        
        // Reset recording state
        setIsRecording(false);
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
      }
    };
  };
  
  // Format recording time
  const formatRecordingTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle key press for submit
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  // Attach event listeners and focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
    
    // Cleanup recording timer on unmount
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Reply indicator */}
      <AnimatePresence>
        {replyTo && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-2 flex items-center bg-dark-light rounded overflow-hidden"
          >
            <div className="w-1 self-stretch bg-primary"></div>
            <div className="flex-1 p-2 overflow-hidden">
              <p className="text-xs text-gray-400">
                Replying to <span className="font-medium text-white">{replyTo.sender.name}</span>
              </p>
              <p className="text-sm text-gray-300 truncate">
                {replyTo.contentType === 'text' 
                  ? replyTo.content 
                  : replyTo.contentType === 'image'
                  ? '📷 Image'
                  : replyTo.contentType === 'audio'
                  ? '🔊 Audio'
                  : replyTo.contentType === 'video'
                  ? '🎬 Video'
                  : '📎 File'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancelReply}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Recording state */}
      {isRecording ? (
        <div className="flex items-center bg-dark rounded-full pl-4 pr-2 py-2 text-white">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            <span className="font-medium">Recording</span>
            <span className="ml-2 text-gray-400">{formatRecordingTime()}</span>
          </div>
          <div className="flex-1"></div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleStopRecording}
            className="ml-2 p-2 bg-red-500 rounded-full text-white"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z" />
            </svg>
          </motion.button>
        </div>
      ) : (
        /* Message form */
        <form onSubmit={handleSubmit} className="flex items-center">
          {/* Emoji button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowAttachmentMenu(false);
            }}
            className="p-2 text-gray-400 hover:text-primary transition-colors relative"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-18c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm-5 9a5 5 0 0 0 10 0h-2a3 3 0 0 1-6 0H7zm1-2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm8 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
            
            {showEmojiPicker && (
              <span className="absolute bottom-full left-0 w-3 h-3 transform rotate-45 bg-dark-lighter border-l border-t border-gray-700 -mb-1.5 ml-3"></span>
            )}
          </motion.button>
          
          {/* Attachment button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => {
              setShowAttachmentMenu(!showAttachmentMenu);
              setShowEmojiPicker(false);
            }}
            className="p-2 text-gray-400 hover:text-primary transition-colors relative"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
            
            {showAttachmentMenu && (
              <span className="absolute bottom-full left-0 w-3 h-3 transform rotate-45 bg-dark-lighter border-l border-t border-gray-700 -mb-1.5 ml-3"></span>
            )}
          </motion.button>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Text input */}
          <div className="flex-1 mx-2 relative">
            <AnimatePresence>
              {isComposing && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  exit={{ width: 0 }}
                  className="absolute -bottom-[1px] left-0 h-[2px] bg-primary rounded-full"
                ></motion.div>
              )}
            </AnimatePresence>
            
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="w-full px-4 py-2 bg-dark rounded-full border border-gray-700 focus:border-primary focus:outline-none text-white"
            />
          </div>
          
          {/* Microphone / Send button */}
          {message.trim() ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="p-2 bg-primary rounded-full text-dark transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleStartRecording}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </motion.button>
          )}
        </form>
      )}
      
      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 p-3 bg-dark-lighter border border-gray-700 rounded-lg shadow-lg max-w-sm w-72 z-10"
          >
            <div className="text-xs text-gray-400 mb-2">Frequently used</div>
            <div className="space-y-3">
              {emojiSets.map((set, index) => (
                <div key={index}>
                  <div className="text-xs text-gray-500 my-1">{set.category}</div>
                  <div className="grid grid-cols-8 gap-1">
                    {set.emojis.map((emoji) => (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="p-1 hover:bg-gray-700 rounded cursor-pointer text-xl"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Attachment menu */}
      <AnimatePresence>
        {showAttachmentMenu && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 p-2 bg-dark-lighter border border-gray-700 rounded-lg shadow-lg z-10"
          >
            <div className="grid grid-cols-4 gap-1">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAttachment('image')}
                className="flex flex-col items-center p-2 hover:bg-dark-light rounded"
              >
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mb-1">
                  <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                <span className="text-xs text-gray-300">Photo</span>
              </motion.button>
              
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAttachment('video')}
                className="flex flex-col items-center p-2 hover:bg-dark-light rounded"
              >
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mb-1">
                  <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                </div>
                <span className="text-xs text-gray-300">Video</span>
              </motion.button>
              
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAttachment('file')}
                className="flex flex-col items-center p-2 hover:bg-dark-light rounded"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-1">
                  <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <span className="text-xs text-gray-300">Document</span>
              </motion.button>
              
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAttachment('audio')}
                className="flex flex-col items-center p-2 hover:bg-dark-light rounded"
              >
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mb-1">
                  <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
                <span className="text-xs text-gray-300">Audio</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;

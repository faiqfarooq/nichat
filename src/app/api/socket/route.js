import { Server as SocketIOServer } from 'socket.io';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/mongodb/models/User';
import Message from '@/lib/mongodb/models/Message';
import Chat from '@/lib/mongodb/models/Chat';

// Global variable to store the Socket.IO server instance
let io;

export async function GET(req) {
  if (io) {
    // If Socket.IO server is already running, return a success response
    return new NextResponse('Socket.IO server is running', { status: 200 });
  }

  try {
    // Connect to the database
    await connectDB();

    // Create a new Socket.IO server
    io = new SocketIOServer({
      cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Authentication middleware
    io.use(async (socket, next) => {
      const userId = socket.handshake.auth.token;
      
      if (!userId) {
        return next(new Error('Authentication error'));
      }

      try {
        // Find user by ID
        const user = await User.findById(userId);
        
        if (!user) {
          return next(new Error('User not found'));
        }

        // Attach user to socket
        socket.user = {
          id: user._id.toString(),
          name: user.name,
          avatar: user.avatar,
        };
        
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });

    // Connection event
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.user.name} (${socket.user.id})`);
      
      // Join user's own room for private messages
      socket.join(socket.user.id);
      
      // Update user's online status
      User.findByIdAndUpdate(socket.user.id, { isOnline: true })
        .catch(error => console.error('Error updating online status:', error));
      
      // Broadcast user's online status to others
      socket.broadcast.emit('user:status', {
        userId: socket.user.id,
        isOnline: true,
      });
      
      // Handle direct messages
      socket.on('direct:message', async (data) => {
        try {
          const { targetUserId, event, data: eventData } = data;
          
          console.log(`Direct message from ${socket.user.name} to ${targetUserId}`, { event });
          
          // Check if recipient exists
          const recipient = await User.findById(targetUserId);
          if (!recipient) {
            console.error(`Recipient not found: ${targetUserId}`);
            socket.emit('error', { message: 'Recipient not found' });
            return;
          }
          
          console.log(`Recipient found: ${recipient.name}`);
          
          // Forward message to recipient
          io.to(targetUserId).emit(event, {
            ...eventData,
            sender: {
              id: socket.user.id,
              name: socket.user.name,
              avatar: socket.user.avatar,
            },
          });
          
          console.log(`Direct message (${event}) emitted to ${targetUserId}`);
        } catch (error) {
          console.error('Error handling direct message:', error);
          socket.emit('error', { message: 'Error sending direct message' });
        }
      });
      
      // Handle call offer
      socket.on('call:offer', async (data) => {
        try {
          const { callId, recipientId, callType, offer, isIceRestart } = data;
          
          console.log(`Call offer from ${socket.user.name} to ${recipientId}`, { callId, callType, isIceRestart });
          
          // If this is an ICE restart, just forward it to the call room
          if (isIceRestart) {
            socket.to(`call:${callId}`).emit('call:offer', {
              callId,
              callType,
              offer,
              isIceRestart: true,
              caller: {
                id: socket.user.id,
                name: socket.user.name,
                avatar: socket.user.avatar,
              },
            });
            return;
          }
          
          // Check if recipient exists
          const recipient = await User.findById(recipientId);
          if (!recipient) {
            console.error(`Recipient not found: ${recipientId}`);
            socket.emit('error', { message: 'Recipient not found' });
            return;
          }
          
          console.log(`Recipient found: ${recipient.name}`);
          
          // Send incoming call notification to recipient
          io.to(recipientId).emit('call:incoming', {
            callId,
            callType,
            offer,
            caller: {
              id: socket.user.id,
              name: socket.user.name,
              avatar: socket.user.avatar,
            },
          });
          
          console.log(`Incoming call notification emitted to ${recipientId}`);
          
          // Join call room
          socket.join(`call:${callId}`);
          console.log(`${socket.user.name} joined call room: call:${callId}`);
          
          // Send confirmation to caller
          socket.emit('call:initiated', {
            callId,
            recipientId,
            callType,
          });
        } catch (error) {
          console.error('Error handling call offer:', error);
          socket.emit('error', { message: 'Error initiating call' });
        }
      });
      
      // Handle call accept
      socket.on('call:accept', (data) => {
        try {
          const { callId } = data;
          
          console.log(`Call accepted by ${socket.user.name} for call ${callId}`);
          
          // Join call room
          socket.join(`call:${callId}`);
          
          // Notify caller that call was accepted
          socket.to(`call:${callId}`).emit('call:accepted', {
            callId,
            recipient: {
              id: socket.user.id,
              name: socket.user.name,
              avatar: socket.user.avatar,
            },
          });
        } catch (error) {
          console.error('Error handling call accept:', error);
          socket.emit('error', { message: 'Error accepting call' });
        }
      });
      
      // Handle call answer (WebRTC answer)
      socket.on('call:answer', (data) => {
        try {
          const { callId, answer } = data;
          
          console.log(`Call answer from ${socket.user.name} for call ${callId}`);
          
          // Broadcast answer to all users in the call room
          socket.to(`call:${callId}`).emit('call:answer', {
            callId,
            answer,
            recipient: {
              id: socket.user.id,
              name: socket.user.name,
              avatar: socket.user.avatar,
            },
          });
        } catch (error) {
          console.error('Error handling call answer:', error);
          socket.emit('error', { message: 'Error answering call' });
        }
      });
      
      // Handle call reject
      socket.on('call:reject', (data) => {
        try {
          const { callId, reason } = data;
          
          console.log(`Call rejected by ${socket.user.name} for call ${callId}`, { reason });
          
          // Notify caller that call was rejected
          socket.to(`call:${callId}`).emit('call:rejected', {
            callId,
            reason,
            recipient: {
              id: socket.user.id,
              name: socket.user.name,
              avatar: socket.user.avatar,
            },
          });
        } catch (error) {
          console.error('Error handling call reject:', error);
          socket.emit('error', { message: 'Error rejecting call' });
        }
      });
      
      // Handle ICE candidates
      socket.on('call:ice-candidate', (data) => {
        try {
          const { callId, candidate } = data;
          
          // Broadcast ICE candidate to all users in the call room
          socket.to(`call:${callId}`).emit('call:ice-candidate', {
            callId,
            candidate,
          });
        } catch (error) {
          console.error('Error handling ICE candidate:', error);
        }
      });
      
      // Handle ICE restart request
      socket.on('call:ice-restart', (data) => {
        try {
          const { callId } = data;
          
          console.log(`ICE restart requested by ${socket.user.name} for call ${callId}`);
          
          // Broadcast ICE restart request to all users in the call room
          socket.to(`call:${callId}`).emit('call:ice-restart', {
            callId,
          });
        } catch (error) {
          console.error('Error handling ICE restart request:', error);
        }
      });
      
      // Handle call end
      socket.on('call:end', (data) => {
        try {
          const { callId } = data;
          
          console.log(`Call ended by ${socket.user.name} for call ${callId}`);
          
          // Broadcast call end to all users in the call room
          io.to(`call:${callId}`).emit('call:end', {
            callId,
          });
          
          // Leave the call room
          socket.leave(`call:${callId}`);
        } catch (error) {
          console.error('Error handling call end:', error);
        }
      });
      
      // Handle message editing
      socket.on('message:edit', async (data) => {
        try {
          const { messageId, content } = data;
          
          if (!messageId || !content) {
            socket.emit('error', { message: 'Message ID and content are required' });
            return;
          }
          
          // Get the message
          const message = await Message.findById(messageId);
          
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }
          
          // Check if user is the sender
          if (message.sender.toString() !== socket.user.id) {
            socket.emit('error', { message: 'You can only edit your own messages' });
            return;
          }
          
          // Check if message is a text message
          if (message.contentType !== 'text') {
            socket.emit('error', { message: 'Only text messages can be edited' });
            return;
          }
          
          // Check if message is deleted
          if (message.isDeleted || message.deletedForEveryone) {
            socket.emit('error', { message: 'Deleted messages cannot be edited' });
            return;
          }
          
          // Store original content if this is the first edit
          if (!message.isEdited) {
            message.originalContent = message.content;
          }
          
          // Update the message
          message.content = content;
          message.isEdited = true;
          await message.save();
          
          // Get updated message with populated fields
          const updatedMessage = await Message.findById(messageId)
            .populate('sender', 'name avatar')
            .populate({
              path: 'replyTo',
              populate: {
                path: 'sender',
                select: 'name avatar',
              },
            });
          
          // Broadcast the edited message to the chat room
          io.to(`chat:${message.chat.toString()}`).emit('message:edit', updatedMessage);
          
        } catch (error) {
          console.error('Error editing message:', error);
          socket.emit('error', { message: 'Error editing message' });
        }
      });
      
      // Handle message deletion
      socket.on('message:delete', async (data) => {
        try {
          const { messageId, deleteForEveryone = false } = data;
          
          if (!messageId) {
            socket.emit('error', { message: 'Message ID is required' });
            return;
          }
          
          // Get the message
          const message = await Message.findById(messageId);
          
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }
          
          // Get the chat
          const chat = await Chat.findById(message.chat);
          
          if (!chat) {
            socket.emit('error', { message: 'Chat not found' });
            return;
          }
          
          // Check if user is a participant in the chat
          if (!chat.participants.includes(socket.user.id)) {
            socket.emit('error', { message: 'You are not a participant in this chat' });
            return;
          }
          
          // If deleting for everyone, check if user is the sender
          if (deleteForEveryone && message.sender.toString() !== socket.user.id) {
            socket.emit('error', { message: 'You can only delete your own messages for everyone' });
            return;
          }
          
          // Update the message based on deletion type
          if (deleteForEveryone) {
            // Delete for everyone
            message.deletedForEveryone = true;
            message.isDeleted = true;
            await message.save();
            
            // Broadcast deletion to all participants
            io.to(`chat:${message.chat.toString()}`).emit('message:delete', {
              messageId,
              deleteForEveryone: true,
            });
          } else {
            // Delete for this user only
            message.deletedFor.push(socket.user.id);
            await message.save();
            
            // Send deletion confirmation only to this user
            socket.emit('message:delete', {
              messageId,
              deleteForEveryone: false,
            });
          }
          
        } catch (error) {
          console.error('Error deleting message:', error);
          socket.emit('error', { message: 'Error deleting message' });
        }
      });
      
      // Handle joining chat rooms
      socket.on('chat:join', (chatId) => {
        if (chatId) {
          socket.join(`chat:${chatId}`);
          console.log(`${socket.user.name} joined chat room: ${chatId}`);
        }
      });
      
      // Handle leaving chat rooms
      socket.on('chat:leave', (chatId) => {
        if (chatId) {
          socket.leave(`chat:${chatId}`);
          console.log(`${socket.user.name} left chat room: ${chatId}`);
        }
      });
      
      // Handle social notifications (follow, request, accept)
      socket.on('notification:social', async (notificationData) => {
        try {
          const { type, targetUserId, data = {} } = notificationData;
          
          if (!targetUserId || !type) {
            return;
          }
          
          // Emit notification to target user
          io.to(targetUserId).emit(`notification:${type}`, {
            type,
            from: socket.user,
            createdAt: new Date(),
            read: false,
            ...data
          });
          
        } catch (error) {
          console.error('Error handling social notification:', error);
          socket.emit('error', { message: 'Error sending notification' });
        }
      });
      
      // Handle new messages
      socket.on('message:new', async (messageData) => {
        try {
          const { 
            chatId, 
            content, 
            contentType = 'text', 
            replyTo = null,
            fileUrl = null,
            fileName = null,
            fileSize = null
          } = messageData;
          
          if (!chatId || !content) {
            return;
          }
          
          // Check if chat exists and user is a participant
          const chat = await Chat.findById(chatId);
          
          if (!chat) {
            socket.emit('error', { message: 'Chat not found' });
            return;
          }
          
          if (!chat.participants.includes(socket.user.id)) {
            socket.emit('error', { message: 'You are not a participant in this chat' });
            return;
          }
          
          // Create the message
          const message = await Message.create({
            chat: chatId,
            sender: socket.user.id,
            content,
            contentType,
            replyTo,
            fileUrl,
            fileName,
            fileSize,
            readBy: [socket.user.id], // Mark as read by sender
          });
          
          // Update the chat's last message
          await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });
          
          // Increment unread count for all participants except sender
          const unreadUpdates = {};
          for (const participantId of chat.participants) {
            if (participantId.toString() !== socket.user.id) {
              unreadUpdates[`unreadCount.${participantId}`] = 1;
            }
          }
          
          if (Object.keys(unreadUpdates).length > 0) {
            await Chat.findByIdAndUpdate(
              chatId,
              { $inc: unreadUpdates },
              { new: true }
            );
          }
          
          // Populate sender info
          const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name avatar')
            .populate('replyTo');
          
          // Broadcast message to chat room
          io.to(`chat:${chatId}`).emit('message:new', populatedMessage);
          
          // Send notification to offline participants
          chat.participants.forEach((participantId) => {
            if (participantId.toString() !== socket.user.id) {
              io.to(participantId.toString()).emit('notification:new', {
                type: 'message',
                chatId,
                message: populatedMessage,
              });
            }
          });
        } catch (error) {
          console.error('Error handling new message:', error);
          socket.emit('error', { message: 'Error sending message' });
        }
      });
      
      // Handle typing status
      socket.on('typing:start', (chatId) => {
        if (chatId) {
          socket.to(`chat:${chatId}`).emit('typing:start', {
            chatId,
            userId: socket.user.id,
            userName: socket.user.name,
          });
        }
      });
      
      socket.on('typing:stop', (chatId) => {
        if (chatId) {
          socket.to(`chat:${chatId}`).emit('typing:stop', {
            chatId,
            userId: socket.user.id,
          });
        }
      });
      
      // Handle read receipts
      socket.on('message:read', async (data) => {
        try {
          const { chatId, messageId } = data;
          
          if (!chatId) {
            return;
          }
          
          // Mark messages as read
          if (messageId) {
            // Mark specific message as read
            await Message.findByIdAndUpdate(
              messageId,
              { $addToSet: { readBy: socket.user.id } }
            );
          } else {
            // Mark all messages in chat as read
            await Message.updateMany(
              {
                chat: chatId,
                sender: { $ne: socket.user.id },
                readBy: { $ne: socket.user.id },
              },
              { $addToSet: { readBy: socket.user.id } }
            );
          }
          
          // Reset unread count for this user
          const unreadUpdate = {};
          unreadUpdate[`unreadCount.${socket.user.id}`] = 0;
          
          await Chat.findByIdAndUpdate(
            chatId,
            { $set: unreadUpdate },
            { new: true }
          );
          
          // Broadcast read receipt
          socket.to(`chat:${chatId}`).emit('message:read', {
            chatId,
            userId: socket.user.id,
            messageId,
          });
        } catch (error) {
          console.error('Error handling read receipt:', error);
        }
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.name} (${socket.user.id})`);
        
        // Update user's online status and last seen
        User.findByIdAndUpdate(
          socket.user.id,
          {
            isOnline: false,
            lastSeen: new Date(),
          }
        ).catch(error => console.error('Error updating offline status:', error));
        
        // Broadcast user's offline status to others
        socket.broadcast.emit('user:status', {
          userId: socket.user.id,
          isOnline: false,
          lastSeen: new Date(),
        });
      });
    });

    // Start the Socket.IO server
    console.log('Socket.IO server started');
    
    return new NextResponse('Socket.IO server started', { status: 200 });
  } catch (error) {
    console.error('Error starting Socket.IO server:', error);
    return new NextResponse('Error starting Socket.IO server', { status: 500 });
  }
}

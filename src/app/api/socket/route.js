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
        origin: process.env.NEXTAUTH_URL || '*',
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
      
      // Handle new messages
      socket.on('message:new', async (messageData) => {
        try {
          const { chatId, content, contentType = 'text', replyTo = null } = messageData;
          
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

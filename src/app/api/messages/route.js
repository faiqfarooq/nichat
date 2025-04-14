import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Message from "@/lib/mongodb/models/Message";
import Chat from "@/lib/mongodb/models/Chat";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../auth/[...nextauth]/route";
import { corsMiddleware } from "@/lib/corsMiddleware";

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return corsMiddleware(request, response);
    }

    // Parse request body
    const requestBody = await request.json();
    
    const {
      chatId,
      content,
      contentType = "text",
      replyTo = null,
      fileUrl = null,
      fileName = null,
      fileSize = null,
    } = requestBody;

    if (!chatId || !content) {
      const response = NextResponse.json(
        { error: "Chat ID and content are required" },
        { status: 400 }
      );
      return corsMiddleware(request, response);
    }

    // Connect to database
    await connectDB();

    // Check if chat exists and user is a participant
    const chat = await Chat.findById(chatId);

    if (!chat) {
      const response = NextResponse.json({ error: "Chat not found" }, { status: 404 });
      return corsMiddleware(request, response);
    }

    if (!chat.participants.includes(session.user.id)) {
      const response = NextResponse.json(
        { error: "You are not a participant in this chat" },
        { status: 403 }
      );
      return corsMiddleware(request, response);
    }
    
    // Check if the sender is blocked by any of the chat participants
    const otherParticipants = chat.participants.filter(
      (participant) => participant.toString() !== session.user.id
    );
    
    // For each participant, check if they have blocked the sender
    for (const participantId of otherParticipants) {
      const participant = await User.findById(participantId);
      
      // If the participant has blocked the sender, return an error
      if (participant.blockedUsers && participant.blockedUsers.includes(session.user.id)) {
        const response = NextResponse.json(
          { error: "Cannot send message: you have been blocked by one of the participants" },
          { status: 403 }
        );
        return corsMiddleware(request, response);
      }
    }
    
    // Check if the sender has blocked any of the participants
    const currentUser = await User.findById(session.user.id);
    if (currentUser.blockedUsers && currentUser.blockedUsers.length > 0) {
      const hasBlockedParticipant = otherParticipants.some(participantId => 
        currentUser.blockedUsers.includes(participantId.toString())
      );
      
      if (hasBlockedParticipant) {
        const response = NextResponse.json(
          { error: "Cannot send message: you have blocked one of the participants" },
          { status: 403 }
        );
        return corsMiddleware(request, response);
      }
    }
    
    // Create the message
    const message = await Message.create({
      chat: chatId,
      sender: session.user.id,
      content,
      contentType,
      replyTo,
      fileUrl,
      fileName,
      fileSize,
      readBy: [session.user.id], // Mark as read by sender
    });

    // Update the chat's last message
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    // Increment unread count for all participants except sender
    const unreadUpdates = {};
    for (const participantId of chat.participants) {
      if (participantId.toString() !== session.user.id) {
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
      .populate("sender", "name avatar")
      .populate("replyTo");

    // Create response with CORS headers
    const response = NextResponse.json(populatedMessage, { status: 201 });
    return corsMiddleware(request, response);
  } catch (error) {
    console.error("Message creation error:", error);
    const response = NextResponse.json(
      { error: "Server error during message creation" },
      { status: 500 }
    );
    return corsMiddleware(request, response);
  }
}

// Get all messages for a specific chat
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return corsMiddleware(request, response);
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const before = searchParams.get("before"); // Message ID to fetch messages before

    if (!chatId) {
      const response = NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
      return corsMiddleware(request, response);
    }

    // Connect to database
    await connectDB();

    // Check if chat exists and user is a participant
    const chat = await Chat.findById(chatId);

    if (!chat) {
      const response = NextResponse.json({ error: "Chat not found" }, { status: 404 });
      return corsMiddleware(request, response);
    }

    if (!chat.participants.includes(session.user.id)) {
      const response = NextResponse.json(
        { error: "You are not a participant in this chat" },
        { status: 403 }
      );
      return corsMiddleware(request, response);
    }
    
    // Check if the user is blocked by any of the chat participants
    const otherParticipants = chat.participants.filter(
      (participant) => participant.toString() !== session.user.id
    );
    
    // For each participant, check if they have blocked the user
    for (const participantId of otherParticipants) {
      const participant = await User.findById(participantId);
      
      // If the participant has blocked the user, return an error
      if (participant.blockedUsers && participant.blockedUsers.includes(session.user.id)) {
        const response = NextResponse.json(
          { error: "Cannot access chat: you have been blocked by one of the participants" },
          { status: 403 }
        );
        return corsMiddleware(request, response);
      }
    }
    
    // Check if the user has blocked any of the participants
    const currentUser = await User.findById(session.user.id);
    if (currentUser.blockedUsers && currentUser.blockedUsers.length > 0) {
      const hasBlockedParticipant = otherParticipants.some(participantId => 
        currentUser.blockedUsers.includes(participantId.toString())
      );
      
      if (hasBlockedParticipant) {
        const response = NextResponse.json(
          { error: "Cannot access chat: you have blocked one of the participants" },
          { status: 403 }
        );
        return corsMiddleware(request, response);
      }
    }

    // Build query
    let query = { chat: chatId };

    if (before) {
      const beforeMessage = await Message.findById(before);
      if (beforeMessage) {
        query.createdAt = { $lt: beforeMessage.createdAt };
      }
    }

    // Get messages
    const messages = await Message.find({
      ...query,
      $or: [
        { deletedFor: { $ne: session.user.id } },
        { deletedFor: { $exists: false } }
      ],
      $and: [
        { $or: [
          { deletedForEveryone: false },
          { deletedForEveryone: { $exists: false } }
        ]}
      ]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("sender", "name avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      });

    // Mark messages as read
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: session.user.id },
        readBy: { $ne: session.user.id },
      },
      { $addToSet: { readBy: session.user.id } }
    );

    // Reset unread count for this user
    const unreadUpdate = {};
    unreadUpdate[`unreadCount.${session.user.id}`] = 0;

    await Chat.findByIdAndUpdate(chatId, { $set: unreadUpdate }, { new: true });

    // Create response with CORS headers
    const response = NextResponse.json(messages.reverse()); // Reverse to get oldest first
    return corsMiddleware(request, response);
  } catch (error) {
    console.error("Error fetching messages:", error);
    const response = NextResponse.json(
      { error: "Server error while fetching messages" },
      { status: 500 }
    );
    return corsMiddleware(request, response);
  }
}

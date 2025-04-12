import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Message from "@/lib/mongodb/models/Message";
import Chat from "@/lib/mongodb/models/Chat";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json(
        { error: "Chat ID and content are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if chat exists and user is a participant
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chat.participants.includes(session.user.id)) {
      return NextResponse.json(
        { error: "You are not a participant in this chat" },
        { status: 403 }
      );
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

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json(
      { error: "Server error during message creation" },
      { status: 500 }
    );
  }
}

// Get all messages for a specific chat
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const before = searchParams.get("before"); // Message ID to fetch messages before

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if chat exists and user is a participant
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chat.participants.includes(session.user.id)) {
      return NextResponse.json(
        { error: "You are not a participant in this chat" },
        { status: 403 }
      );
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

    return NextResponse.json(messages.reverse()); // Reverse to get oldest first
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Server error while fetching messages" },
      { status: 500 }
    );
  }
}

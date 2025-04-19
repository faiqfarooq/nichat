import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Message from "@/lib/mongodb/models/Message";
import Chat from "@/lib/mongodb/models/Chat";

// This config is needed for routes that use dynamic features like headers
export const dynamic = 'force-dynamic';

// Handler for creating a chat backup
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user ID
    const userId = session.user.id;

    // Find all chats where the user is a participant
    const userChats = await Chat.find({
      participants: userId
    }).populate('participants', 'name email avatar');

    // Get chat IDs
    const chatIds = userChats.map(chat => chat._id);

    // Get all messages from these chats
    const messages = await Message.find({
      chatId: { $in: chatIds }
    }).sort({ createdAt: 1 });

    // Create backup data structure
    const backup = {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      },
      timestamp: new Date().toISOString(),
      chats: userChats.map(chat => {
        // Get messages for this chat
        const chatMessages = messages.filter(msg => 
          msg.chatId.toString() === chat._id.toString()
        );
        
        // Format chat data
        return {
          id: chat._id,
          isGroup: chat.isGroup,
          name: chat.name,
          participants: chat.participants.map(p => ({
            id: p._id,
            name: p.name,
            email: p.email,
            avatar: p.avatar
          })),
          messages: chatMessages.map(msg => ({
            id: msg._id,
            sender: msg.sender.toString(),
            content: msg.content,
            contentType: msg.contentType,
            createdAt: msg.createdAt
          }))
        };
      })
    };

    // Return backup data
    return NextResponse.json(backup);
  } catch (error) {
    console.error("Error creating chat backup:", error);
    return NextResponse.json(
      { error: "Failed to create chat backup" },
      { status: 500 }
    );
  }
}

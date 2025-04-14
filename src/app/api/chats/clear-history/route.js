import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Message from "@/lib/mongodb/models/Message";
import Chat from "@/lib/mongodb/models/Chat";

// Handler for clearing chat history
export async function DELETE(request) {
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
    });

    // Get chat IDs
    const chatIds = userChats.map(chat => chat._id);

    // Delete all messages from these chats
    await Message.deleteMany({
      chatId: { $in: chatIds }
    });

    // Update the chats to remove lastMessage
    await Chat.updateMany(
      { _id: { $in: chatIds } },
      { $unset: { lastMessage: "" } }
    );

    // Return success response
    return NextResponse.json({
      message: "Chat history cleared successfully"
    });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    return NextResponse.json(
      { error: "Failed to clear chat history" },
      { status: 500 }
    );
  }
}

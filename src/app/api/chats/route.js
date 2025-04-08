import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Chat from "@/lib/mongodb/models/Chat";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

// Create a new chat or get existing one
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [session.user.id, userId] },
    });

    if (existingChat) {
      // Return existing chat
      const populatedChat = await Chat.findById(existingChat._id)
        .populate("participants", "name avatar status isOnline")
        .populate("lastMessage");

      return NextResponse.json(populatedChat);
    }

    // Create new chat
    const newChat = await Chat.create({
      participants: [session.user.id, userId],
      isGroup: false,
    });

    // Populate participant info
    const populatedChat = await Chat.findById(newChat._id)
      .populate("participants", "name avatar status isOnline");

    return NextResponse.json(populatedChat, { status: 201 });
  } catch (error) {
    console.error("Chat creation error:", error);
    return NextResponse.json(
      { error: "Server error during chat creation" },
      { status: 500 }
    );
  }
}

// Get all chats for the current user
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get all chats where user is a participant
    const chats = await Chat.find({
      participants: session.user.id,
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "name avatar status isOnline")
      .populate("groupAdmin", "name avatar")
      .populate("lastMessage");

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Chats fetch error:", error);
    return NextResponse.json(
      { error: "Server error during chats fetch" },
      { status: 500 }
    );
  }
}

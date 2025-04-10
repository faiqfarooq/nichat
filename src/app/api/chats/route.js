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

    const requestBody = await request.json();
    console.log('Chat creation request body:', requestBody);

    // Connect to database
    await connectDB();

    // Check if it's a group chat
    if (requestBody.isGroup) {
      const { name, participants } = requestBody;
      
      if (!name || !participants || !Array.isArray(participants) || participants.length === 0) {
        return NextResponse.json(
          { error: "Group name and at least one participant are required" },
          { status: 400 }
        );
      }
      
      // Add current user to participants if not already included
      const allParticipants = [...new Set([...participants, session.user.id])];
      
      // Create new group chat
      const newGroupChat = await Chat.create({
        name,
        participants: allParticipants,
        isGroup: true,
        groupAdmin: session.user.id,
      });
      
      // Populate participant info
      const populatedGroupChat = await Chat.findById(newGroupChat._id)
        .populate("participants", "name avatar status isOnline")
        .populate("groupAdmin", "name avatar");
      
      return NextResponse.json(populatedGroupChat, { status: 201 });
    } else {
      // One-on-one chat
      const { userId } = requestBody;
      
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }
      
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      
      // Check if user is private and not in current user's contacts
      if (user.isPrivate) {
        const currentUser = await User.findById(session.user.id);
        if (!currentUser.contacts.includes(userId)) {
          return NextResponse.json(
            { error: "Cannot message a private user unless they accept your request" },
            { status: 403 }
          );
        }
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
    }
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

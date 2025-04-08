import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Chat from "@/lib/mongodb/models/Chat";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

// Create a new group chat
export async function POST(request) {
  try {
    console.log("Create group API called");
    
    // Check authentication
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const requestBody = await request.json();
    console.log("Request body:", requestBody);
    
    const { name, participants, groupAvatar } = requestBody;
    
    if (!name || !participants || !Array.isArray(participants) || participants.length === 0) {
      console.log("Validation failed:", { name, participants });
      return NextResponse.json(
        { error: "Group name and at least one participant are required" },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectDB();
    
    // Add current user to participants if not already included
    const allParticipants = [...new Set([...participants, session.user.id])];
    console.log("All participants:", allParticipants);
    
    // Create new group chat
    const newGroupChat = await Chat.create({
      name,
      participants: allParticipants,
      isGroup: true,
      groupAdmin: session.user.id,
      groupAvatar: groupAvatar || null,
    });
    console.log("New group chat created:", newGroupChat);
    
    // Populate participant info
    const populatedGroupChat = await Chat.findById(newGroupChat._id)
      .populate("participants", "name avatar status isOnline")
      .populate("groupAdmin", "name avatar");
    
    return NextResponse.json(populatedGroupChat, { status: 201 });
  } catch (error) {
    console.error("Group creation error:", error);
    return NextResponse.json(
      { error: "Server error during group creation: " + error.message },
      { status: 500 }
    );
  }
}

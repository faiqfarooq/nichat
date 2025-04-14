import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Chat from "@/lib/mongodb/models/Chat";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

// Create a new group
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Log the request body for debugging
    const requestBody = await request.json();
    console.log("Group creation request body:", requestBody);

    const { name, members } = requestBody;

    console.log("Extracted name:", name);
    console.log("Extracted members:", members);

    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      console.log("Validation failed:", { name, members });
      return NextResponse.json(
        { error: "Group name and at least one member are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Validate members
    const memberIds = [...new Set([...members, session.user.id])]; // Add creator and remove duplicates

    // Check if all members exist
    const existingMembers = await User.find({ _id: { $in: memberIds } }).select(
      "_id"
    );

    if (existingMembers.length !== memberIds.length) {
      return NextResponse.json(
        { error: "One or more members do not exist" },
        { status: 400 }
      );
    }

    // Create the group chat
    const groupChat = await Chat.create({
      name,
      participants: memberIds,
      isGroup: true,
      groupAdmin: session.user.id,
    });

    // Populate participant info
    const populatedGroup = await Chat.findById(groupChat._id)
      .populate("participants", "name avatar status isOnline")
      .populate("groupAdmin", "name avatar");

    return NextResponse.json(populatedGroup, { status: 201 });
  } catch (error) {
    console.error("Group creation error:", error);
    return NextResponse.json(
      { error: "Server error during group creation" },
      { status: 500 }
    );
  }
}

// Get all groups for the current user
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get all groups where user is a participant
    const groups = await Chat.find({
      participants: session.user.id,
      isGroup: true,
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "name avatar isOnline")
      .populate("groupAdmin", "name avatar")
      .populate("lastMessage");

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Groups fetch error:", error);
    return NextResponse.json(
      { error: "Server error during groups fetch" },
      { status: 500 }
    );
  }
}

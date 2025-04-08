import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Chat from "@/lib/mongodb/models/Chat";
import Message from "@/lib/mongodb/models/Message";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get a specific chat by ID
export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatId = params.id;

    // Connect to database
    await connectDB();

    // Find the chat and check if user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: session.user.id,
    })
      .populate("participants", "name avatar status isOnline lastSeen")
      .populate("groupAdmin", "name avatar")
      .populate("lastMessage");

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Chat fetch error:", error);
    return NextResponse.json(
      { error: "Server error during chat fetch" },
      { status: 500 }
    );
  }
}

// Update a chat (for group chats - rename, add/remove members)
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatId = params.id;
    const { name, addMembers, removeMembers } = await request.json();

    // Connect to database
    await connectDB();

    // Find the chat and check if user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: session.user.id,
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Only allow updates to group chats
    if (!chat.isGroup) {
      return NextResponse.json(
        { error: "Cannot update non-group chat" },
        { status: 400 }
      );
    }

    // Only allow admin to update group
    if (chat.groupAdmin.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Only group admin can update the group" },
        { status: 403 }
      );
    }

    // Update chat properties
    if (name) {
      chat.name = name;
    }

    // Add members
    if (addMembers && Array.isArray(addMembers) && addMembers.length > 0) {
      const newMembers = addMembers.filter(
        (id) => !chat.participants.includes(id)
      );
      chat.participants.push(...newMembers);
    }

    // Remove members
    if (removeMembers && Array.isArray(removeMembers) && removeMembers.length > 0) {
      // Don't allow removing the admin
      const filteredRemoveMembers = removeMembers.filter(
        (id) => id !== chat.groupAdmin.toString()
      );
      
      chat.participants = chat.participants.filter(
        (p) => !filteredRemoveMembers.includes(p.toString())
      );
    }

    await chat.save();

    // Return updated chat with populated fields
    const updatedChat = await Chat.findById(chatId)
      .populate("participants", "name avatar status isOnline")
      .populate("groupAdmin", "name avatar")
      .populate("lastMessage");

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error("Chat update error:", error);
    return NextResponse.json(
      { error: "Server error during chat update" },
      { status: 500 }
    );
  }
}

// Delete a chat
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatId = params.id;

    // Connect to database
    await connectDB();

    // Find the chat and check if user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: session.user.id,
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // For group chats, only admin can delete
    if (chat.isGroup && chat.groupAdmin.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Only group admin can delete the group" },
        { status: 403 }
      );
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chat: chatId });

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    return NextResponse.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Chat deletion error:", error);
    return NextResponse.json(
      { error: "Server error during chat deletion" },
      { status: 500 }
    );
  }
}

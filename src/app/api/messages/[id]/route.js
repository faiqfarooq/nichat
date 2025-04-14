import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Message from "@/lib/mongodb/models/Message";
import Chat from "@/lib/mongodb/models/Chat";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET a specific message
export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Connect to database
    await connectDB();

    // Get the message
    const message = await Message.findById(id)
      .populate("sender", "name avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check if user is a participant in the chat
    const chat = await Chat.findById(message.chat);

    if (!chat.participants.includes(session.user.id)) {
      return NextResponse.json(
        { error: "You are not a participant in this chat" },
        { status: 403 }
      );
    }

    // Check if message is deleted for this user
    if (message.deletedFor.includes(session.user.id)) {
      return NextResponse.json(
        { error: "Message not available" },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      { error: "Server error while fetching message" },
      { status: 500 }
    );
  }
}

// PATCH to update a message (edit)
export async function PATCH(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get the message
    const message = await Message.findById(id);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check if user is the sender of the message
    if (message.sender.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own messages" },
        { status: 403 }
      );
    }

    // Check if message is a text message
    if (message.contentType !== "text") {
      return NextResponse.json(
        { error: "Only text messages can be edited" },
        { status: 400 }
      );
    }

    // Check if message is deleted
    if (message.isDeleted || message.deletedForEveryone) {
      return NextResponse.json(
        { error: "Deleted messages cannot be edited" },
        { status: 400 }
      );
    }

    // Store original content if this is the first edit
    if (!message.isEdited) {
      message.originalContent = message.content;
    }

    // Update the message
    message.content = content;
    message.isEdited = true;
    await message.save();

    // Get updated message with populated fields
    const updatedMessage = await Message.findById(id)
      .populate("sender", "name avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Server error while updating message" },
      { status: 500 }
    );
  }
}

// DELETE to delete a message
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { deleteForEveryone = false } = await request.json();

    // Connect to database
    await connectDB();

    // Get the message
    const message = await Message.findById(id);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check if user is a participant in the chat
    const chat = await Chat.findById(message.chat);

    if (!chat.participants.includes(session.user.id)) {
      return NextResponse.json(
        { error: "You are not a participant in this chat" },
        { status: 403 }
      );
    }

    // If deleting for everyone, check if user is the sender
    if (deleteForEveryone && message.sender.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own messages for everyone" },
        { status: 403 }
      );
    }

    // Update the message based on deletion type
    if (deleteForEveryone) {
      // Delete for everyone
      message.deletedForEveryone = true;
      message.isDeleted = true;
      await message.save();
    } else {
      // Delete for me only
      message.deletedFor.push(session.user.id);
      await message.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Server error while deleting message" },
      { status: 500 }
    );
  }
}

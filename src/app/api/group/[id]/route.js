import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Chat from "@/lib/mongodb/models/Chat";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get specific group details
export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupId = params.id;

    // Connect to database
    await connectDB();

    // Get group and check if user is a participant
    const group = await Chat.findOne({
      _id: groupId,
      isGroup: true,
      participants: session.user.id,
    })
      .populate("participants", "name avatar status isOnline lastSeen")
      .populate("groupAdmin", "name avatar")
      .populate("lastMessage");

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Group details error:", error);
    return NextResponse.json(
      { error: "Server error fetching group details" },
      { status: 500 }
    );
  }
}

// Update group details
export async function PATCH(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupId = params.id;
    const updates = await request.json();

    // Connect to database
    await connectDB();

    // Get group and check if user is admin
    const group = await Chat.findOne({
      _id: groupId,
      isGroup: true,
      groupAdmin: session.user.id, // Only admin can update
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or you are not the admin" },
        { status: 403 }
      );
    }

    // Filter allowed updates
    const allowedUpdates = {};
    if (updates.name) allowedUpdates.name = updates.name;
    if (updates.groupAvatar) allowedUpdates.groupAvatar = updates.groupAvatar;

    // Add members if provided
    if (
      updates.addMembers &&
      Array.isArray(updates.addMembers) &&
      updates.addMembers.length > 0
    ) {
      // Check if users exist
      const newMembers = await User.find({
        _id: { $in: updates.addMembers },
      }).select("_id");

      if (newMembers.length > 0) {
        // Add new members to participants (avoiding duplicates)
        await Chat.findByIdAndUpdate(
          groupId,
          {
            $addToSet: {
              participants: { $each: newMembers.map((m) => m._id) },
            },
          },
          { new: true }
        );
      }
    }

    // Remove members if provided
    if (
      updates.removeMembers &&
      Array.isArray(updates.removeMembers) &&
      updates.removeMembers.length > 0
    ) {
      // Don't allow removing the admin
      const safeToRemove = updates.removeMembers.filter(
        (id) => id !== session.user.id
      );

      if (safeToRemove.length > 0) {
        await Chat.findByIdAndUpdate(
          groupId,
          { $pull: { participants: { $in: safeToRemove } } },
          { new: true }
        );
      }
    }

    // Update other allowed fields
    if (Object.keys(allowedUpdates).length > 0) {
      await Chat.findByIdAndUpdate(groupId, allowedUpdates, { new: true });
    }

    // Get updated group
    const updatedGroup = await Chat.findById(groupId)
      .populate("participants", "name avatar status isOnline")
      .populate("groupAdmin", "name avatar");

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Group update error:", error);
    return NextResponse.json(
      { error: "Server error during group update" },
      { status: 500 }
    );
  }
}

// Leave or delete group
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupId = params.id;

    // Connect to database
    await connectDB();

    // Get group
    const group = await Chat.findOne({
      _id: groupId,
      isGroup: true,
      participants: session.user.id,
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if user is admin
    const isAdmin = group.groupAdmin.toString() === session.user.id;

    if (isAdmin) {
      // Admin is deleting the group
      await Chat.findByIdAndDelete(groupId);
      return NextResponse.json({ message: "Group deleted successfully" });
    } else {
      // Regular member is leaving
      await Chat.findByIdAndUpdate(
        groupId,
        { $pull: { participants: session.user.id } },
        { new: true }
      );
      return NextResponse.json({ message: "Left group successfully" });
    }
  } catch (error) {
    console.error("Group delete/leave error:", error);
    return NextResponse.json(
      { error: "Server error during group operation" },
      { status: 500 }
    );
  }
}

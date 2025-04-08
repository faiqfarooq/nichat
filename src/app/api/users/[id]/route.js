import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get user profile
export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;

    // Connect to database
    await connectDB();

    // Get user
    const user = await User.findById(userId).select("-password -blockedUsers");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the requested user has blocked the current user
    if (user.blockedUsers && user.blockedUsers.includes(session.user.id)) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check privacy settings
    if (user.isPrivate && user._id.toString() !== session.user.id) {
      // If private, check if in contacts
      const currentUser = await User.findById(session.user.id);

      if (!currentUser.contacts.includes(user._id)) {
        // Return limited info
        return NextResponse.json({
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          isPrivate: true,
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User profile error:", error);
    return NextResponse.json(
      { error: "Server error fetching user profile" },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PATCH(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;

    // Only allow users to update their own profile
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      );
    }

    const updates = await request.json();

    // Connect to database
    await connectDB();

    // Filter allowed updates
    const allowedUpdates = {};
    if (updates.name) allowedUpdates.name = updates.name;
    if (updates.avatar) allowedUpdates.avatar = updates.avatar;
    if (updates.status) allowedUpdates.status = updates.status;
    if (typeof updates.isPrivate === "boolean")
      allowedUpdates.isPrivate = updates.isPrivate;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, allowedUpdates, {
      new: true,
      runValidators: true,
    }).select("-password -blockedUsers");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Server error during profile update" },
      { status: 500 }
    );
  }
}

// Manage contacts and blocked users
export async function POST(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id; // User to add/remove as contact or block/unblock
    const { action } = await request.json(); // 'addContact', 'removeContact', 'block', 'unblock'

    if (!["addContact", "removeContact", "block", "unblock"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Check if target user exists
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get current user
    const currentUser = await User.findById(session.user.id);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    // Handle different actions
    let updateOperation;
    let message;

    switch (action) {
      case "addContact":
        updateOperation = { $addToSet: { contacts: userId } };
        message = "Contact added successfully";
        break;
      case "removeContact":
        updateOperation = { $pull: { contacts: userId } };
        message = "Contact removed successfully";
        break;
      case "block":
        updateOperation = {
          $addToSet: { blockedUsers: userId },
          $pull: { contacts: userId }, // Remove from contacts if blocked
        };
        message = "User blocked successfully";
        break;
      case "unblock":
        updateOperation = { $pull: { blockedUsers: userId } };
        message = "User unblocked successfully";
        break;
    }

    // Update user
    await User.findByIdAndUpdate(session.user.id, updateOperation);

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Contact/block action error:", error);
    return NextResponse.json(
      { error: "Server error during operation" },
      { status: 500 }
    );
  }
}

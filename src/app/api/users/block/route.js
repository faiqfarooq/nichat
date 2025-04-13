import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb";
import mongoose from 'mongoose';

// Handler for blocking a user
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request body
    const { userId } = await request.json();

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userToBlock = await User.findById(userId);
    if (!userToBlock) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if trying to block self
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot block yourself" },
        { status: 400 }
      );
    }

    // Update current user's blocked users list
    const currentUser = await User.findById(session.user.id);
    
    // Check if user is already blocked
    if (currentUser.blockedUsers.includes(userId)) {
      return NextResponse.json(
        { error: "User is already blocked" },
        { status: 400 }
      );
    }

    // Add user to blocked list
    currentUser.blockedUsers.push(userId);
    await currentUser.save();

    // Return success response
    return NextResponse.json({
      message: "User blocked successfully",
      blockedUserId: userId
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    return NextResponse.json(
      { error: "Server error while blocking user" },
      { status: 500 }
    );
  }
}

// Handler for unblocking a user
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

    // Get user ID from URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Update current user's blocked users list
    const currentUser = await User.findById(session.user.id);
    
    // Check if user is actually blocked
    if (!currentUser.blockedUsers.includes(userId)) {
      return NextResponse.json(
        { error: "User is not in your blocked list" },
        { status: 400 }
      );
    }

    // Remove user from blocked list
    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      id => id.toString() !== userId
    );
    await currentUser.save();

    // Return success response
    return NextResponse.json({
      message: "User unblocked successfully",
      unblockedUserId: userId
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    return NextResponse.json(
      { error: "Server error while unblocking user" },
      { status: 500 }
    );
  }
}

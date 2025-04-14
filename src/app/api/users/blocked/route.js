import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb";

// Handler for getting blocked users
export async function GET(request) {
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

    // Get current user with populated blocked users
    const currentUser = await User.findById(session.user.id)
      .populate('blockedUsers', 'name email avatar');
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return blocked users
    return NextResponse.json({
      blockedUsers: currentUser.blockedUsers || []
    });
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    return NextResponse.json(
      { error: "Server error while fetching blocked users" },
      { status: 500 }
    );
  }
}

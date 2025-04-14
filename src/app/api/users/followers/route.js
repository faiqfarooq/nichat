import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get followers for the current user
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get current user with populated followers
    let currentUser;
    try {
      currentUser = await User.findById(session.user.id)
        .select("followers")
        .lean();

      if (!currentUser) {
        console.error(`User with ID ${session.user.id} not found`);
        // Return empty array instead of error
        return NextResponse.json([]);
      }
    } catch (error) {
      console.error(`Error finding user with ID ${session.user.id}:`, error);
      // Return empty array instead of error
      return NextResponse.json([]);
    }

    // If no followers, return empty array
    if (!currentUser.followers || currentUser.followers.length === 0) {
      return NextResponse.json([]);
    }

    // Get details of followers
    const followers = await User.find({
      _id: { $in: currentUser.followers }
    }).select("_id name email avatar status isOnline lastSeen");

    return NextResponse.json(followers);
  } catch (error) {
    console.error("Followers error:", error);
    return NextResponse.json(
      { error: "Server error fetching followers" },
      { status: 500 }
    );
  }
}

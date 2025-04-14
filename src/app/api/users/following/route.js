import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get users that the current user is following
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get current user with contacts
    let currentUser;
    try {
      currentUser = await User.findById(session.user.id)
        .select("contacts")
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

    // If no contacts, return empty array
    if (!currentUser.contacts || currentUser.contacts.length === 0) {
      return NextResponse.json([]);
    }

    // Get details of contacts
    const following = await User.find({
      _id: { $in: currentUser.contacts }
    }).select("_id name email avatar status isOnline lastSeen");

    return NextResponse.json(following);
  } catch (error) {
    console.error("Following error:", error);
    return NextResponse.json(
      { error: "Server error fetching following users" },
      { status: 500 }
    );
  }
}

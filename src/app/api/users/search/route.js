// src/api/users/search/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const suggested = searchParams.get("suggested") === "true";

    // Connect to database
    await connectDB();

    // If suggested=true, return suggested users
    if (suggested) {
      // Find users who are not the current user, not blocked by the current user,
      // and are either public or already in the user's contacts if private
      const suggestedUsers = await User.find({
        $and: [
          { _id: { $ne: session.user.id } },
          { blockedUsers: { $ne: session.user.id } },
          {
            $or: [
              { isPrivate: false },
              { isPrivate: true, contacts: session.user.id },
            ],
          },
        ],
      })
        .select("_id name email avatar status isOnline lastSeen isPrivate")
        .limit(10); // Limit to 10 suggested users

      return NextResponse.json(suggestedUsers);
    }

    // Regular search requires a query
    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }


    // Search users by name or email
    // Exclude current user and users who have blocked the current user
    const users = await User.find({
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
        { _id: { $ne: session.user.id } },
        { blockedUsers: { $ne: session.user.id } },
        // Only include private users if they are in the user's contacts
        {
          $or: [
            { isPrivate: false },
            { isPrivate: true, contacts: session.user.id },
          ],
        },
      ],
    }).select("_id name email avatar status isOnline lastSeen isPrivate");

    return NextResponse.json(users);
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Server error during search" },
      { status: 500 }
    );
  }
}

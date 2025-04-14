import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get notifications for the current user
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get current user with notifications
    let currentUser;
    try {
      currentUser = await User.findById(session.user.id)
        .select("notifications")
        .populate({
          path: 'notifications.from',
          select: '_id name avatar'
        })
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

    // If no notifications, return empty array
    if (!currentUser.notifications || currentUser.notifications.length === 0) {
      return NextResponse.json([]);
    }

    // Sort notifications by date (newest first)
    const sortedNotifications = currentUser.notifications.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return NextResponse.json(sortedNotifications);
  } catch (error) {
    console.error("Notifications error:", error);
    return NextResponse.json(
      { error: "Server error fetching notifications" },
      { status: 500 }
    );
  }
}

// Mark notifications as read
export async function PATCH(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationIds } = await request.json();

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: "Invalid notification IDs" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Update notifications to mark as read
    await User.updateOne(
      { _id: session.user.id },
      { $set: { "notifications.$[elem].read": true } },
      { 
        arrayFilters: [{ "_id": { $in: notificationIds } }],
        multi: true 
      }
    );

    return NextResponse.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Mark notifications error:", error);
    return NextResponse.json(
      { error: "Server error marking notifications as read" },
      { status: 500 }
    );
  }
}

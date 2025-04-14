import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";

// Handler for updating user preferences
export async function PATCH(request) {
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

    // Get request body
    const body = await request.json();
    const { chatBackgroundColor } = body;

    // Validate input
    if (!chatBackgroundColor) {
      return NextResponse.json(
        { error: "Chat background color is required" },
        { status: 400 }
      );
    }

    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { 
        $set: { 
          "preferences.chatBackgroundColor": chatBackgroundColor 
        } 
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: "Preferences updated successfully",
      preferences: {
        chatBackgroundColor: updatedUser.preferences?.chatBackgroundColor || "#121212"
      }
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

// Handler for getting user preferences
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

    // Get user preferences
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return preferences
    return NextResponse.json({
      preferences: {
        chatBackgroundColor: user.preferences?.chatBackgroundColor || "#121212"
      }
    });
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return NextResponse.json(
      { error: "Failed to get preferences" },
      { status: 500 }
    );
  }
}

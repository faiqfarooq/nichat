import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb";

// Handler for getting contacts
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

    // Get current user with populated contacts
    const currentUser = await User.findById(session.user.id)
      .populate('contacts', 'name email avatar');
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return contacts
    return NextResponse.json({
      contacts: currentUser.contacts || []
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Server error while fetching contacts" },
      { status: 500 }
    );
  }
}

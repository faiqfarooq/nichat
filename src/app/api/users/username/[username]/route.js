// src/app/api/users/username/[username]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by username
    const user = await User.findOne({ username: username.toLowerCase() }).select(
      "-password -blockedUsers -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if the user is private and not in the current user's contacts
    if (user.isPrivate && !user.contacts.includes(session.user.id) && user._id.toString() !== session.user.id) {
      // Return limited profile for private users
      return NextResponse.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        isPrivate: true,
        isVerified: user.isVerified,
      });
    }

    // Check if the user has blocked the current user
    if (user.blockedUsers && user.blockedUsers.includes(session.user.id)) {
      return NextResponse.json(
        { error: "You cannot view this profile" },
        { status: 403 }
      );
    }

    // Return full profile for public users or if the user is in contacts
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return NextResponse.json(
      { error: "Server error while fetching user" },
      { status: 500 }
    );
  }
}

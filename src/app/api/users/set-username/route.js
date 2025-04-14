// src/app/api/users/set-username/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";
import { corsMiddleware } from "@/lib/corsMiddleware";

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request) {
  const response = new Response(null, { status: 204 });
  return corsMiddleware(request, response);
}

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return corsMiddleware(request, response);
    }

    // Get request body
    const { username } = await request.json();

    // Validate username
    if (!username) {
      const response = NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
      return corsMiddleware(request, response);
    }

    // Username must be 3-20 characters and only contain letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      const response = NextResponse.json(
        { error: "Username must be 3-20 characters and can only contain letters, numbers, and underscores" },
        { status: 400 }
      );
      return corsMiddleware(request, response);
    }

    // Connect to database
    await connectDB();

    // Check if username is already taken
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser && existingUser._id.toString() !== session.user.id) {
      const response = NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
      return corsMiddleware(request, response);
    }

    // Update user's username
    const user = await User.findById(session.user.id);
    if (!user) {
      const response = NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
      return corsMiddleware(request, response);
    }

    // Update username and set needsUsername to false
    user.username = username.toLowerCase();
    user.needsUsername = false;
    await user.save();

    const response = NextResponse.json({
      message: "Username set successfully",
      username: user.username,
    });
    return corsMiddleware(request, response);
  } catch (error) {
    console.error("Error setting username:", error);
    const response = NextResponse.json(
      { error: "Server error while setting username" },
      { status: 500 }
    );
    return corsMiddleware(request, response);
  }
}

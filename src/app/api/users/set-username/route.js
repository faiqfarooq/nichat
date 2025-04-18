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
  console.log("Set username API route called");
  
  try {
    // Check authentication
    console.log("Getting server session...");
    const session = await getServerSession(authOptions);
    console.log("Session:", session ? "Session exists" : "No session");
    
    if (session?.user) {
      console.log("User ID from session:", session.user.id);
    }

    if (!session) {
      console.log("Unauthorized - No session");
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return corsMiddleware(request, response);
    }

    // Get request body
    console.log("Parsing request body...");
    const body = await request.json();
    const { username } = body;
    console.log("Username from request:", username);

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
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected");

    // Check if username is already taken
    console.log("Checking if username is already taken...");
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    console.log("Existing user with same username:", existingUser ? "Found" : "Not found");
    
    if (existingUser && existingUser._id.toString() !== session.user.id) {
      console.log("Username already taken by another user");
      const response = NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
      return corsMiddleware(request, response);
    }

    // Update user's username
    console.log("Finding user by ID:", session.user.id);
    const user = await User.findById(session.user.id);
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      console.log("User not found in database");
      const response = NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
      return corsMiddleware(request, response);
    }

    // Update username and set needsUsername to false
    console.log("Previous username:", user.username);
    console.log("Previous needsUsername flag:", user.needsUsername);
    
    user.username = username.toLowerCase();
    user.needsUsername = false;
    
    console.log("Saving user with new username:", user.username);
    console.log("New needsUsername flag:", user.needsUsername);
    
    await user.save();
    console.log("User saved successfully");

    console.log("Preparing success response");
    const response = NextResponse.json({
      message: "Username set successfully",
      username: user.username,
      needsUsername: user.needsUsername
    });
    
    console.log("Applying CORS middleware");
    return corsMiddleware(request, response);
  } catch (error) {
    console.error("Error setting username:", error);
    console.error("Error stack:", error.stack);
    
    const response = NextResponse.json(
      { error: "Server error while setting username", details: error.message },
      { status: 500 }
    );
    return corsMiddleware(request, response);
  }
}

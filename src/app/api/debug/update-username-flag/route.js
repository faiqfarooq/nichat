// src/app/api/debug/update-username-flag/route.js
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
  console.log("Debug update username flag API route called");
  
  try {
    // Check authentication
    console.log("Getting server session...");
    const session = await getServerSession(authOptions);
    console.log("Session:", session ? "Session exists" : "No session");
    
    if (!session) {
      console.log("Unauthorized - No session");
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return corsMiddleware(request, response);
    }
    
    if (!session.user?.id) {
      console.log("Unauthorized - No user ID in session");
      const response = NextResponse.json({ error: "Unauthorized - No user ID" }, { status: 401 });
      return corsMiddleware(request, response);
    }
    
    console.log("User ID from session:", session.user.id);
    
    // Get request body
    console.log("Parsing request body...");
    const body = await request.json();
    const { username, needsUsername } = body;
    console.log("Request body:", { username, needsUsername });
    
    // Connect to database
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected");
    
    // Get user from database
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
    
    // Update user
    console.log("Previous username:", user.username);
    console.log("Previous needsUsername flag:", user.needsUsername);
    
    // Only update if values are provided
    if (username !== undefined) {
      user.username = username.toLowerCase();
    }
    
    if (needsUsername !== undefined) {
      user.needsUsername = needsUsername;
    }
    
    console.log("New username:", user.username);
    console.log("New needsUsername flag:", user.needsUsername);
    
    // Save user
    await user.save();
    console.log("User saved successfully");
    
    // Return updated user data
    const response = NextResponse.json({
      message: "User updated successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        needsUsername: user.needsUsername,
        isVerified: user.isVerified,
        updatedAt: user.updatedAt
      }
    });
    
    return corsMiddleware(request, response);
  } catch (error) {
    console.error("Error updating user:", error);
    console.error("Error stack:", error.stack);
    
    const response = NextResponse.json(
      { 
        error: "Server error while updating user", 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
    
    return corsMiddleware(request, response);
  }
}

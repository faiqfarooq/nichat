// src/app/api/debug/session/route.js
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

export async function GET(request) {
  console.log("Debug session API route called");
  
  try {
    // Check authentication
    console.log("Getting server session...");
    const session = await getServerSession(authOptions);
    console.log("Session:", session ? "Session exists" : "No session");
    
    let userData = null;
    let dbConnectionStatus = "Not tested";
    
    if (session?.user?.id) {
      console.log("User ID from session:", session.user.id);
      
      try {
        // Connect to database
        console.log("Connecting to database...");
        await connectDB();
        console.log("Database connected");
        dbConnectionStatus = "Connected";
        
        // Get user from database
        console.log("Finding user by ID:", session.user.id);
        const user = await User.findById(session.user.id);
        console.log("User found:", user ? "Yes" : "No");
        
        if (user) {
          userData = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            username: user.username,
            needsUsername: user.needsUsername,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          };
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        dbConnectionStatus = `Error: ${dbError.message}`;
      }
    }
    
    // Return session and user data
    const response = NextResponse.json({
      session: session ? {
        user: {
          ...session.user,
          // Don't include sensitive data
          password: undefined
        },
        expires: session.expires
      } : null,
      userData,
      dbConnectionStatus,
      serverTime: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
    
    return corsMiddleware(request, response);
  } catch (error) {
    console.error("Error in debug session route:", error);
    
    const response = NextResponse.json(
      { 
        error: "Server error", 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
    
    return corsMiddleware(request, response);
  }
}

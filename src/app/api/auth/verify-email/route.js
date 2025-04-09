import { NextResponse } from "next/server";
import User from "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb";

export async function GET(request) {
  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Find user with the token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user to verified and remove token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Determine the base URL for redirection
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXTAUTH_URL || 'https://nichat-self.vercel.app'
      : '';
    
    // Construct the full redirect URL
    const redirectUrl = `${baseUrl}/login?verified=true`;
    
    // Redirect to login page with success message
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Server error during email verification" },
      { status: 500 }
    );
  }
}

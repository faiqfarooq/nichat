import { NextResponse } from "next/server";
import User from "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb";
import { verifyVerificationToken } from "@/lib/token";

// This config is needed for routes that use dynamic features like headers or cookies
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

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
      verificationToken: { $exists: true },
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Verify the token
    const isValid = verifyVerificationToken(token, user.verificationToken);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Determine if this is an email change or a new account verification
    const isEmailChange = !!user.pendingEmail;

    if (isEmailChange) {
      // Update user's email with the pending email
      user.email = user.pendingEmail;
      user.pendingEmail = undefined;
    }

    // Update user to verified and remove token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Get the host from the request
    const host = request.headers.get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    
    // Construct the full redirect URL
    const redirectUrl = isEmailChange
      ? `${protocol}://${host}/settings?emailChanged=true`
      : `${protocol}://${host}/login?verified=true`;

    // Redirect to appropriate page with success message
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Server error during email verification" },
      { status: 500 }
    );
  }
}

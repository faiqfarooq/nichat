import { NextResponse } from "next/server";
import User from "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification token
    const { token, expires } = generateVerificationToken();

    // Update user with new verification token
    user.verificationToken = token;
    user.verificationTokenExpires = expires;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, token, user.name);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Server error during resend verification" },
      { status: 500 }
    );
  }
}

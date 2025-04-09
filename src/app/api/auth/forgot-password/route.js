import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { generateResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });

    // If user not found, still return success to prevent email enumeration
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json(
        { message: "If your email is registered, you will receive a password reset link" },
        { status: 200 }
      );
    }

    // Generate reset token and expiry
    const { token, hashedToken, expires } = generateResetToken();

    // Update user with reset token and expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expires;
    await user.save();

    // Send password reset email with a relative URL
    const resetUrl = `/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, user.name, resetUrl);

    return NextResponse.json(
      { message: "If your email is registered, you will receive a password reset link" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Server error during password reset" },
      { status: 500 }
    );
  }
}

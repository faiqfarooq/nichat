import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import OtpVerification from "@/lib/mongodb/models/OtpVerification";
import { sendVerificationEmailWithOTP } from "@/lib/email";

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

    // Delete any existing OTP for this user
    await OtpVerification.deleteMany({ userId: user._id });

    console.log(`Attempting to send password reset email to ${email}`);
    
    // Send verification email with OTP for password reset
    try {
      const { otp } = await sendVerificationEmailWithOTP(user.email, user.name, true);
      console.log(`Generated password reset OTP: ${otp} for user ${user.name} (${user.email})`);
      
      // Store OTP in database
      const otpExpiration = new Date();
      otpExpiration.setMinutes(otpExpiration.getMinutes() + 30); // OTP expires in 30 minutes
      
      await OtpVerification.create({
        userId: user._id,
        otp,
        expiresAt: otpExpiration,
        pendingEmail: user.email,
      });
      
      console.log(`Password reset OTP verification record created for user ${user._id}`);
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      console.error(emailError.stack);
      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "If your email is registered, you will receive a password reset link" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    console.error(error.stack);
    return NextResponse.json(
      { error: "Server error during password reset" },
      { status: 500 }
    );
  }
}

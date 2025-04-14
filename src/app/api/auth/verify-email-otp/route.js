import { NextResponse } from "next/server";
import User from "@/lib/mongodb/models/User";
import OtpVerification from "@/lib/mongodb/models/OtpVerification";
import connectDB from "@/lib/mongodb";
import { verifyOTP } from "@/lib/token";

export async function POST(request) {
  try {
    // Get request body
    const { email, otp, isPasswordReset = false } = await request.json();

    console.log(`OTP verification request received for email: ${email}, isPasswordReset: ${isPasswordReset}`);

    // Validate inputs
    if (!email || !otp) {
      console.log(`Missing required fields: email=${!!email}, otp=${!!otp}`);
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`OTP verification requested for non-existent email: ${email}`);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find OTP verification
    const verification = await OtpVerification.findOne({ 
      userId: user._id,
      pendingEmail: email
    });

    if (!verification) {
      console.log(`No OTP verification found for user: ${user._id}, email: ${email}`);
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (currentTime > verification.expiresAt) {
      console.log(`OTP expired for user: ${user._id}, email: ${email}`);
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    // For direct OTP comparison (if not hashed)
    const isValid = verification.otp === otp;
    console.log(`OTP validation result: ${isValid ? 'valid' : 'invalid'}`);
    console.log(`Expected OTP: ${verification.otp}, Received OTP: ${otp}`);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // Handle based on verification type
    if (isPasswordReset) {
      console.log(`Password reset OTP verified for user: ${user._id}`);
      // For password reset, we'll just mark the verification as valid
      // The actual password reset will happen in a separate request
      return NextResponse.json({
        message: "Verification successful. You can now reset your password.",
        verified: true,
        userId: user._id.toString()
      });
    } else {
      console.log(`Email verification OTP verified for user: ${user._id}`);
      // For email verification after registration
      // Update user to verified
      user.isVerified = true;
      await user.save();
      console.log(`User ${user._id} marked as verified`);

      // Delete the verification document
      await OtpVerification.deleteOne({ _id: verification._id });
      console.log(`OTP verification record deleted for user: ${user._id}`);

      return NextResponse.json({
        message: "Email verified successfully. You can now log in.",
        verified: true
      });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    console.error(error.stack);
    return NextResponse.json(
      { error: "Server error during verification" },
      { status: 500 }
    );
  }
}

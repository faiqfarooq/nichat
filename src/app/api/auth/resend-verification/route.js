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

    console.log(`Resend verification requested for email: ${email}`);

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Resend verification requested for non-existent email: ${email}`);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If user is already verified, no need to resend
    if (user.isVerified) {
      console.log(`Resend verification requested for already verified user: ${email}`);
      return NextResponse.json(
        { message: "Your email is already verified. You can log in." },
        { status: 200 }
      );
    }

    // Delete any existing OTP for this user
    await OtpVerification.deleteMany({ userId: user._id });

    console.log(`Attempting to send verification email to ${email}`);

    try {
      // Send verification email with OTP
      const { otp } = await sendVerificationEmailWithOTP(email, user.name);
      console.log(`Generated OTP: ${otp} for user ${user.name} (${email})`);
      
      // Store OTP in database
      const otpExpiration = new Date();
      otpExpiration.setMinutes(otpExpiration.getMinutes() + 30); // OTP expires in 30 minutes
      
      await OtpVerification.create({
        userId: user._id,
        otp,
        expiresAt: otpExpiration,
        pendingEmail: email,
      });
      
      console.log(`OTP verification record created for user ${user._id}`);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      console.error(emailError.stack);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification email sent. Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    console.error(error.stack);
    return NextResponse.json(
      { error: "Server error during resend verification" },
      { status: 500 }
    );
  }
}

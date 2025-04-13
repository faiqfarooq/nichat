import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/mongodb/models/User";
import OtpVerification from "@/lib/mongodb/models/OtpVerification";
import connectDB from "@/lib/mongodb";
import { generateOTP, verifyOTP } from "@/lib/token";
import { sendOTPEmail } from "@/lib/email";
import crypto from 'crypto';
import mongoose from 'mongoose';

// Handler for sending OTP verification for email change
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request body
    const { newEmail } = await request.json();

    // Validate input
    if (!newEmail) {
      return NextResponse.json(
        { error: "New email is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if email is already in use by another user
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 }
      );
    }

    // Get user details
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate OTP
    const { otp, hashedOTP, expires } = generateOTP();
    console.log("Generated OTP for email change:", otp);
    console.log("OTP expires at:", expires);

    // Delete any existing OTP verification for this user
    await OtpVerification.deleteMany({ userId: user._id });
    
    // Create new OTP verification document
    const otpVerification = new OtpVerification({
      userId: user._id,
      otp: hashedOTP,
      expiresAt: expires,
      pendingEmail: newEmail
    });
    
    // Save OTP verification
    await otpVerification.save();
    
    // Verify the OTP was saved correctly
    const savedVerification = await OtpVerification.findOne({ userId: user._id });
    
    console.log("OTP verification saved:", {
      exists: !!savedVerification,
      userId: savedVerification?.userId,
      pendingEmail: savedVerification?.pendingEmail,
      expiresAt: savedVerification?.expiresAt
    });

    // Send OTP email
    try {
      await sendOTPEmail(newEmail, otp, user.name, true);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: "Verification code sent. Please check your inbox to confirm the email change."
    });
  } catch (error) {
    console.error("Email change verification error:", error);
    return NextResponse.json(
      { error: "Server error during email change verification" },
      { status: 500 }
    );
  }
}

// Handler for verifying OTP and completing email change
export async function PUT(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request body
    const { otp } = await request.json();

    // Validate input
    if (!otp) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(session.user.id);
    console.log("User found:", user ? "Yes" : "No");
    console.log("User ID:", session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Find OTP verification
    const verification = await OtpVerification.findOne({ userId: user._id });
    console.log("Verification found:", verification ? "Yes" : "No");
    
    if (!verification) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }
    
    console.log("Verification data:", {
      pendingEmail: verification.pendingEmail,
      expiresAt: verification.expiresAt
    });

    // Check if OTP is expired
    const currentTime = new Date();
    const expiryTime = new Date(verification.expiresAt);
    
    console.log("Current time (ISO):", currentTime.toISOString());
    console.log("Expiry time (ISO):", expiryTime.toISOString());
    
    if (currentTime > expiryTime) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    console.log("Entered OTP:", otp);
    console.log("Stored hashed OTP:", verification.otp);
    
    const isValid = verifyOTP(otp, verification.otp);
    console.log("OTP validation result:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // Update user's email with the pending email
    const newEmail = verification.pendingEmail;
    
    // Update user using updateOne
    const updateResult = await User.updateOne(
      { _id: session.user.id },
      { $set: { email: newEmail } }
    );
    
    // Delete the verification document
    await OtpVerification.deleteOne({ _id: verification._id });
    
    console.log("Update result:", updateResult);

    // Return success response
    return NextResponse.json({
      message: "Email changed successfully",
      email: newEmail
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Server error during email verification" },
      { status: 500 }
    );
  }
}

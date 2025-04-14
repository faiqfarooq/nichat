// src/api/auth/register/route.js
import { NextResponse } from "next/server";
import User from "@/lib/mongodb/models/User";
import OtpVerification from "@/lib/mongodb/models/OtpVerification";
import connectDB from "@/lib/mongodb";
import { sendVerificationEmailWithOTP } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, username, email, password } = await request.json();

    // Validate inputs
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Name, username, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "Username must be between 3 and 20 characters" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Check if email already exists
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    // Create new user (unverified)
    const user = await User.create({
      name,
      username,
      email,
      password,
      isVerified: false,
    });

    // Send verification email with OTP
    try {
      console.log(`Attempting to send verification email to ${email}`);
      const { otp } = await sendVerificationEmailWithOTP(email, name);
      console.log(`Generated OTP: ${otp} for user ${name} (${email})`);
      
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
      // Continue with registration even if email fails
    }

    // Return success without password
    return NextResponse.json(
      {
        message: "User registered successfully. Please check your email to verify your account.",
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Server error during registration" },
      { status: 500 }
    );
  }
}

// src/api/auth/register/route.js
import { NextResponse } from "next/server";
import User from "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Generate verification token
    const { token, expires } = generateVerificationToken();

    // Create new user with verification token
    const user = await User.create({
      name,
      email,
      password,
      verificationToken: token,
      verificationTokenExpires: expires,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, token, name);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Continue with registration even if email fails
    }

    // Return success without password
    return NextResponse.json(
      {
        message: "User registered successfully. Please check your email to verify your account.",
        user: {
          id: user._id,
          name: user.name,
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

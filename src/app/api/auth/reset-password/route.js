import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import OtpVerification from "@/lib/mongodb/models/OtpVerification";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json(
        { error: "User ID and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has a verified OTP
    const verification = await OtpVerification.findOne({ 
      userId: user._id,
      pendingEmail: user.email
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the verification document
    await OtpVerification.deleteOne({ _id: verification._id });

    return NextResponse.json(
      { message: "Password has been reset successfully" },
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

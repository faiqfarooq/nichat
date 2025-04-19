import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { sendVerificationEmailWithOTP } from "@/lib/email";

// This config is needed for routes that use dynamic features like headers
export const dynamic = 'force-dynamic';

// Handler for sending invitations
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

    // Connect to database
    await connectDB();

    // Get request body
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate invitation link using the request URL
    const host = request.headers.get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const invitationLink = `${protocol}://${host}/register?invited=true&ref=${session.user.id}`;

    // Send invitation email using the available email function
    const mailOptions = {
      to: email,
      name: "New User", // Generic name for invitation
      isPasswordReset: false
    };
    
    // Use sendVerificationEmailWithOTP which is exported from email.js
    await sendVerificationEmailWithOTP(
      email,
      "New User",
      false
    );

    // Return success response
    return NextResponse.json({
      message: "Invitation sent successfully"
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}

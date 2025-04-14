import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { sendEmail } from "@/lib/email";

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

    // Generate invitation link
    const invitationLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/register?invited=true&ref=${session.user.id}`;

    // Send invitation email
    await sendEmail({
      to: email,
      subject: `${session.user.name} invited you to join nichat`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #6366f1;">nichat</h1>
          </div>
          
          <p>Hello,</p>
          
          <p><strong>${session.user.name}</strong> has invited you to join nichat, a modern messaging platform.</p>
          
          <p>Join the conversation and connect with friends and colleagues in a secure environment.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Join nichat</a>
          </div>
          
          <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
          
          <p style="word-break: break-all; color: #6366f1;">${invitationLink}</p>
          
          <p>This invitation was sent by ${session.user.name} (${session.user.email}). If you weren't expecting this invitation, you can safely ignore this email.</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} nichat. All rights reserved.</p>
          </div>
        </div>
      `
    });

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

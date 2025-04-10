import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Server as SocketIOServer } from 'socket.io';

// Access the global Socket.IO instance
let io;
try {
  io = global.io;
} catch (error) {
  console.error('Socket.IO not initialized yet');
}

// Get user profile
export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;

    // Connect to database
    await connectDB();

    // Get user
    const user = await User.findById(userId).select("-password -blockedUsers");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the requested user has blocked the current user
    if (user.blockedUsers && user.blockedUsers.includes(session.user.id)) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check privacy settings
    if (user.isPrivate && user._id.toString() !== session.user.id) {
      // If private, check if in contacts
      const currentUser = await User.findById(session.user.id);

      if (!currentUser.contacts.includes(user._id)) {
        // Return limited info
        return NextResponse.json({
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          isPrivate: true,
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User profile error:", error);
    return NextResponse.json(
      { error: "Server error fetching user profile" },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PATCH(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;

    // Only allow users to update their own profile
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      );
    }

    const updates = await request.json();

    // Connect to database
    await connectDB();

    // Filter allowed updates
    const allowedUpdates = {};
    if (updates.name) allowedUpdates.name = updates.name;
    if (updates.avatar) allowedUpdates.avatar = updates.avatar;
    if (updates.status) allowedUpdates.status = updates.status;
    if (typeof updates.isPrivate === "boolean")
      allowedUpdates.isPrivate = updates.isPrivate;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, allowedUpdates, {
      new: true,
      runValidators: true,
    }).select("-password -blockedUsers");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Server error during profile update" },
      { status: 500 }
    );
  }
}

// Manage contacts and blocked users
export async function POST(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id; // User to add/remove as contact or block/unblock
    const { action } = await request.json(); // 'addContact', 'removeContact', 'block', 'unblock', 'acceptRequest', 'rejectRequest'

    if (!["addContact", "removeContact", "block", "unblock", "acceptRequest", "rejectRequest"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Check if target user exists
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get current user
    let currentUser;
    try {
      currentUser = await User.findById(session.user.id);

      if (!currentUser) {
        console.error(`User with ID ${session.user.id} not found`);
        return NextResponse.json(
          { error: "User not found. Please try logging out and logging back in." },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error(`Error finding user with ID ${session.user.id}:`, error);
      return NextResponse.json(
        { error: "Error finding user. Please try logging out and logging back in." },
        { status: 500 }
      );
    }

    // Handle different actions
    let updateOperation;
    let targetUserUpdateOperation;
    let message;

    switch (action) {
      case "addContact":
        // If the target user is private, add to pendingRequests instead of contacts
        if (targetUser.isPrivate) {
          updateOperation = {}; // No change to current user
          targetUserUpdateOperation = { 
            $addToSet: { 
              pendingRequests: session.user.id,
              notifications: {
                type: 'request',
                from: session.user.id,
                read: false,
                createdAt: new Date()
              }
            } 
          };
          message = "Request sent successfully";
          
          // Emit socket notification if available
          if (io) {
            io.to(userId).emit('notification:request', {
              type: 'request',
              from: {
                id: session.user.id,
                name: session.user.name,
                avatar: session.user.avatar
              },
              createdAt: new Date(),
              read: false
            });
          }
        } else {
          // For public profiles, add directly to contacts and followers
          updateOperation = { $addToSet: { contacts: userId } };
          targetUserUpdateOperation = { 
            $addToSet: { 
              followers: session.user.id,
              contacts: session.user.id, // Also add to contacts list
              notifications: {
                type: 'follow',
                from: session.user.id,
                read: false,
                createdAt: new Date()
              }
            } 
          };
          message = "Contact added successfully";
          
          // Emit socket notification if available
          if (io) {
            io.to(userId).emit('notification:follow', {
              type: 'follow',
              from: {
                id: session.user.id,
                name: session.user.name,
                avatar: session.user.avatar
              },
              createdAt: new Date(),
              read: false
            });
          }
        }
        break;
      case "removeContact":
        updateOperation = { $pull: { contacts: userId } };
        targetUserUpdateOperation = { 
          $pull: { 
            followers: session.user.id,
            contacts: session.user.id 
          } 
        };
        message = "Contact removed successfully";
        break;
      case "block":
        updateOperation = {
          $addToSet: { blockedUsers: userId },
          $pull: { contacts: userId, pendingRequests: userId }, // Remove from contacts and pending requests if blocked
        };
        targetUserUpdateOperation = { 
          $pull: { 
            followers: session.user.id,
            contacts: session.user.id 
          } 
        };
        message = "User blocked successfully";
        break;
      case "unblock":
        updateOperation = { $pull: { blockedUsers: userId } };
        targetUserUpdateOperation = null;
        message = "User unblocked successfully";
        break;
      case "acceptRequest":
        // Add to contacts and remove from pending requests
        updateOperation = { 
          $addToSet: { contacts: userId },
          $pull: { pendingRequests: userId }
        };
        // Also add current user to target user's contacts and notify them
        targetUserUpdateOperation = { 
          $addToSet: { 
            contacts: session.user.id,
            notifications: {
              type: 'accept',
              from: session.user.id,
              read: false,
              createdAt: new Date()
            }
          } 
        };
        message = "Request accepted";
        
        // Emit socket notification if available
        if (io) {
          io.to(userId).emit('notification:accept', {
            type: 'accept',
            from: {
              id: session.user.id,
              name: session.user.name,
              avatar: session.user.avatar
            },
            createdAt: new Date(),
            read: false
          });
        }
        break;
      case "rejectRequest":
        // Just remove from pending requests
        updateOperation = { $pull: { pendingRequests: userId } };
        targetUserUpdateOperation = null;
        message = "Request rejected";
        break;
    }

    // Update current user
    if (updateOperation && Object.keys(updateOperation).length > 0) {
      await User.findByIdAndUpdate(session.user.id, updateOperation);
    }
    
    // Update target user if needed
    if (targetUserUpdateOperation) {
      await User.findByIdAndUpdate(userId, targetUserUpdateOperation);
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Contact/block action error:", error);
    return NextResponse.json(
      { error: "Server error during operation" },
      { status: 500 }
    );
  }
}

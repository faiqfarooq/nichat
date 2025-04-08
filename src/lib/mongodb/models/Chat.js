// src/lib/mongodb/models/Chat.js
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    // Group-specific fields
    name: {
      type: String,
      trim: true,
      // Required only if it's a group chat
      required: function () {
        return this.isGroup;
      },
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Required only if it's a group chat
      required: function () {
        return this.isGroup;
      },
    },
    groupAvatar: {
      type: String,
      default: "/assets/images/default-avatar.png",
    },
    // For regular one-on-one chats, we don't need these fields
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCount: {
      // Map of user IDs to unread count
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for quick participant lookup
ChatSchema.index({ participants: 1 });

// Don't recreate the model if it already exists
const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;

// src/lib/mongodb/models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Message content is required'],
    },
    contentType: {
      type: String,
      enum: ['text', 'image', 'audio', 'video', 'file'],
      default: 'text',
    },
    fileUrl: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
MessageSchema.index({ chat: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });

// Clean message content if deleted
MessageSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

// Don't recreate the model if it already exists
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default Message;

import mongoose from 'mongoose';

const OtpVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    pendingEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 1800, // Automatically delete document after 30 minutes
    },
  },
  {
    timestamps: true,
  }
);

// Don't recreate the model if it already exists
const OtpVerification = mongoose.models.OtpVerification || mongoose.model('OtpVerification', OtpVerificationSchema);

export default OtpVerification;

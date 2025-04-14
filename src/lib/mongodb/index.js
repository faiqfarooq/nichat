// src/lib/mongodb/index.js
import mongoose from 'mongoose';
import User from './models/User';
import Message from './models/Message';
import Chat from './models/Chat';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  console.log("Connecting to MongoDB...");
  console.log(`MongoDB URI: ${MONGODB_URI.substring(0, 20)}...`); // Only show part of the URI for security
  
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new MongoDB connection");
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw error;
      });
  } else {
    console.log("Using existing MongoDB connection promise");
  }

  try {
    console.log("Awaiting MongoDB connection");
    cached.conn = await cached.promise;
    console.log("MongoDB connection established");
    
    // Log connection status
    console.log(`MongoDB connection state: ${mongoose.connection.readyState}`);
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    // Test the connection by counting users
    const userCount = await User.countDocuments();
    console.log(`Connected to MongoDB - User count: ${userCount}`);
  } catch (e) {
    console.error("Error establishing MongoDB connection:", e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

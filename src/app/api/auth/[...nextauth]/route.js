// src/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import User from "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb";
import { getApiBaseUrl } from "@/lib/apiUtils";

/**
 * NextAuth configuration
 */
// Determine the base URL for NextAuth
const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXTAUTH_URL || "https://nichat.ninjacodex.co"
    : process.env.NEXTAUTH_URL;

// Simple function to log authentication events
function logAuthEvent(event, data) {
  console.log(`[NextAuth] ${event}:`, data);
}

export const authOptions = {
  // Set the base URL for NextAuth
  baseUrl,
  // Debug mode for development
  debug: process.env.NODE_ENV === "development",
  // Force redirect after sign in
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login", // Error code passed in query string as ?error=
    verifyRequest: "/verification-required", // (used for check email message)
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(
          "Authorize function called with credentials:",
          credentials
            ? JSON.stringify({
                email: credentials.email,
                password: "***REDACTED***",
              })
            : "no credentials"
        );

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing required credentials");
          throw new Error("Email and password are required");
        }

        try {
          await connectDB();
          console.log("Connected to database");

          // Log all users in the database for debugging
          const allUsers = await User.find({});
          console.log(`Total users in database: ${allUsers.length}`);
          console.log(
            `All user emails: ${allUsers.map((u) => u.email).join(", ")}`
          );

          // Find user by email - use case-insensitive search
          const user = await User.findOne({
            email: { $regex: new RegExp(`^${credentials.email}$`, "i") },
          }).select("+password");

          console.log(`User found: ${user ? "yes" : "no"}`);

          if (!user) {
            console.log(`No user found with email: ${credentials.email}`);

            // Try finding with exact match as fallback
            const exactUser = await User.findOne({
              email: credentials.email,
            }).select("+password");
            console.log(
              `User found with exact match: ${exactUser ? "yes" : "no"}`
            );

            if (!exactUser) {
              throw new Error("Invalid email or password");
            } else {
              console.log(`Found user with exact match: ${exactUser.email}`);
              return {
                id: exactUser._id.toString(),
                name: exactUser.name,
                username: exactUser.username,
                email: exactUser.email,
                avatar: exactUser.avatar,
                isVerified: exactUser.isVerified,
              };
            }
          }

          // Check if password matches
          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log(`Password match: ${isPasswordMatch ? "yes" : "no"}`);

          if (!isPasswordMatch) {
            console.log("Password does not match");
            throw new Error("Invalid email or password");
          }

          // Check if user is verified
          console.log(`User verified: ${user.isVerified ? "yes" : "no"}`);

          if (!user.isVerified) {
            console.log(`User ${user._id} is not verified`);

            // Set email for resend verification
            const emailToResend = user.email;

            throw new Error(
              "Please verify your email before logging in. Check your inbox for the verification link."
            );
          }

          // Update user online status
          await User.findByIdAndUpdate(user._id, { isOnline: true });
          console.log(`User ${user._id} marked as online`);

          console.log(`Returning user data for ${user._id}`);
          return {
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            isVerified: user.isVerified,
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Simple redirect logic
      logAuthEvent('redirect', { url, baseUrl });
      
      // If it's a relative URL or from the same site, allow it
      if (url.startsWith('/') || url.startsWith(baseUrl)) {
        return url;
      }
      
      // Default to dashboard
      return '/dashboard';
    },
    
    async jwt({ token, user, account }) {
      console.log(
        "JWT callback called with user:",
        user ? JSON.stringify(user) : "no user"
      );
      console.log(
        "JWT callback called with account:",
        account ? JSON.stringify(account) : "no account"
      );
      console.log(
        "JWT callback called with token:",
        token ? JSON.stringify(token) : "no token"
      );

      if (user) {
        token.id = user.id;
        token.avatar = user.avatar;

        // Add username to token if present
        if (user.username) {
          token.username = user.username;
          console.log(`Setting username from user: ${user.username}`);
        }

        // Add isVerified to token if it's from credentials provider
        if (user.isVerified !== undefined) {
          token.isVerified = user.isVerified;
          console.log(`Setting isVerified from user: ${user.isVerified}`);
        } else {
          // For OAuth providers, users are automatically verified
          token.isVerified = true;
          console.log("Setting isVerified to true for OAuth provider");
        }

        // Add needsUsername flag if present
        if (user.needsUsername) {
          token.needsUsername = true;
          console.log("Setting needsUsername to true");
        }
      }

      // If we already have a token, check if the user needs to set a username
      if (token.id && !token.needsUsernameChecked) {
        try {
          await connectDB();
          const dbUser = await User.findById(token.id);
          console.log(`Found user in database: ${dbUser ? "yes" : "no"}`);
          if (dbUser) {
            console.log(`User isVerified: ${dbUser.isVerified}`);
            console.log(`User needsUsername: ${dbUser.needsUsername}`);
            console.log(`User username: ${dbUser.username}`);

            // Always update the isVerified flag from the database
            token.isVerified = dbUser.isVerified;

            // Always update the username from the database
            token.username = dbUser.username;

            if (dbUser.needsUsername) {
              token.needsUsername = true;
            }
          }
          token.needsUsernameChecked = true;
        } catch (error) {
          console.error("Error checking if user needs username:", error);
        }
      }

      console.log("Final token:", JSON.stringify(token, null, 2));
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.avatar = token.avatar;
        session.user.isVerified = token.isVerified;

        // Add username to session if present in token
        if (token.username) {
          session.user.username = token.username;
        }

        // Add needsUsername flag to session if present in token
        if (token.needsUsername) {
          session.user.needsUsername = true;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectDB();

        // Check if user exists
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create new user with verified status (Google OAuth users are considered verified)
          // But mark that they need to set a username
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            avatar: user.image,
            // Generate a temporary username (will be changed by user)
            username: `user_${Math.random().toString(36).substring(2, 10)}`,
            password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10), // Generate random password
            isOnline: true,
            isVerified: true, // Google OAuth users are automatically verified
            needsUsername: true, // Flag to indicate username needs to be set
          });

          // Add user details to the user object
          user.id = newUser._id.toString();
          user.username = newUser.username;
          user.needsUsername = true;
        } else {
          // Check if the user needs to set a username
          if (!existingUser.username) {
            // Update the user to set needsUsername flag
            await User.findByIdAndUpdate(existingUser._id, {
              isOnline: true,
              needsUsername: true,
              // Set a temporary username if none exists
              username:
                existingUser.username ||
                `user_${Math.random().toString(36).substring(2, 10)}`,
            });

            // Add the needsUsername flag to the user object
            user.needsUsername = true;
          } else {
            // Just update online status
            await User.findByIdAndUpdate(existingUser._id, { isOnline: true });
          }

          // Add user details to the user object
          user.id = existingUser._id.toString();
          user.username = existingUser.username;
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `${
        process.env.NODE_ENV === "production" ? "__Secure-" : ""
      }next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // Set a longer maxAge to prevent early expiration
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      },
    },
  },
  // Enable CSRF protection
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// src/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import User from "@/lib/mongodb/models/User";
import connectDB from "@/lib/mongodb";

/**
 * NextAuth configuration
 */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Check if password matches
        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error("Invalid email or password");
        }
        
        // Check if user is verified
        if (!user.isVerified) {
          throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
        }

        // Update user online status
        await User.findByIdAndUpdate(user._id, { isOnline: true });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isVerified: user.isVerified,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.avatar = user.avatar;
        
        // Add isVerified to token if it's from credentials provider
        if (user.isVerified !== undefined) {
          token.isVerified = user.isVerified;
        } else {
          // For OAuth providers, users are automatically verified
          token.isVerified = true;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.avatar = token.avatar;
        session.user.isVerified = token.isVerified;
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
          await User.create({
            name: user.name,
            email: user.email,
            avatar: user.image,
            password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10), // Generate random password
            isOnline: true,
            isVerified: true, // Google OAuth users are automatically verified
          });
        } else {
          // Update online status
          await User.findByIdAndUpdate(existingUser._id, { isOnline: true });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

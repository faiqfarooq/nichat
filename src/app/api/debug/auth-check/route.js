// src/app/api/debug/auth-check/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../../auth/[...nextauth]/route";
import { corsMiddleware } from "@/lib/corsMiddleware";

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request) {
  const response = new Response(null, { status: 204 });
  return corsMiddleware(request, response);
}

export async function GET(request) {
  console.log("Debug auth-check API route called");
  
  try {
    // Get the session using getServerSession
    console.log("Getting server session...");
    const session = await getServerSession(authOptions);
    console.log("Session:", session ? "Session exists" : "No session");
    
    // Get the JWT token directly
    console.log("Getting JWT token...");
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production"
    });
    console.log("Token:", token ? "Token exists" : "No token");
    
    // Get cookies for debugging
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key) {
        // Mask the actual value for security
        acc[key] = value ? '***MASKED***' : 'undefined';
      }
      return acc;
    }, {});
    
    // Check for the session token cookie specifically
    const hasSessionCookie = cookieHeader.includes('next-auth.session-token') || 
                            cookieHeader.includes('__Secure-next-auth.session-token');
    
    // Return detailed auth information
    const response = NextResponse.json({
      authenticated: !!session,
      sessionExists: !!session,
      tokenExists: !!token,
      hasSessionCookie,
      cookieKeys: Object.keys(cookies),
      headers: {
        // Include relevant headers for debugging
        userAgent: request.headers.get('user-agent'),
        host: request.headers.get('host'),
        referer: request.headers.get('referer'),
        // Don't include the actual cookie values
      },
      serverTime: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      // Include session and token data (without sensitive information)
      sessionData: session ? {
        user: {
          ...session.user,
          // Don't include sensitive data
          password: undefined
        },
        expires: session.expires
      } : null,
      tokenData: token ? {
        ...token,
        // Don't include sensitive data
        sub: '***MASKED***',
        iat: token.iat,
        exp: token.exp,
        jti: '***MASKED***'
      } : null
    });
    
    return corsMiddleware(request, response);
  } catch (error) {
    console.error("Error in debug auth-check route:", error);
    
    const response = NextResponse.json(
      { 
        error: "Server error", 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
    
    return corsMiddleware(request, response);
  }
}

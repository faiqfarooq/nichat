// src/app/api/debug/test-auth/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../../auth/[...nextauth]/route";
import { corsMiddleware } from "@/lib/corsMiddleware";
import { isProtectedRoute, shouldSkipAuthCheck } from "@/lib/authUtils";

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request) {
  const response = new Response(null, { status: 204 });
  return corsMiddleware(request, response);
}

export async function GET(request) {
  console.log("Debug test-auth API route called");
  
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
      secureCookie: process.env.NODE_ENV === "production",
      cookieName: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
    });
    console.log("Token:", token ? "Token exists" : "No token");
    
    // Get cookies for debugging
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name] = cookie.trim().split('=');
      if (name) {
        // Mask the actual value for security
        acc[name] = '***MASKED***';
      }
      return acc;
    }, {});
    
    // Test route protection logic
    const url = new URL(request.url);
    const testRoutes = [
      "/",
      "/login",
      "/dashboard",
      "/chat",
      "/group",
      "/api/auth/signin",
      "/debug/auth",
      "/api/debug/test-auth"
    ];
    
    const routeTests = testRoutes.map(route => ({
      route,
      isProtected: isProtectedRoute(route),
      shouldSkipAuth: shouldSkipAuthCheck(route),
      wouldBeProtected: isProtectedRoute(route) && !shouldSkipAuthCheck(route)
    }));
    
    // Return detailed auth information
    const response = NextResponse.json({
      authenticated: !!session,
      sessionExists: !!session,
      tokenExists: !!token,
      cookieKeys: Object.keys(cookies),
      routeTests,
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
    console.error("Error in debug test-auth route:", error);
    
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

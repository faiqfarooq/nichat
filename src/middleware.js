import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isProtectedRoute, shouldSkipAuthCheck } from "./lib/authUtils";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  console.log(`Middleware processing: ${pathname}`);

  // Skip middleware for non-protected routes
  if (!isProtectedRoute(pathname) || shouldSkipAuthCheck(pathname)) {
    console.log(`Skipping middleware for non-protected route: ${pathname}`);
    return NextResponse.next();
  }
  
  console.log(`Protected route detected: ${pathname}`);
  // Get the session token with secure options
  console.log(`Middleware: Checking auth for ${pathname}`);
  
  let token;
  try {
    // Add a short timeout to ensure cookie processing is complete
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
      cookieName: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
    });
    
    console.log(`Middleware: Token found: ${!!token}`);
    if (token) {
      console.log(`Middleware: Token user: ${token.email}, verified: ${token.isVerified}`);
      
      // Add debug info to response headers (only in development)
      if (process.env.NODE_ENV === "development") {
        const response = NextResponse.next();
        response.headers.set("x-auth-status", "authenticated");
        response.headers.set("x-auth-user", token.email || "unknown");
        return response;
      }
      
      // If user is not verified, redirect to a verification required page
      if (token.isVerified === false) {
        // Log token details for debugging
        console.log("User not verified, redirecting to verification-required page");
        
        const url = new URL("/verification-required", request.url);
        return NextResponse.redirect(url);
      }
      
      // User is authenticated and verified, allow access
      return NextResponse.next();
    }
    
    // If no token, redirect to login with the callback URL
    console.log(`Middleware: No token found, redirecting to login`);
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error(`Middleware: Error getting token:`, error);
    // If there's an error getting the token, redirect to login
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.url);
    url.searchParams.set("error", "AuthError");
    return NextResponse.redirect(url);
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};

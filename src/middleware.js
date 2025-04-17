import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  console.log(`Middleware processing: ${pathname}`);

  // Check if the request is for a protected route
  const isProtectedRoute =
    pathname.startsWith("/chat") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/group") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/settings");

  // Skip middleware for non-protected routes and API routes
  if (!isProtectedRoute || pathname.startsWith("/api")) {
    console.log(`Skipping middleware for non-protected route: ${pathname}`);
    return NextResponse.next();
  }
  
  console.log(`Protected route detected: ${pathname}`);

  // Get the session token with secure options
  console.log(`Middleware: Checking auth for ${pathname}`);
  
  let token;
  try {
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });
    
    console.log(`Middleware: Token found: ${!!token}`);
    if (token) {
      console.log(`Middleware: Token user: ${token.email}, verified: ${token.isVerified}`);
    }

    // If no token, redirect to login
    if (!token) {
      console.log(`Middleware: No token found, redirecting to login`);
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error(`Middleware: Error getting token:`, error);
    // If there's an error getting the token, redirect to login
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // If user is not verified, redirect to a verification required page
  if (token && token.isVerified === false) {
    // Log token details for debugging
    console.log("User not verified, redirecting to verification-required page");
    console.log("Token:", JSON.stringify(token, null, 2));
    
    const url = new URL("/verification-required", request.url);
    return NextResponse.redirect(url);
  }

  // Allow access to protected route
  return NextResponse.next();
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

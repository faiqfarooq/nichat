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
  if (!isProtectedRoute || 
      pathname.startsWith("/api") || 
      pathname.startsWith("/debug")) {
    console.log(`Skipping middleware for non-protected route: ${pathname}`);
    return NextResponse.next();
  }
  
  console.log(`Protected route detected: ${pathname}`);
  
  try {
    // Get the token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // If token exists, user is authenticated
    if (token) {
      console.log(`User authenticated: ${token.email}`);
      
      // If user is not verified, redirect to verification page
      if (token.isVerified === false) {
        console.log(`User not verified, redirecting to verification page`);
        return NextResponse.redirect(new URL("/verification-required", request.url));
      }
      
      // User is authenticated and verified, allow access
      return NextResponse.next();
    }
    
    // No token, redirect to login
    console.log(`No token found, redirecting to login`);
    return NextResponse.redirect(new URL("/login", request.url));
  } catch (error) {
    console.error(`Error in middleware:`, error);
    // If there's an error, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
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

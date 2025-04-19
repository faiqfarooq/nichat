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
  
  // Simple check for localStorage-based authentication (client-side only)
  // This is just a fallback - the actual check happens in the browser
  
  // First try to get the token from cookies for server-side auth
  let token;
  try {
    // Try multiple cookie names to ensure we find the token in production
    const cookieNames = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "__Host-next-auth.session-token"
    ];
    
    // Try each cookie name until we find a token
    for (const cookieName of cookieNames) {
      try {
        token = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET,
          secureCookie: process.env.NODE_ENV === "production",
          cookieName: cookieName,
        });
        
        if (token) {
          console.log(`Middleware: Found token using cookie name: ${cookieName}`);
          break;
        }
      } catch (err) {
        console.log(`Middleware: Error getting token with cookie name ${cookieName}:`, err);
      }
    }
  } catch (error) {
    console.error(`Middleware: Error getting token:`, error);
  }
  
  // If we found a token, allow access
  if (token) {
    return NextResponse.next();
  }
  
  // If no token found, redirect to login with callback URL
  console.log(`Middleware: No token found, redirecting to login`);
  
  // Only use callbackUrl if it's not the login page itself or doesn't already have a callbackUrl
  if (!pathname.includes('/login') && !pathname.includes('callbackUrl')) {
    const callbackUrl = encodeURIComponent(pathname);
    const url = new URL(`/login?callbackUrl=${callbackUrl}`, request.url);
    return NextResponse.redirect(url);
  } else {
    // Just redirect to login without a callback
    const url = new URL('/login', request.url);
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

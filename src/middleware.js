import { NextResponse } from "next/server";

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
  
  // Note: We can't check localStorage in middleware (server-side)
  // The actual authentication check will happen client-side in the AuthCheck component
  // This middleware just allows the request to proceed, and client-side code will handle redirection
  
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

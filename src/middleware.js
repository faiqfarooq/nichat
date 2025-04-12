import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the request is for a protected route
  const isProtectedRoute =
    pathname.startsWith("/chat") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/group") ||
    pathname.startsWith("/search");

  // Skip middleware for non-protected routes and API routes
  if (!isProtectedRoute || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Get the session token with secure options
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // If no token, redirect to login
  if (!token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // If user is not verified, redirect to a verification required page
  if (token.isVerified === false) {
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

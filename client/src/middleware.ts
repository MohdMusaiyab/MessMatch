import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/explore", "/profile", "/payment"];
  const contractorRestrictedRoutes = ["/dashboard/institution/*"];
  const nonContractorRestrictedRoutes = ["/dashboard/contractor/&"];

  // Check if the user is accessing a protected route
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    // If not authenticated, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Check the user's role
    const userRole = token.role;

    // Restrict access based on role
    if (userRole === "CONTRACTOR" && contractorRestrictedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (userRole !== "CONRACTOR" && nonContractorRestrictedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // If authenticated or accessing a public route, continue
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    "/:path*",
    "/dashboard/:path*",
    "/explore/:path*",
    "/profile",
    "/profile/:path*",
    "/payment",
    "/payment/:path*",
  ], // add more paths as needed
};

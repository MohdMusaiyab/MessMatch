import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/explore", "/profile", "/payment"];

  // Routes restricted for contractors (exact paths)
  const contractorRestrictedRoutes = [
    "/dashboard/institution",
    "/dashboard/institution/auction",
    "/dashboard/institution/auction/create",
    "/dashboard/institution/auction/update",
  ];

  // Routes restricted for non-contractors (exact paths)
  const nonContractorRestrictedRoutes = [
    "/dashboard/contractor",
    "/dashboard/contractor/my-auctions",
    "/dashboard/contractor/menu/create-menu",
    "/dashboard/contractor/menu/update-menu",
  ];

  // Get current pathname
  const pathname = req.nextUrl.pathname;

  // Check if the user is accessing a protected route (using startsWith)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // If not authenticated, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Check the user's role
    const userRole = token.role;

    // Restrict access for contractors - exact path matching
    if (userRole === "CONTRACTOR") {
      // Check for exact matches in contractor restricted routes
      if (contractorRestrictedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Special handling for update routes with IDs
      const updatePathMatch = pathname.match(
        /^\/dashboard\/institution\/auction\/update\/[\w-]+$/
      );
      if (updatePathMatch) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Restrict access for non-contractors - exact path matching
    if (
      userRole !== "CONTRACTOR" &&
      nonContractorRestrictedRoutes.includes(pathname)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // If authenticated or accessing a public route, continue
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    "/:path*", // Match all routes
  ],
};

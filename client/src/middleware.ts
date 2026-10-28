import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  const protectedPrefixes = ["/dashboard", "/explore", "/profile", "/chats"];
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const userRole = token.role;

    if (userRole === "CONTRACTOR" && pathname.startsWith("/dashboard/institution")) {
      return NextResponse.redirect(new URL("/dashboard/contractor", req.url));
    }

    if (userRole !== "CONTRACTOR" && pathname.startsWith("/dashboard/contractor")) {
      return NextResponse.redirect(new URL("/dashboard/institution", req.url));
    }
  }

  if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

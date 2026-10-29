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

    if (pathname === "/dashboard") {
      const target = userRole === "CONTRACTOR" ? "/dashboard/contractor" : "/dashboard/institution";
      return NextResponse.redirect(new URL(target, req.url));
    }

    const isPublicAuctionView =
      pathname.startsWith("/dashboard/institution/auction/") &&
      !pathname.startsWith("/dashboard/institution/auction/create") &&
      !pathname.startsWith("/dashboard/institution/auction/update");

    const isPublicMenuView =
      pathname.startsWith("/dashboard/contractor/menu/") &&
      !pathname.startsWith("/dashboard/contractor/menu/create-menu") &&
      !pathname.startsWith("/dashboard/contractor/menu/update-menu");

    if (userRole === "CONTRACTOR") {
      if (pathname.startsWith("/dashboard/institution") && !isPublicAuctionView) {
        return NextResponse.redirect(new URL("/dashboard/contractor", req.url));
      }
    }

    if (userRole !== "CONTRACTOR") {
      if (pathname.startsWith("/dashboard/contractor") && !isPublicMenuView) {
        return NextResponse.redirect(new URL("/dashboard/institution", req.url));
      }
    }
  }

  if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
    const target = token.role === "CONTRACTOR" ? "/dashboard/contractor" : "/dashboard/institution";
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

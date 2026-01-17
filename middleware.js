import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  });

  console.log("MIDDLEWARE TOKEN:", token);

  const { pathname } = req.nextUrl;

  // Protect /admin routes (Admin only)
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Protect /teachers routes (Authenticated users only)
  // Specific ownership checks will be handled in the page/API
  if (pathname.startsWith("/teachers") && !pathname.startsWith("/teacherspublic")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Allow access if logged in, regardless of role (role checks move to page/API)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/teachers/:path*"],
};
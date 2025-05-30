import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/access"];
const publicRoutes = ["/signin", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const cookies = request.cookies;
  let token = cookies.get("user-token")?.value;
  const tokenFromUrl = searchParams.get("token");

  console.log("Current pathname:", pathname);
  console.log("Token from cookie:", token);
  console.log("Token from URL:", tokenFromUrl);

  // If there's a token in the URL, set it as a cookie and redirect to clean URL
  if (tokenFromUrl) {
    const cleanUrl = new URL(pathname, request.url);
    // Remove token from search params for clean redirect
    cleanUrl.search = "";

    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set("user-token", tokenFromUrl, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: false, // Changed to false so JavaScript can read it
    });

    console.log("Setting cookie and redirecting to:", cleanUrl.toString());
    return response;
  }

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if trying to access protected route without token
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    console.log("No token found, redirecting to signin");
    const signInUrl = new URL("/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  console.log("Allowing access to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

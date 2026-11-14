import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Organiser pages: need the organiser's `user-token` cookie. */
const ORGANISER_ROUTES = [
  "/dashboard",
  "/elections",
  "/create-election",
  "/monitor-election", // the organiser's links page (public results are /monitoring-elections)
  "/votar-forms",
  "/profile",
  "/participate",
  "/preview-election",
  "/cast-votes",
];

/** Where Google sign-in sends the organiser back, with ?token=… */
const GOOGLE_RETURN_ROUTE = "/dashboard";

const matches = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const userToken = request.cookies.get("user-token")?.value;
  const adminToken = request.cookies.get("admin-token")?.value;

  // Google sign-in returns to the dashboard with the token in the URL: store
  // it as the session cookie and drop it from the address bar. Only accepted
  // on that one route, so a link like /anything?token=… can't sign someone
  // into another account.
  const tokenFromUrl = searchParams.get("token");
  if (tokenFromUrl && pathname === GOOGLE_RETURN_ROUTE) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("token");
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set("user-token", tokenFromUrl, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: false, // the app reads it to authorise API requests
    });
    return response;
  }

  // Admin area (except its login page) needs the admin token.
  if (matches(pathname, "/admin") && !matches(pathname, "/admin/login")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }
  if (matches(pathname, "/admin/login") && adminToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Organiser pages need the organiser token; come back here after signing in.
  if (!userToken && ORGANISER_ROUTES.some((route) => matches(pathname, route))) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  // Already signed in: skip the sign-in form.
  if (pathname === "/signin" && userToken) {
    const next = searchParams.get("next");
    const safe =
      next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/signin")
        ? next
        : "/dashboard";
    return NextResponse.redirect(new URL(safe, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)"],
};

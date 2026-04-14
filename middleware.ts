// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ API রাউট সবসময় allow করুন (লগইন API এর জন্য)
  if (pathname.startsWith("/api/")) {
    // লগইন এবং রেজিস্টার API সবসময় allow
    if (pathname === "/api/auth/login" || pathname === "/api/auth/register") {
      return NextResponse.next();
    }

    // অন্যান্য API রাউটের জন্য টোকেন চেক
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login first" },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const isLoggedIn = !!token;

  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/about",
    "/contact",
    "/departments",
    "/gallery",
    "/downloads",
    "/results",
  ];
  const privateRoutes = ["/student", "/teacher", "/admin", "/dashboard"];

  const isPublicRoute = publicRoutes.includes(pathname);
  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (isPrivateRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && pathname === "/login") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (role === "teacher") {
      return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/teacher") && role !== "teacher") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    pathname.startsWith("/student") &&
    role !== "student" &&
    role !== "parent"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

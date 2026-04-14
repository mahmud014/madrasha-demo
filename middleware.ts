// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // ✅ publicRoutes চেক যোগ করুন
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // পাবলিক রাউটে লগইন চেকের দরকার নেই
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

  if (pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const isLoggedIn = !!token;

  // ✅ সব প্রাইভেট রাউট লিস্ট
  const privateRoutes = [
    "/student",
    "/student/:path*",
    "/teacher",
    "/teacher/:path*",
    "/admin",
    "/admin/:path*",
    "/dashboard",
  ];

  // চেক করা হচ্ছে ইউজার কি প্রাইভেট রাউটে যেতে চাচ্ছে
  const isPrivateRoute = privateRoutes.some((route) => {
    if (route.includes(":path*")) {
      const baseRoute = route.replace("/:path*", "");
      return pathname === baseRoute || pathname.startsWith(baseRoute + "/");
    }
    return pathname === route || pathname.startsWith(route + "/");
  });

  // ✅ লগইন না থাকলে লগইন পেজে পাঠান
  if (isPrivateRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ লগইন থাকলেও রোল চেক করুন
  if (isLoggedIn) {
    // অ্যাডমিন রাউটে শুধু অ্যাডমিন যেতে পারবে
    if (pathname.startsWith("/admin") && role !== "admin") {
      if (role === "teacher") {
        return NextResponse.redirect(
          new URL("/teacher/dashboard", request.url),
        );
      }
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    // টিচার রাউটে শুধু টিচার যেতে পারবে
    if (pathname.startsWith("/teacher") && role !== "teacher") {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    // স্টুডেন্ট রাউটে শুধু স্টুডেন্ট যেতে পারবে
    if (pathname.startsWith("/student") && role !== "student") {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (role === "teacher") {
        return NextResponse.redirect(
          new URL("/teacher/dashboard", request.url),
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; // যদি JWT ব্যবহার করেন
// অথবা আপনার অথেন্টিকেশন সিস্টেম অনুযায়ী

// আপনার ইউজার মডেল ইম্পোর্ট করুন
import User from "@/models/User";
import { dbConnect } from "@/lib/mongodb";

export async function GET() {
  try {
    // পদ্ধতি 1: JWT টোকেন থেকে ইউজার তথ্য বের করা
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; // আপনার টোকেনের নাম অনুযায়ী

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 },
      );
    }

    // JWT টোকেন ভেরিফাই করুন
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // ডাটাবেজ থেকে ইউজার তথ্য আনুন
    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

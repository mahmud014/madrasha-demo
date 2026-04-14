import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, password, language = "bn" } = await req.json();
    await dbConnect();

    // ইউজার খোঁজা
    const user = await User.findOne({ id: id.trim() });
    if (!user) {
      return NextResponse.json(
        {
          message: language === "bn" ? "ইউজার আইডি সঠিক নয়" : "Invalid user ID",
          success: false,
        },
        { status: 404 },
      );
    }

    // পাসওয়ার্ড চেক
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: language === "bn" ? "ভুল পাসওয়ার্ড" : "Incorrect password",
          success: false,
        },
        { status: 401 },
      );
    }

    // টোকেন তৈরি (localStorage এর জন্য)
    const token = Buffer.from(`${user.id}-${Date.now()}`).toString("base64");

    // কুকি সেট করার জন্য রেসপন্স তৈরি
    const response = NextResponse.json(
      {
        success: true,
        message: language === "bn" ? "লগইন সফল" : "Login successful",
        user: {
          name: user.name,
          role: user.role,
          id: user.id,
        },
        token: token,
      },
      { status: 200 },
    );

    // ✅ কুকি সেট করুন (Middleware এর জন্য)
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    response.cookies.set("role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    const { language = "bn" } = await req
      .json()
      .catch(() => ({ language: "bn" }));
    return NextResponse.json(
      {
        message:
          language === "bn"
            ? "লগইন করতে সমস্যা হয়েছে"
            : "Login failed. Please try again",
        success: false,
      },
      { status: 500 },
    );
  }
}

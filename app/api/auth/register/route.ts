import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      role,
      id,
      language = "bn",
    } = await req.json();
    await dbConnect();

    // ইমেইল বা আইডি দিয়ে চেক
    const existingUser = await User.findOne({ $or: [{ email }, { id }] });
    if (existingUser) {
      return NextResponse.json(
        {
          message:
            language === "bn"
              ? "এই ইমেইল বা আইডি দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে"
              : "An account already exists with this email or ID",
          success: false,
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      id,
    });

    return NextResponse.json(
      {
        message:
          language === "bn"
            ? "রেজিস্ট্রেশন সফল হয়েছে"
            : "Registration successful",
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register Error:", error);
    const { language = "bn" } = await req
      .json()
      .catch(() => ({ language: "bn" }));
    return NextResponse.json(
      {
        message:
          language === "bn"
            ? "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
            : "Server error. Please try again.",
        success: false,
      },
      { status: 500 },
    );
  }
}

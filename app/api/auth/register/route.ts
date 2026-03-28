import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    await dbConnect();

    // ইউজার আগে থেকেই আছে কিনা চেক করুন
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে" }, { status: 400 });
    }

    // পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // নতুন ইউজার তৈরি
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return NextResponse.json({ message: "রেজিস্ট্রেশন সফল হয়েছে" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "সার্ভারে সমস্যা হয়েছে" }, { status: 500 });
  }
}
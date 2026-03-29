import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, id } = await req.json();
    await dbConnect();

    // ইমেইল বা আইডি দিয়ে চেক
    const existingUser = await User.findOne({ $or: [{ email }, { id }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "এই ইমেইল বা আইডি দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      id, // ডাটাবেজে id সেভ করা হচ্ছে
    });

    return NextResponse.json(
      { message: "রেজিস্ট্রেশন সফল হয়েছে" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "সার্ভারে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

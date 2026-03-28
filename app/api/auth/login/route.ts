import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // এখানে আপনি সেশন বা JWT রিটার্ন করবেন
    return NextResponse.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
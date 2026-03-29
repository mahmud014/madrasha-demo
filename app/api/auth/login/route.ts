import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, password } = await req.json();
    await dbConnect();

    // আইডি দিয়ে ইউজার খোঁজা
    const user = await User.findOne({ id: id.trim() });
    if (!user) {
      return NextResponse.json({ message: "ইউজার আইডি সঠিক নয়" }, { status: 404 });
    }

    // পাসওয়ার্ড চেক
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "ভুল পাসওয়ার্ড" }, { status: 401 });
    }

    return NextResponse.json({ 
      message: "লগইন সফল",
      user: { name: user.name, role: user.role, id: user.id } 
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ message: "লগইন করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
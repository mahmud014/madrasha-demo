import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    // আমরা পাসওয়ার্ড ছাড়া বাকি ডেটা আনবো নিরাপত্তার জন্য
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}
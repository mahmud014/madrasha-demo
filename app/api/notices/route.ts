import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// নোটিশের জন্য একটি সিম্পল স্কিমা (যদি আলাদা ফাইল না থাকে)
const NoticeSchema = new mongoose.Schema({
  title: String,
  date: Date,
  category: String,
});

const Notice = mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);

export async function GET() {
  try {
    await dbConnect();
    // সবশেষ ৫টি নোটিশ নিয়ে আসা
    const notices = await Notice.find().sort({ date: -1 }).limit(5);
    return NextResponse.json(notices);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch notices" }, { status: 500 });
  }
}
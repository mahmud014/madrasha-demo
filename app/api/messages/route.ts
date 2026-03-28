import { dbConnect } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ message: "মেসেজ পাওয়া যায়নি" }, { status: 500 });
  }
}
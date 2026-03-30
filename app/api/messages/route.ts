import { dbConnect } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

// ১. নতুন মেসেজ পাঠানো (POST)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newMessage = await Message.create(body);
    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ২. সব মেসেজ পাওয়া (GET)
export async function GET() {
  try {
    await dbConnect();
    const messages = await Message.find().sort({ createdAt: -1 });
    // এখানে success: true এবং data: messages পাঠানো হচ্ছে
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ৩. মেসেজ ডিলিট করা (DELETE)
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, message: "ID প্রয়োজন" }, { status: 400 });

    await Message.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "ডিলিট করা হয়েছে" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
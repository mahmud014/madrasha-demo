import { dbConnect } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newMessage = await Message.create({
      name: body.name,
      contact: body.contact,
      subject: body.subject,
      message: body.message,
    });

    return NextResponse.json(
      { success: true, data: newMessage },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Database Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 },
    );
  }
}

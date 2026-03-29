import { dbConnect } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const images = await Gallery.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: images });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}

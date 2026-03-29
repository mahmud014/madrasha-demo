import { dbConnect } from "@/lib/mongodb";
import Result from "@/models/Result";
import { NextResponse } from "next/server";

// --- GET Method ---
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const roll = searchParams.get("roll");

    // ১. যদি রোল নম্বর থাকে (সার্চ করার জন্য)
    if (roll) {
      const result = await Result.findOne({ roll });
      if (!result) {
        return NextResponse.json(
          { success: false, message: "রেজাল্ট পাওয়া যায়নি" },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, data: result });
    }

    // ২. যদি রোল না থাকে (অ্যাডমিন ড্যাশবোর্ডের জন্য সব ডাটা)
    const allResults = await Result.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: allResults });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "সার্ভারে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

// --- POST Method ---
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { studentName, roll, gpa, year, exam } = body;

    // ভ্যালিডেশন
    if (!studentName || !roll || !gpa || !year) {
      return NextResponse.json(
        { error: "সবগুলো তথ্য পূরণ করা বাধ্যতামূলক" },
        { status: 400 },
      );
    }

    // রোল নম্বর ইতিমধ্যে আছে কি না চেক করা
    const existingStudent = await Result.findOne({ roll });
    if (existingStudent) {
      return NextResponse.json(
        { error: `রোল নম্বর ${roll} ইতিমধ্যে ডাটাবেজে আছে!` },
        { status: 400 },
      );
    }

    const newResult = await Result.create({
      studentName,
      roll,
      gpa,
      year,
      exam,
    });

    return NextResponse.json(
      {
        success: true,
        message: "রেজাল্ট সফলভাবে যোগ করা হয়েছে",
        data: newResult,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "ডেটা সেভ করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

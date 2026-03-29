import { dbConnect } from "@/lib/mongodb";
import Result from "@/models/Result";
import { NextResponse } from "next/server";

// ১. রেজাল্ট সার্চ করার জন্য GET মেথড
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const roll = searchParams.get("roll");

    if (!roll) {
      return NextResponse.json({ error: "রোল নম্বর প্রয়োজন" }, { status: 400 });
    }

    // ডাটাবেজ থেকে রোল অনুযায়ী রেজাল্ট খোঁজা
    const result = await Result.findOne({ roll });

    if (!result) {
      return NextResponse.json(
        { message: "রেজাল্ট পাওয়া যায়নি" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "সার্ভারে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

// ২. ড্যাশবোর্ড থেকে রেজাল্ট যোগ করার জন্য POST মেথড
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { studentName, roll, gpa, year, exam } = body;

    // ভ্যালিডেশন: প্রয়োজনীয় সব ডাটা আছে কিনা
    if (!studentName || !roll || !gpa || !year) {
      return NextResponse.json(
        { error: "সবগুলো তথ্য (Name, Roll, GPA, Year) পূরণ করা বাধ্যতামূলক" },
        { status: 400 },
      );
    }

    // চেক করা: এই রোল নম্বরটি আগে থেকেই আছে কিনা
    const existingStudent = await Result.findOne({ roll });
    if (existingStudent) {
      return NextResponse.json(
        { error: `রোল নম্বর ${roll} ইতিমধ্যে ডাটাবেজে আছে!` },
        { status: 400 },
      );
    }

    // নতুন রেজাল্ট তৈরি এবং সেভ করা
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
      { error: "ডেটা সেভ করতে সমস্যা হয়েছে, আবার চেষ্টা করুন" },
      { status: 500 },
    );
  }
}

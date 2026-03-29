import { NextResponse } from "next/server";
import Result from "@/models/Result";
import { dbConnect } from "@/lib/mongodb";

// ১. ইনপুট ডাটার জন্য একটি ইন্টারফেস তৈরি করুন
interface IBulkResultItem {
  studentName: string;
  roll: string | number;
  gpa: string | number;
  year: string | number;
  exam: string;
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    // এখানে 'results' কে টাইপ এসাইন করে দিন
    const results: IBulkResultItem[] = body.results;

    if (!results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid or empty data format" },
        { status: 400 },
      );
    }

    // ডাটা ক্লিনআপ (যাতে ভুল টাইপ ডাটাবেজে না যায়)
    const cleanedResults = results.map((item) => ({
      studentName: item.studentName,
      roll: String(item.roll),
      gpa: String(item.gpa),
      year: String(item.year),
      exam: item.exam,
    }));

    const insertedData = await Result.insertMany(cleanedResults);

    return NextResponse.json({
      success: true,
      message: `${insertedData.length} records inserted successfully`,
      data: insertedData,
    });
  } catch (error: unknown) {
    // 'any' এর বদলে 'unknown' ব্যবহার করুন
    console.error("Bulk Insert Error:", error);

    // Error টাইপ চেক করে মেসেজ পাঠান
    let errorMessage = "Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 },
    );
  }
}

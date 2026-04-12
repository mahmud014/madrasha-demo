import { dbConnect } from "@/lib/mongodb";
import Result from "@/models/Result";
import { NextResponse } from "next/server";

// ১. নির্দিষ্ট রেজাল্ট ডিলিট করার জন্য DELETE মেথড
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
    const { id } = params;

    // MongoDB ID দিয়ে রেজাল্ট খুঁজে ডিলিট করা
    const deletedResult = await Result.findByIdAndDelete(id);

    if (!deletedResult) {
      return NextResponse.json(
        { success: false, message: "রেজাল্টটি খুঁজে পাওয়া যায়নি" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "রেজাল্ট সফলভাবে ডিলিট করা হয়েছে" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "ডিলিট করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

// ২. রেজাল্ট এডিট বা আপডেট করার জন্য PATCH মেথড
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    // রেজাল্ট আপডেট করা
    const updatedResult = await Result.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }, // এটি আপডেট হওয়া নতুন ডাটা রিটার্ন করবে
    );

    if (!updatedResult) {
      return NextResponse.json(
        { success: false, message: "আপডেট করা সম্ভব হয়নি" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "রেজাল্ট আপডেট হয়েছে", data: updatedResult },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "সার্ভারে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

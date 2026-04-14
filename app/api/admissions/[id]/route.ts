import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Admission from "@/models/Admission";

// ১. নির্দিষ্ট একটি আবেদন ডিলিট করার মেথড (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbConnect();

    const deletedAdmission = await Admission.findByIdAndDelete(id);

    if (!deletedAdmission) {
      return NextResponse.json(
        { success: false, error: "আবেদনটি খুঁজে পাওয়া যায়নি" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "সফলভাবে ডিলিট করা হয়েছে" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Admission DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "ডিলিট করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

// ২. নির্দিষ্ট একটি আবেদনের স্ট্যাটাস আপডেট করার মেথড (PATCH)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await dbConnect();

    const updatedAdmission = await Admission.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );

    if (!updatedAdmission) {
      return NextResponse.json(
        { success: false, error: "আপডেট করা সম্ভব হয়নি" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "সফলভাবে আপডেট করা হয়েছে",
        data: updatedAdmission,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Admission PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "আপডেট করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

// ৩. নির্দিষ্ট একটি আবেদন দেখার মেথড (GET) - ঐচ্ছিক
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbConnect();

    const admission = await Admission.findById(id);

    if (!admission) {
      return NextResponse.json(
        { success: false, error: "আবেদনটি খুঁজে পাওয়া যায়নি" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: admission },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Admission GET Error:", error);
    return NextResponse.json(
      { success: false, error: "আবেদন লোড করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

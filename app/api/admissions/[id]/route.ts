import { dbConnect } from "@/lib/mongodb";
import Admission from "@/models/Admission";
import { NextResponse } from "next/server";

// ১. নির্দিষ্ট একটি আবেদন ডিলিট করার মেথড (DELETE)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
    const { id } = params;

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
// এটি আপনার অ্যাডমিন প্যানেলে 'Approve' বা 'Reject' করার কাজে লাগবে
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const updatedAdmission = await Admission.findByIdAndUpdate(
      id,
      { $set: body }, // বডিতে যা পাঠানো হবে (যেমন: status: "approved") তা আপডেট হবে
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

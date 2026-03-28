import { dbConnect } from "@/lib/mongodb";
import Admission from "@/models/Admission";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const newAdmission = await Admission.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: newAdmission,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Admission API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

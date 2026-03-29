import { dbConnect } from "@/lib/mongodb";
import Admission from "@/models/Admission";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();

    // ১. ইমেজ হ্যান্ডলিং (টাইপ কাস্টিং সহ)
    const photoFile = formData.get("studentPhoto") as File | null;
    let photoUrl = "";

    if (photoFile && photoFile.size > 0) {
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "admissions" }, (error, result) => {
              if (error || !result) reject(error);
              else resolve(result as { secure_url: string });
            })
            .end(buffer);
        },
      );
      photoUrl = uploadResponse.secure_url;
    }

    // ২. টাইপ-সেফ ডাটা অবজেক্ট তৈরি
    const studentData: Record<string, string> = {};

    // formData.forEach এর টাইপ ডিফাইন করা
    formData.forEach((value: FormDataEntryValue, key: string) => {
      if (key !== "studentPhoto" && key !== "status") {
        studentData[key] = value.toString();
      }
    });

    // ৩. ফাইনাল ডাটা সেট করা
    const finalAdmissionData = {
      ...studentData,
      studentPhoto: photoUrl,
      status: (formData.get("status") as string) || "pending",
    };

    // ৪. ডাটাবেজে সেভ করা
    const newAdmission = await Admission.create(finalAdmissionData);

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

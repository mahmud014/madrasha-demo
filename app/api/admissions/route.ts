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

interface AdmissionData {
  [key: string]: string | number | boolean | undefined;
}

// --- POST Method ---
export async function POST(req: Request) {
  try {
    await dbConnect();

    // ১. ফর্ম ডাটা সংগ্রহ
    const formData = await req.formData();

    // ২. ইমেজ হ্যান্ডলিং
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

    // ৩. ডাইনামিক ফিল্ড সংগ্রহ
    const studentData: AdmissionData = {};
    formData.forEach((value: FormDataEntryValue, key: string) => {
      // ইমেজ এবং স্ট্যাটাস বাদে সব ডাটা অবজেক্টে নিচ্ছি
      if (key !== "studentPhoto" && key !== "status") {
        studentData[key] = value.toString();
      }
    });

    // ৪. অ্যাডমিশন আইডি জেনারেশন (অপশনাল কিন্তু রিকমেন্ডেড)
    // যদি আপনার মডেলে admissionId ইউনিক থাকে, তবে এটি জেনারেট করা ভালো
    const count = await Admission.countDocuments();
    const generatedId = `ADM-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, "0")}`;

    // ৫. ফাইনাল অবজেক্ট তৈরি
    const finalAdmissionData = {
      ...studentData,
      studentPhoto: photoUrl,
      admissionId: studentData.admissionId || generatedId, // ইউজার না দিলে অটো জেনারেট হবে
      status: (formData.get("status") as string) || "pending",
    };

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
    console.error("Admission POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

// --- GET Method ---
export async function GET() {
  try {
    await dbConnect();

    // ডাটাবেস থেকে ডাটা ফেচ করা
    const admissions = await Admission.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        data: admissions,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0", // লেটেস্ট ডাটা নিশ্চিত করতে
        },
      },
    );
  } catch (error: unknown) {
    console.error("Admission GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

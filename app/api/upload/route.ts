// app/api/upload/route.ts
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// ক্লাউডিনারি কনফিগারেশন
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ফাইলকে Buffer এ রূপান্তর
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Base64 এনকোড
    const base64String = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64String}`;

    // ক্লাউডিনারিতে আপলোড
    const result = await cloudinary.v2.uploader.upload(dataURI, {
      folder: `madrasa/${type === "avatar" ? "avatars" : "covers"}`,
      public_id: `${userId}_${Date.now()}`,
      transformation:
        type === "avatar"
          ? [{ width: 300, height: 300, crop: "fill" }]
          : [{ width: 1200, height: 300, crop: "fill" }],
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

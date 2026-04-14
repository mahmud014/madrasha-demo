import { dbConnect } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// ক্লাউডিনারি কনফিগারেশন
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - সমস্ত ছবি পাওয়া
export async function GET() {
  try {
    await dbConnect();
    const images = await Gallery.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}

// POST - নতুন ছবি আপলোড
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const titleBn = formData.get("titleBn") as string;
    const description = formData.get("description") as string;
    const descriptionBn = formData.get("descriptionBn") as string;
    const category = formData.get("category") as string;

    // ভ্যালিডেশন
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 },
      );
    }

    if (!title || !titleBn) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      );
    }

    // ফাইল সাইজ চেক (৫MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    // ক্লাউডিনারিতে আপলোড
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64String}`;

    const result = await cloudinary.v2.uploader.upload(dataURI, {
      folder: "madrasa/gallery",
      transformation: [{ width: 800, height: 600, crop: "limit" }],
    });

    // ডাটাবেজে সেভ
    await dbConnect();
    const newImage = await Gallery.create({
      url: result.secure_url,
      title,
      titleBn,
      description: description || "",
      descriptionBn: descriptionBn || "",
      category: category || "general",
      size: file.size,
      publicId: result.public_id,
    });

    return NextResponse.json(
      { success: true, data: newImage },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 },
    );
  }
}

// DELETE - ছবি ডিলিট
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const image = await Gallery.findById(id);

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 },
      );
    }

    // ক্লাউডিনারি থেকে ডিলিট
    if (image.publicId) {
      await cloudinary.v2.uploader.destroy(image.publicId);
    }

    // ডাটাবেজ থেকে ডিলিট
    await Gallery.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 },
    );
  }
}

// PATCH - ছবি আপডেট (ঐচ্ছিক)
export async function PATCH(req: Request) {
  try {
    const { id, title, titleBn, description, descriptionBn, category } =
      await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const updatedImage = await Gallery.findByIdAndUpdate(
      id,
      {
        title,
        titleBn,
        description,
        descriptionBn,
        category,
      },
      { new: true },
    );

    if (!updatedImage) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedImage });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update image" },
      { status: 500 },
    );
  }
}

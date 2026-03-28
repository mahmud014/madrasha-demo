import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const SettingSchema = new mongoose.Schema({
  madrasaNameEn: String,
  madrasaNameBn: String,
  addressEn: String,
  addressBn: String,
  phone: String,
  email: String,
});

const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

export async function GET() {
  try {
    await dbConnect();
    // 'general' সেটিংস খুঁজে বের করা
    const settings = await Setting.findOne();
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}

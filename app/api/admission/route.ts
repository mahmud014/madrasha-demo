import { dbConnect } from "@/lib/mongodb";
import Admission from "@/models/Admission";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await dbConnect();
    
    const newAdmission = await Admission.create(data);
    
    return NextResponse.json({ message: "আবেদন সফল হয়েছে", id: newAdmission._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "আবেদন জমা দিতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
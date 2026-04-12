import { Schema, model, models, Document } from "mongoose";

// ১. টাইপ-সেফটির জন্য ইন্টারফেস (TypeScript Interface)
export interface IAdmission extends Document {
  studentNameEn: string;
  studentNameBn: string;
  dob: string;
  gender: string;
  bloodGroup?: string;
  birthRegNo?: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  department: string;
  previousSchool?: string;
  presentAddress: string;
  permanentAddress: string;
  studentPhoto?: string;
  admissionId?: string;
  admissionDate: Date;
  status: "pending" | "approved" | "rejected";
  paymentStatus: "unpaid" | "paid" | "partial";
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema = new Schema<IAdmission>(
  {
    // --- ব্যক্তিগত তথ্য ---
    studentNameEn: { type: String, required: true },
    studentNameBn: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String },
    birthRegNo: { type: String },

    // --- অভিভাবকের তথ্য ---
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    guardianPhone: { type: String, required: true },

    // --- শিক্ষাগত তথ্য ---
    department: { type: String, required: true },
    previousSchool: { type: String },

    // --- ঠিকানা ---
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },

    // --- ছবি (Cloudinary URL সেভ করার জন্য) ---
    studentPhoto: { type: String },

    // --- এডমিন ম্যানেজমেন্ট ফিল্ডস ---
    admissionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "partial"],
      default: "unpaid",
    },
    adminNote: { type: String },
  },
  {
    timestamps: true,
  },
);

// ২. মডেল এক্সপোর্ট করার সময় জেনেরিক টাইপ ব্যবহার
const Admission =
  models.Admission || model<IAdmission>("Admission", AdmissionSchema);

export default Admission;

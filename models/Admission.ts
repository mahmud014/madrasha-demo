import { Schema, model, models } from "mongoose";

const AdmissionSchema = new Schema(
  {
    // --- ব্যক্তিগত তথ্য (ইউজার পূরণ করবে) ---
    studentNameEn: { type: String, required: true },
    studentNameBn: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String },
    birthRegNo: { type: String },

    // --- অভিভাবকের তথ্য (ইউজার পূরণ করবে) ---
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    guardianPhone: { type: String, required: true },

    // --- শিক্ষাগত তথ্য (ইউজার পূরণ করবে) ---
    department: { type: String, required: true },
    previousSchool: { type: String },

    // --- ঠিকানা (ইউজার পূরণ করবে) ---
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },

    // --- এডমিন ম্যানেজমেন্ট ফিল্ডস (সিস্টেম বা এডমিন দ্বারা নিয়ন্ত্রিত) ---

    // ১. অটো-জেনারেটেড আইডি বা রোল (ইউনিক হতে হবে)
    admissionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // ২. ভর্তির তারিখ (ডিফল্ট আজকের তারিখ)
    admissionDate: {
      type: Date,
      default: Date.now,
    },

    // ৩. স্ট্যাটাস (পেন্ডিং ডিফল্ট থাকবে)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ৪. পেমেন্ট স্ট্যাটাস (ইউজার যখন ফি দিবে তখন এডমিন আপডেট করবে)
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "partial"],
      default: "unpaid",
    },

    // ৫. এডমিন নোট (যদি কোনো বিশেষ মন্তব্য থাকে)
    adminNote: { type: String },
  },
  {
    timestamps: true,
  },
);

const Admission = models.Admission || model("Admission", AdmissionSchema);

export default Admission;

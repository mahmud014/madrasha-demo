import { Schema, model, models, Document } from "mongoose";

// ১. TypeScript-এর জন্য ইন্টারফেস তৈরি (যাতে কোডিং করার সময় অটো-সাজেশন পান)
export interface IResult extends Document {
  studentName: string;
  roll: string;
  gpa: string;
  year: string;
  exam?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    studentName: { type: String, required: true },
    // টিপস: যদি রোল ডুপ্লিকেট হওয়ার সম্ভাবনা থাকে তবে unique: true সরিয়ে দিন
    roll: { type: String, required: true, unique: true },
    gpa: { type: String, required: true },
    year: { type: String, required: true },
    exam: { type: String },
  },
  {
    timestamps: true, // এটি অটোমেটিক createdAt এবং updatedAt তৈরি করবে
  },
);

// ২. মডেল এক্সপোর্ট (Next.js-এর জন্য models.Result চেক সহ)
const Result = models.Result || model<IResult>("Result", ResultSchema);

export default Result;

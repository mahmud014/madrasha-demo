import { Schema, model, models } from "mongoose";

const ResultSchema = new Schema(
  {
    studentName: { type: String, required: true },
    roll: { type: String, required: true, unique: true },
    gpa: { type: String, required: true },
    year: { type: String, required: true },
    exam: { type: String },
  },
  { timestamps: true },
);

const Result = models.Result || model("Result", ResultSchema);
export default Result;

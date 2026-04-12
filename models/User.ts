import mongoose, { Schema, model, models } from "mongoose";

// ;;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "student", "parent"],
      default: "student",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema, "registration");

export default User;
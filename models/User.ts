import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: String, required: true, unique: true }, // Student/Teacher ID
  role: { 
    type: String, 
    enum: ['admin', 'student', 'parent'], 
    default: 'student' 
  },
}, { timestamps: true });

// আপনার স্ক্রিনশট অনুযায়ী কালেকশনের নাম 'registration' সেট করা হয়েছে
// models/User.js ফাইলে পরিবর্তন করুন:
const User = models.User || model('User', UserSchema, 'users'); // 'registration' এর বদলে 'users' দিন
export default User;
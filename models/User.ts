import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'student', 'parent'], // এখানে 'parent' এড করুন কারণ ফ্রন্টএন্ড থেকে 'parent' পাঠাচ্ছেন
    default: 'student' 
  },
}, { timestamps: true });

// এই অংশটি গুরুত্বপূর্ণ
const User = models.User || model('User', UserSchema);
export default User;
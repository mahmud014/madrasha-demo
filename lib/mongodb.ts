import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

export const dbConnect = async () => {
  try {
    // যদি অলরেডি কানেক্টেড থাকে
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // এটি টাইম-আউট এরর কমাতে সাহায্য করবে
      dbName: 'Madsaha-Database'
    });
    
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Error ❌", error);
    // এরর আসলে প্রসেস থামিয়ে দাও যেন বুঝা যায় কী সমস্যা
    throw error; 
  }
};
import { Schema, model, models } from "mongoose";

const GallerySchema = new Schema(
  {
    title: { type: String, required: true }, // ইংরেজি টাইটেল
    titleBn: { type: String, required: true }, // বাংলা টাইটেল
    url: { type: String, required: true }, // ইমেজ URL
    category: {
      type: String,
      required: true,
      enum: ["events", "classes", "ceremony", "general"],
      default: "general",
    },
    description: { type: String, default: "" }, // ইংরেজি বিবরণ (ঐচ্ছিক)
    descriptionBn: { type: String, default: "" }, // বাংলা বিবরণ (ঐচ্ছিক)
  },
  { timestamps: true },
);

export default models.Gallery || model("Gallery", GallerySchema);

import { Schema, model, models } from "mongoose";

const GallerySchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true },
);

export default models.Gallery || model("Gallery", GallerySchema);

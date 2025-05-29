import mongoose, { Schema } from "mongoose";

const ListingSchema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    location: String,
    category: String,
    attributes: Object,
  },
  { timestamps: true }
);

export const Listing =
  mongoose.models.Listing || mongoose.model("Listing", ListingSchema);

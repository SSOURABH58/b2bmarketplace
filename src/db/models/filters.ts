import mongoose, { Schema } from "mongoose";

const AttributeSchema = new Schema({
  name: String,
  slug: String,
  type: String,
  options: [
    {
      label: String,
      value: String,
    },
  ],
  min: Number,
  max: Number,
});

const FiltersSchema = new Schema(
  {
    name: String,
    slug: String,
    attributeSchema: [AttributeSchema],
  },
  { timestamps: true }
);

export const Filters =
  mongoose.models.Filters ||
  mongoose.model("Filters", FiltersSchema, "categories");

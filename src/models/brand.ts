import mongoose from "mongoose";
import { Brand as BrandType } from "../types/brand";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    logo: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model<BrandType>("Brand", brandSchema);

export default Brand;
import mongoose from "mongoose";
import { ScentProfile as ScentProfileType } from "../types/scentProfile";

const scentProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ScentProfile = mongoose.model<ScentProfileType>("ScentProfile", scentProfileSchema);

export default ScentProfile;

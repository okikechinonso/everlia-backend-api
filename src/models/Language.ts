import mongoose from "mongoose";
import { Language as LanguageType } from "../types/language";

const languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    iso_code: {
      type: String,
      required: true,
    },
    flag: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },
  },
  {
    timestamps: true,
  }
);

const Language = mongoose.model<LanguageType>("Language", languageSchema);

export default Language;
import mongoose from "mongoose";
import { IAdmin as AdminType } from "../types/admin";
import {hashSync} from "bcrypt-ts";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    password: {
      type: String,
      required: true,
      default: hashSync("12345678"),
    },
    role: {
      type: String,
      required: true,
      default: "Admin",
      enum: [
        "Admin",
        "Super Admin",
        "Cashier",
        "Manager",
        "CEO",
        "Driver",
        "Security Guard",
        "Accountant",
      ],
    },
    joiningData: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model<AdminType & mongoose.Document>("Admin", adminSchema);

export default Admin;
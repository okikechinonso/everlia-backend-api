import mongoose from "mongoose";
import { Currency as CurrencyType } from "../types/currency";

const currencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: false,
    },
    // iso_code: {
    //   type: String,
    //   required: true,
    // },
    // exchange_rate: {
    //   type: String,
    //   required: false,
    // },
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },
    live_exchange_rates: {
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

const Currency = mongoose.model<CurrencyType>("Currency", currencySchema);

export default Currency;
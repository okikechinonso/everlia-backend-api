import mongoose from "mongoose";
import { Order as OrderType } from "../types/order";


const cash = "CASH";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    invoice: {
      type: Number,
      required: false,
    },
    cart: [{}],
    user_info: {
      name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      contact: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      location: {
        type: String,
        required: false,
      },
      area: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: cash,
    },
    paymentReceipt: {
      type: String,
      required: true,
      default: cash,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      required: false,
    },
    deletedBy: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancel"],
    },
  },
  {
    timestamps: true,
  }
);


const Order = mongoose.model<OrderType>("Order", orderSchema);

export default Order;
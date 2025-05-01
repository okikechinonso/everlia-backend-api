import mongoose from "mongoose";
import { Product as ProductType } from "../types/product";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: false,
    },
    sku: {
      type: String,
      required: false,
    },
    hasTest: {
      type: Boolean,
      required: false,
      default: false,
    },
    barcode: {
      type: String,
      required: false,
    },
    title: {
      type: Object,
      required: true,
    },
    description: {
      type: Object,
      required: false,
    },
    slug: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    stock: {
      type: Number,
      required: false,
    },
    sales: {
      type: Number,
      required: false,
    },
    tag: [String],
    prices: {
      originalPrice: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: false,
      },
    },
    variants: [{}],
    isCombination: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      default: "show",
      enum: ["show", "hide"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<ProductType>("Product", productSchema);

export default Product;
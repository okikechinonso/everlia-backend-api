import { Types } from "mongoose";

export interface Product {
  productId?: string;
  sku?: string;
  hasTest?: boolean;
  barcode?: string;
  title: Record<string, any>; // Assuming `title` is an object with dynamic keys
  description?: Record<string, any>; // Optional, similar to `title`
  slug: string;
  categories: Types.ObjectId[]; // Array of references to `Category`
  category: Types.ObjectId; // Reference to `Category`
  image?: string[]; // Assuming `image` is an array of strings
  stock?: number;
  sales?: number;
  tag?: string[]; // Array of strings for tags
  prices: {
    originalPrice: number;
    price: number;
    discount?: number;
  };
  variants?: Record<string, any>[]; // Assuming `variants` is an array of objects
  isCombination: boolean;
  status?: "show" | "hide"; // Enum values for `status`
  createdAt?: Date; // Added for `timestamps: true`
  updatedAt?: Date; // Added for `timestamps: true`
}
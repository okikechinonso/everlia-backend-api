import { Types } from "mongoose";

export interface Product {
  productId?: string;
  sku?: string;
  hasTest?: boolean;
  barcode?: string;
  title: object; 
  description?: Record<string, any>; 
  slug: string;
  categories: Types.ObjectId[]; 
  category: Types.ObjectId; 
  image: string[]; 
  stock?: number;
  sales?: number;
  tag?: string[]; 
  prices: {
    originalPrice: number;
    price: number;
    discount?: number;
  };
  variants?: Record<string, any>[]; 
  isCombination: boolean;
  status?: "show" | "hide"; 
  createdAt?: Date;
  updatedAt?: Date;
}
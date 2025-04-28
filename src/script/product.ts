import dotenv from "dotenv";
import fs from "fs";
import products from "../utils/products";

dotenv.config();

interface Product {
  slug: string;
  sku: string;
  barcode: string;
  productId: string;
  title: string;
  description: string;
  categories: string[];
  category: string;
  image: string[];
  stock: number;
  status: string;
  isCombination: boolean;
  prices: {
    discount: string;
    originalPrice: number;
    price: number;
  };
  variants: Record<string, any>[];
  tag: string[];
}

const updateManyProducts = async (): Promise<void> => {
  try {
    console.log("process running!");

    console.log("products", products.length);
    const result = products?.map((el: Product) => {
      const newObj: Product = {
        slug: el.slug,
        sku: el.sku,
        barcode: el.barcode,
        productId: el.productId,
        title: el.title,
        description: el.description,
        categories: el.categories,
        category: el.category,
        image: el.image,
        stock: el.stock,
        status: el.status,
        isCombination: el.isCombination,
        prices: {
          discount: "0",
          originalPrice: el.prices.originalPrice,
          price: el.prices.price,
        },
        variants: el.variants,
        tag: el.tag,
      };
      return newObj;
    });

    fs.writeFileSync("data.json", JSON.stringify(result));
    console.log("data updated successfully!", result);
    process.exit();
  } catch (err) {
    console.error("error", err);
    process.exit(1);
  }
};

updateManyProducts();
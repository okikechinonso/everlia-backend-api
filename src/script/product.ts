import dotenv from "dotenv";
import fs from "fs";
import products from "../utils/products";
import { Product } from "../types/product";

dotenv.config();


const updateManyProducts = async (): Promise<void> => {
  try {
    console.log("process running!");

    console.log("products", products.length);
    const result = products.map((el: any) => {
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
          discount: 0,
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
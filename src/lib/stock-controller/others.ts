import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../../models/Product";

dotenv.config();

const mongo_connection = mongoose.createConnection(process.env.MONGO_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  poolSize: 100,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
});

// Decrease product quantity after an order is created
export const handleProductQuantity = async (cart: any[]) => {
  try {
    for (const p of cart) {
      if (p.isCombination) {
        await Product.findOneAndUpdate(
          {
            _id: p._id,
            "variants.productId": p.variant.productId ? p.variant.productId : "",
          },
          {
            $inc: {
              stock: -p.quantity,
              "variants.$.quantity": -p.quantity,
              sales: p.quantity,
            },
          },
          {
            new: true,
          }
        );
      } else {
        await Product.findOneAndUpdate(
          {
            _id: p._id,
          },
          {
            $inc: {
              stock: -p.quantity,
              sales: p.quantity,
            },
          },
          {
            new: true,
          }
        );
      }
    }
  } catch (err) {
    console.error("Error in handleProductQuantity:", (err as Error).message);
  }
};

export const handleProductAttribute = async (key: string, value: any, multi: boolean = false) => {
  try {
    const products = await Product.find({ isCombination: true });

    if (multi) {
      for (const p of products) {
        await Product.updateOne(
          { _id: p._id },
          {
            $pull: {
              variants: { [key]: { $in: value } },
            },
          }
        );
      }
    } else {
      for (const p of products) {
        await Product.updateOne(
          { _id: p._id },
          {
            $pull: {
              variants: { [key]: value },
            },
          }
        );
      }
    }
  } catch (err) {
    console.error("Error when deleting product variants:", (err as Error).message);
  }
};
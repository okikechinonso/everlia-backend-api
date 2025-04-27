import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import Category from "../models/Category";

export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const newProduct = new Product({
      ...req.body,
      productId: req.body.productId || mongoose.Types.ObjectId(),
    });

    if (newProduct.hasTest) {
      const test = newProduct.variants.find((e: any) => e.name?.toLowerCase() === "test");
      if (!test) {
        throw new Error("Please add a test variant");
      }
    }

    await newProduct.save();
    res.send(newProduct);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const addAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    await Product.deleteMany();
    await Product.insertMany(req.body);
    res.status(200).send({
      message: "Products added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getShowingProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ status: "show" }).sort({ _id: -1 });
    res.send(products);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  const { title, category, price, page, limit } = req.query;

  const queryObject: Record<string, any> = {};
  const sortObject: Record<string, any> = {};

  if (title) {
    queryObject.$or = [
      { "title.en": { $regex: title as string, $options: "i" } },
      { "title.de": { $regex: title as string, $options: "i" } },
      { "title.es": { $regex: title as string, $options: "i" } },
      { "title.bn": { $regex: title as string, $options: "i" } },
      { "title.sl": { $regex: title as string, $options: "i" } },
    ];
  }

  if (price === "low") {
    sortObject["prices.originalPrice"] = 1;
  } else if (price === "high") {
    sortObject["prices.originalPrice"] = -1;
  } else if (price === "published") {
    queryObject.status = "show";
  } else if (price === "unPublished") {
    queryObject.status = "hide";
  } else if (price === "status-selling") {
    queryObject.stock = { $gt: 0 };
  } else if (price === "status-out-of-stock") {
    queryObject.stock = { $lt: 1 };
  } else if (price === "date-added-asc") {
    sortObject.createdAt = 1;
  } else if (price === "date-added-desc") {
    sortObject.createdAt = -1;
  } else if (price === "date-updated-asc") {
    sortObject.updatedAt = 1;
  } else if (price === "date-updated-desc") {
    sortObject.updatedAt = -1;
  } else {
    sortObject._id = -1;
  }

  if (category) {
    queryObject.categories = category;
  }

  const pages = Number(page) || 1;
  const limits = Number(limit) || 10;
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Product.countDocuments(queryObject);

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" })
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      products,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: `Slug problem, ${(err as Error).message}`,
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" });

    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = { ...product.title, ...req.body.title };
      product.description = { ...product.description, ...req.body.description };
      product.productId = req.body.productId;
      product.sku = req.body.sku;
      product.barcode = req.body.barcode;
      product.slug = req.body.slug;
      product.categories = req.body.categories;
      product.category = req.body.category;
      product.show = req.body.show;
      product.isCombination = req.body.isCombination;
      product.variants = req.body.variants;
      product.stock = req.body.stock;
      product.prices = req.body.prices;
      product.image = req.body.image;
      product.tag = req.body.tag;

      await product.save();
      res.send({ data: product, message: "Product updated successfully!" });
    } else {
      res.status(404).send({
        message: "Product Not Found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateManyProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedData: Record<string, any> = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        updatedData[key] = req.body[key];
      }
    }

    await Product.updateMany(
      { _id: { $in: req.body.ids } },
      { $set: updatedData },
      { multi: true }
    );
    res.send({
      message: "Products updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const newStatus = req.body.status;
    await Product.updateOne(
      { _id: req.params.id },
      { $set: { status: newStatus } }
    );
    res.status(200).send({
      message: `Product ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Product Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteManyProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    await Product.deleteMany({ _id: req.body.ids });
    res.send({
      message: "Products Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getShowingStoreProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryObject: Record<string, any> = { status: "show" };
    const { category, title } = req.query;

    if (category) {
      queryObject.categories = { $in: [category] };
    }

    if (title) {
      queryObject.$or = [
        { "title.en": { $regex: title as string, $options: "i" } },
        { "title.de": { $regex: title as string, $options: "i" } },
        { "title.es": { $regex: title as string, $options: "i" } },
        { "title.bn": { $regex: title as string, $options: "i" } },
        { "title.sl": { $regex: title as string, $options: "i" } },
        { slug: title as string },
      ];
    }

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "name _id" })
      .sort({ _id: -1 })
      .limit(100);

    const relatedProduct = await Product.find({
      category: products[0]?.category,
    }).populate({ path: "category", select: "_id name" });

    res.send({
      products,
      relatedProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};
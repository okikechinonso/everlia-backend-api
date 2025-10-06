import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../../models/Product";
import Category from "../../models/Category";
import ScentProfile from "../../models/ScentProfile";
import { cloudinaryUploadToImage } from "../../lib/file-upload/cloudinary";
import { validateCreateProduct } from "../request/product";
import { ObjectId } from 'mongodb';
import { Product as ProductModel } from "../../types/product";


export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = validateCreateProduct(req.body);
    if (error) {
      res.status(400).send({
        message: error.details[0].message,
      });
      return;
    }

    const newProduct = new Product({
      ...req.body,
    });

    const images: string[] = [];
    if (newProduct.variants) {
      for (let i = 0; i < newProduct.variants.length; i++) {
        const image = newProduct.variants[i].image;
        if (image) {
          const imageUrl = await cloudinaryUploadToImage(image);
          images.push(imageUrl.secure_url);
          newProduct.variants[i].image = imageUrl.secure_url;
        }
      }
    }

    for (let i = 0; i < newProduct.image?.length; i++) {
      const image = newProduct.image[i];
      if (image) {
        const imageUrl = await cloudinaryUploadToImage(image);
        images.push(imageUrl.secure_url);
      }
    }
    newProduct.image = images;
    // attach scentProfile if provided as id
    if (req.body.scentProfile) {
      newProduct.scentProfile = req.body.scentProfile;
    }
    await newProduct.save();
    res.send(newProduct);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).send({
      message: err,
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
    const products = await Product.find({ status: "show" }).sort({ _id: -1 })
      .populate({ path: "scentProfile", select: "_id name" });
    res.send(products);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getCategoryProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ status: "show" }).limit(15);

    const categoryProducts: { _id: string, category: string; products: any[] }[] = [];

    for (const cat of categories) {
      const prods = await Product.find({ category: new ObjectId(cat._id) })
        .populate({ path: "category", select: "_id name" })
        .populate({ path: "scentProfile", select: "_id name" })
        .sort({ createdAt: -1 })
        .limit(10);

      if (prods.length > 0) {
        categoryProducts.push({
          _id: cat.id,
          category: cat.name?.en,
          products: prods,
        });
      }


    }

    res.send(categoryProducts);
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
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
  const limits = Number(limit) || 50;
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Product.countDocuments(queryObject);

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" })
      .populate({ path: "scentProfile", select: "_id name" })
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
  console.log("slug", req.params.slug)
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "scentProfile", select: "_id name" });

    const relatedProducts = await Product.find({
      category: product?.category,
    })
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "scentProfile", select: "_id name" });

    res.send({ product, relatedProducts });
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
      .populate({ path: "categories", select: "_id name" })
      .populate({ path: "brand", select: "_id name" })
      .populate({ path: "scentProfile", select: "_id name" });

    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const url = await cloudinaryUploadToImage(req.body[0])
    await Product.updateOne({ _id: req.params.id }, { $set: { image: [url.secure_url] } })
    res.send({ message: "successfully updated image" });
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
      product.status = req.body.status;
      product.isCombination = req.body.isCombination;
      product.variants = req.body.variants;
      product.stock = req.body.stock;
      product.prices = req.body.prices;
      product.brand = req.body.brand;
      product.scentProfile = req.body.scentProfile;
      // product.image = req.body.image;
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

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.params.slug)

    const products = await Product.find(
      { "title.en": { $regex: req.params.slug, $options: "i" } },
      { title: 1, slug: 1, _id: 0 }
    ).limit(7);


    const productNames = products.map(p => {
      const { en } = p.title as { en: string }
      const slug = p.slug
      return {
        en,
        slug
      }
    });
    res.status(200).send(productNames);
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

    if (req.query.category) {
      console.log("category id", req.query.category)
      try {
        queryObject.category = new ObjectId(req.query.category as string)
      } catch (error) {
        if (req.query._id) {
          const categoryid = req.query._id;
          queryObject.$or = [
            { category: new ObjectId(categoryid as string) }
          ]

        }
      }

    }

    if (req.query.brand) {
      queryObject.brand = req.query.brand
    }


    if (req.query.title) {
      queryObject.$or = [
        { "title.en": { $regex: req.query.title as string, $options: "i" } },
        { "title.de": { $regex: req.query.title as string, $options: "i" } },
        { "title.es": { $regex: req.query.title as string, $options: "i" } },
        { "title.bn": { $regex: req.query.title as string, $options: "i" } },
        { "title.sl": { $regex: req.query.title as string, $options: "i" } },
        { slug: req.query.title as string },
      ];
    }

    console.log(queryObject)


    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "name _id" })
      .populate({ path: "brand", select: "_id name" })
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
    console.log(err);
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};
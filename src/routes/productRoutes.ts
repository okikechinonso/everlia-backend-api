import express from "express";
import {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
} from "../api/controller/productController";

const router = express.Router();

// Add a product
router.post("/add", addProduct);

// Add multiple products
router.post("/all", addAllProducts);

// Get a product by ID
router.get("/:id", getProductById);

// Get showing products only
router.get("/show", getShowingProducts);

// Get showing products in store
router.get("/store", getShowingStoreProducts);

// Get all products
router.get("/", getAllProducts);

// Get a product by slug
router.get("/product/:slug", getProductBySlug);

//update a product
router.put("/:id", updateProduct);

// Update many products
router.patch("/update/many", updateManyProducts);

// Update a product status
router.put("/status/:id", updateStatus);

// Delete a product
router.delete("/:id", deleteProduct);

// Delete many products
router.patch("/delete/many", deleteManyProducts);

export default router;
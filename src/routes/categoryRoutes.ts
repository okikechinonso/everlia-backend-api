import express from "express";
import {
  addCategory,
  addAllCategory,
  getAllCategory,
  getAllCategories,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  updateManyCategory,
} from "../controller/categoryController";

const router = express.Router();

// Add a category
router.post("/add", addCategory);

// Add all categories
router.post("/add/all", addAllCategory);

// Get only showing categories
router.get("/show", getShowingCategory);

// Get all categories
router.get("/", getAllCategory);

// Get all categories (alternative route)
router.get("/all", getAllCategories);

// Get a category by ID
router.get("/:id", getCategoryById);

// Update a category
router.put("/:id", updateCategory);

// Show/hide a category
router.put("/status/:id", updateStatus);

// Delete a category
router.delete("/:id", deleteCategory);

// Delete many categories
router.patch("/delete/many", deleteManyCategory);

// Update many categories
router.patch("/update/many", updateManyCategory);

export default router;
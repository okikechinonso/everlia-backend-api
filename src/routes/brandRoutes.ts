import express from "express";
import {
  addBrand,
  getAllBrands,
} from "../api/controller/brandController";

const router = express.Router();

// Add a Brand
router.post("/add", addBrand);
// Get All Brands
router.get("/all", getAllBrands);

export default router;
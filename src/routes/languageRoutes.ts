import express from "express";
import {
  addLanguage,
  addAllLanguage,
  getAllLanguages,
  getShowingLanguage,
  getLanguageById,
  updateLanguage,
  updateStatus,
  deleteLanguage,
  updateManyLanguage,
  deleteManyLanguage,
} from "../api/controller/languageController";

const router = express.Router();

// Add a language
router.post("/add", addLanguage);

// Add all languages
router.post("/add/all", addAllLanguage);

// Get only showing languages
router.get("/show", getShowingLanguage);

// Get all languages
router.get("/all", getAllLanguages);

// Get a language by ID
router.get("/:id", getLanguageById);

// Update a language
router.put("/:id", updateLanguage);

// Update many languages
router.patch("/update/many", updateManyLanguage);

// Show/hide a language
router.put("/status/:id", updateStatus);

// Delete a language
router.delete("/:id", deleteLanguage);

// Delete many languages
router.patch("/delete/many", deleteManyLanguage);

export default router;
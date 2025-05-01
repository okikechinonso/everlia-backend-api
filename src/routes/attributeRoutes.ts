import express from "express";
import {
  addAttribute,
  addAllAttributes,
  getAllAttributes,
  getShowingAttributes,
  getAttributeById,
  updateAttributes,
  updateStatus,
  deleteAttribute,
  getShowingAttributesTest,
  updateChildStatus,
  deleteChildAttribute,
  addChildAttributes,
  updateChildAttributes,
  getChildAttributeById,
  updateManyAttribute,
  deleteManyAttribute,
  updateManyChildAttribute,
  deleteManyChildAttribute,
} from "../controller/attributeController";

const router = express.Router();

// Add attribute
router.post("/add", addAttribute);

// Add all attributes
router.post("/add/all", addAllAttributes);

// Add child attribute
router.put("/add/child/:id", addChildAttributes);

// Get all attributes
router.get("/", getAllAttributes);

// Get showing attributes
router.get("/show", getShowingAttributes);

// Test showing attributes
router.put("/show/test", getShowingAttributesTest);

// Update many attributes
router.patch("/update/many", updateManyAttribute);

// Get attribute by ID
router.get("/:id", getAttributeById);

// Get child attribute by ID
router.get("/child/:id/:ids", getChildAttributeById);

// Update attribute
router.put("/:id", updateAttributes);

// Update many child attributes
router.patch("/update/child/many", updateManyChildAttribute);

// Update child attribute
router.put("/update/child/:attributeId/:childId", updateChildAttributes);

// Show/hide an attribute
router.put("/status/:id", updateStatus);

// Show/hide a child attribute status
router.put("/status/child/:id", updateChildStatus);

// Delete attribute
router.delete("/:id", deleteAttribute);

// Delete child attribute
router.put("/delete/child/:attributeId/:childId", deleteChildAttribute);

// Delete many attributes
router.patch("/delete/many", deleteManyAttribute);

// Delete many child attributes
router.patch("/delete/child/many", deleteManyChildAttribute);

export default router;
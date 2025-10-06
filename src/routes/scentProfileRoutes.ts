import express from "express";
import {
  createScentProfile,
  getAllScentProfiles,
  getScentProfileById,
  updateScentProfile,
  deleteScentProfile,
} from "../api/controller/scentProfileController";

const router = express.Router();

router.post("/add", createScentProfile);
router.get("/", getAllScentProfiles);
router.get("/:id", getScentProfileById);
router.put("/:id", updateScentProfile);
router.delete("/:id", deleteScentProfile);

export default router;

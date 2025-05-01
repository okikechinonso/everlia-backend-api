import express from "express";
import {
  addGlobalSetting,
  getGlobalSetting,
  updateGlobalSetting,
} from "../api/controller/settingController";

const router = express.Router();

// Add a global setting
router.post("/global/add", addGlobalSetting);

// Get global setting
router.get("/global/all", getGlobalSetting);

// Update global setting
router.put("/global/update", updateGlobalSetting);

export default router;
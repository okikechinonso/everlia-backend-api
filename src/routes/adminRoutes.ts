import express from "express";
import {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
} from "../controller/adminController";
import { passwordVerificationLimit } from "../lib/email-sender/sender";

const router = express.Router();

// Register a staff
router.post("/register", registerAdmin);

// Login an admin
router.post("/login", loginAdmin);

// Forget password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

// Reset password
router.put("/reset-password", resetPassword);

// Add a staff
router.post("/add", addStaff);

// Get all staff
router.get("/", getAllStaff);

// Get a staff by ID
router.get("/:id", getStaffById);

// Update a staff
router.put("/:id", updateStaff);

// Update staff status
router.put("/update-status/:id", updatedStatus);

// Delete a staff
router.delete("/:id", deleteStaff);

export default router;
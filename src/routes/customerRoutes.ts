import express from "express";
import {
  loginCustomer,
  registerCustomer,
  signUpWithProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addAllCustomers,
} from "../api/controller/customerController";
import {
  passwordVerificationLimit,
  emailVerificationLimit,
} from "../lib/email-sender/sender";

const router = express.Router();

// Verify email
router.post("/verify-email", emailVerificationLimit, verifyEmailAddress);

// Register a user
router.post("/register/:token", registerCustomer);

// Login a user
router.post("/login", loginCustomer);

// Register or login with Google and Facebook
router.post("/signup/:token", signUpWithProvider);

// Forget password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

// Reset password
router.put("/reset-password", resetPassword);

// Change password
router.post("/change-password", changePassword);

// Add all users
router.post("/add/all", addAllCustomers);

// Get all users
router.get("/", getAllCustomers);

// Get a user by ID
router.get("/:id", getCustomerById);

// Update a user
router.put("/:id", updateCustomer);

// Delete a user
router.delete("/:id", deleteCustomer);

export default router;
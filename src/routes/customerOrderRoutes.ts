import express from "express";
import {
  addOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
} from "../api/controller/customerOrderController";

const router = express.Router();

// Add an order
router.post("/add", addOrder);

// Create Stripe payment intent
router.post("/create-payment-intent", createPaymentIntent);

// Get an order by ID
router.get("/:id", getOrderById);

// Get all orders by a user
router.get("/", getOrderCustomer);

export default router;
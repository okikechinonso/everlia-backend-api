import express from "express";
import {
  getAllOrders,
  getOrderById,
  getOrderCustomer,
  updateOrder,
  deleteOrder,
  bestSellerProductChart,
  getDashboardOrders,
  getDashboardRecentOrder,
  getDashboardCount,
  getDashboardAmount,
} from "../api/controller/orderController";
import { isAdmin, isAuth } from "../config/auth";

const router = express.Router();

// Get all orders
router.get("/", getAllOrders);

// Get dashboard orders data
router.get("/dashboard", getDashboardOrders);

// Dashboard recent orders
router.get("/dashboard-recent-order", getDashboardRecentOrder);

// Dashboard order count
router.get("/dashboard-count", getDashboardCount);

// Dashboard order amount
router.get("/dashboard-amount", getDashboardAmount);

// Chart data for best-selling products
router.get("/best-seller/chart", bestSellerProductChart);

// Get all orders by a user
router.get("/customer/:id", getOrderCustomer);

// Get an order by ID
router.get("/:id", getOrderById);

// Update an order
router.put("/:id", updateOrder);

// Delete an order
router.delete("/:id", isAuth, deleteOrder);

export default router;
import express from "express";
import {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getShowingCoupons,
  getCouponById,
  updateCoupon,
  updateStatus,
  deleteCoupon,
  updateManyCoupons,
  deleteManyCoupons,
} from "../controller/couponController";

const router = express.Router();

// Add a coupon
router.post("/add", addCoupon);

// Add multiple coupons
router.post("/add/all", addAllCoupon);

// Get all coupons
router.get("/", getAllCoupons);

// Get only enabled coupons
router.get("/show", getShowingCoupons);

// Get a coupon by ID
router.get("/:id", getCouponById);

// Update a coupon
router.put("/:id", updateCoupon);

// Update many coupons
router.patch("/update/many", updateManyCoupons);

// Show/hide a coupon
router.put("/status/:id", updateStatus);

// Delete a coupon
router.delete("/:id", deleteCoupon);

// Delete many coupons
router.patch("/delete/many", deleteManyCoupons);

export default router;
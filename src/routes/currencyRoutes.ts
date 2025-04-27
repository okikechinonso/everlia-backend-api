import express from "express";
import {
  addCurrency,
  addAllCurrency,
  getAllCurrency,
  getShowingCurrency,
  getCurrencyById,
  updateCurrency,
  updateManyCurrency,
  updateEnabledStatus,
  updateLiveExchangeRateStatus,
  deleteCurrency,
  deleteManyCurrency,
} from "../controller/currencyController";

const router = express.Router();

// Add a currency
router.post("/add", addCurrency);

// Add all currencies
router.post("/add/all", addAllCurrency);

// Get only showing currencies
router.get("/show", getShowingCurrency);

// Get all currencies
router.get("/", getAllCurrency);

// Get a currency by ID
router.get("/:id", getCurrencyById);

// Update a currency
router.put("/:id", updateCurrency);

// Update many currencies
router.patch("/update/many", updateManyCurrency);

// Delete many currencies
router.patch("/delete/many", deleteManyCurrency);

// Delete a currency
router.delete("/:id", deleteCurrency);

// Show/hide a currency (enabled status)
router.put("/status/enabled/:id", updateEnabledStatus);

// Show/hide a currency (live exchange rates)
router.put("/status/live-exchange-rates/:id", updateLiveExchangeRateStatus);

export default router;
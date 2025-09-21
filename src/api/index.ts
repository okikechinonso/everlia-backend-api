import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import connectDB from "../config/db";
import productRoutes from "../routes/productRoutes";
import customerRoutes from "../routes/customerRoutes";
import adminRoutes from "../routes/adminRoutes";
import orderRoutes from "../routes/orderRoutes";
import customerOrderRoutes from "../routes/customerOrderRoutes";
import categoryRoutes from "../routes/categoryRoutes";
import couponRoutes from "../routes/couponRoutes";
import attributeRoutes from "../routes/attributeRoutes";
import settingRoutes from "../routes/settingRoutes";
import currencyRoutes from "../routes/currencyRoutes";
import languageRoutes from "../routes/languageRoutes";
import brandRoutes from "../routes/brandRoutes";
import { isAuth } from "../config/auth";
import logger from "./middleware/logger";
import axios from "axios";

dotenv.config();

connectDB();
const app = express();

// We are using this for the express-rate-limit middleware
// See: https://github.com/nfriedly/express-rate-limit
app.set("trust proxy", 1);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(logger())
app.use(helmet());
app.use(cors());

// Root route
app.get("/", (req, res) => {
  res.send("App works properly!");
});

// Routes for store front and admin dashboard
app.use("/api/products/", productRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/coupon/", couponRoutes);
app.use("/api/customer/", customerRoutes);
app.use("/api/order/", customerOrderRoutes);
app.use("/api/attributes/", attributeRoutes);
app.use("/api/setting/", settingRoutes);
app.use("/api/currency/", isAuth, currencyRoutes);
app.use("/api/language/", languageRoutes);
app.use("/api/brands/", brandRoutes);

// Routes for admin dashboard
app.use("/api/admin/", adminRoutes);
app.use("/api/orders/", orderRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

// Serve static files from the "public" directory
app.use("/static", express.static("public"));

// Serve the index.html file for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

if (process.env.ON_RENDER) {
  setInterval(() => {
    axios.get("https://everlia-backend-api.onrender.com")
      .then(response => {
        console.log("1")
        //console.log(⁠ Self-ping successful: ${response.data.timestamp} ⁠);
      })
      .catch(error => {
        // console.error('Self-ping failed:', error.message);
      });
  }, 1000 * 60 * 7);
}



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
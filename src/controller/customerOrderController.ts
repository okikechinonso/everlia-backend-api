import dotenv from "dotenv";
import Stripe from "stripe";
import mongoose from "mongoose";
import { Request, Response } from "express";
import Order from "../models/Order";
import { handleProductQuantity } from "../lib/stock-controller/others";
import { formatAmountForStripe } from "../lib/stripe/stripe";
import { cloudinaryUploadToImage } from "../lib/file-upload/cloudinary";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY as string, {
  apiVersion: "2020-08-27",
});

export const addOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.paymentReceipt) {
      throw new Error("Must provide receipt");
    }

    const imgResponse = await cloudinaryUploadToImage(req.body.paymentReceipt);
    const newOrder = new Order({
      ...req.body,
      user: req.body.user_info.email,
      paymentReceipt: imgResponse.secure_url,
    });

    const order = await newOrder.save();
    res.status(201).send(order);
    handleProductQuantity(order.cart);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  const { total: amount, cardInfo: payment_intent, email } = req.body;

  if (!(amount >= Number(process.env.MIN_AMOUNT) && amount <= Number(process.env.MAX_AMOUNT))) {
     res.status(500).json({ message: "Invalid amount." });
     return
  }

  if (payment_intent?.id) {
    try {
      const currentIntent = await stripe.paymentIntents.retrieve(payment_intent.id);
      if (currentIntent) {
        const updatedIntent = await stripe.paymentIntents.update(payment_intent.id, {
          amount: formatAmountForStripe(amount, process.env.CURRENCY as string),
        });
         res.send(updatedIntent);
      }
    } catch (err) {
      if ((err as Stripe.StripeError).code !== "resource_missing") {
         res.status(500).send({ message: (err as Error).message });
      }
    }
  }

  try {
    const params: Stripe.PaymentIntentCreateParams = {
      amount: formatAmountForStripe(amount, process.env.CURRENCY as string),
      currency: process.env.CURRENCY as string,
      description: process.env.STRIPE_PAYMENT_DESCRIPTION,
      automatic_payment_methods: {
        enabled: true,
      },
    };
    const paymentIntent = await stripe.paymentIntents.create(params);
    res.send(paymentIntent);
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const getOrderCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const totalDoc = await Order.countDocuments({ user: req.body._id });

    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "Pending",
          user: new mongoose.Types.ObjectId(req.body._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "Processing",
          user: new mongoose.Types.ObjectId(req.body._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          user: new mongoose.Types.ObjectId(req.body._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ]);

    const orders = await Order.find({ user: req.body._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      orders,
      limits,
      pages,
      pending: totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0].count,
      processing: totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      delivered: totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
      totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};
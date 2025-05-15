import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../../models/Order";
import { handleProductQuantity } from "../../lib/stock-controller/others";

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const { customerName, status, page, limit, day, startDate, endDate } = req.query;

  const date = new Date();
  const today = date
  date.setDate(date.getDate() - Number(day));

  const beforeToday = new Date();
  beforeToday.setDate(beforeToday.getDate() - 1);

  const startDateData = new Date(startDate as string);

  const queryObject: Record<string, any> = {};

  if (!status) {
    queryObject.$or = [
      { status: { $regex: "Pending", $options: "i" } },
      { status: { $regex: "Processing", $options: "i" } },
      { status: { $regex: "Delivered", $options: "i" } },
      { status: { $regex: "Cancel", $options: "i" } },
    ];
  }
 
  if (customerName) {
    queryObject.$or = [
      { "user_info.name": { $regex: customerName as string, $options: "i" } },
      { invoice: { $regex: customerName as string, $options: "i" } },
    ];
  }

  if (day) {
    queryObject.createdAt = { $gte: date, $lte: today };
  }

  if (status) {
    queryObject.status = { $regex: status as string, $options: "i" };
  }

  if (startDate && endDate) {
    queryObject.updatedAt = {
      $gte: startDateData,
      $lte: beforeToday,
    };
  }

  const pages = Number(page) || 1;
  const limits = Number(limit) || 10;
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Order.countDocuments(queryObject);
    const orders = await Order.find(queryObject)
      .select(
        "_id invoice paymentMethod subTotal total user_info discount shippingCost status createdAt updatedAt"
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      orders,
      limits,
      pages,
      totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getOrderCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ _id: -1 });
    res.send(orders);
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

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const newStatus = req.body.status;
    await Order.updateOne(
      { _id: req.params.id },
      { $set: { status: newStatus } }
    );
    res.status(200).send({
      message: "Order Updated Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    await Order.updateOne({ _id: req.params.id }, { deletedAt: new Date(), isDeleted: true, status: "Cancel"});
    const order = await Order.findOne({_id: req.params.id})
    const cart = order?.cart.map((e) => {
      e.quantity = -e.quantity
      return e
    })
    
    if (cart) await  handleProductQuantity(cart);
    res.status(200).send({
      message: "Order Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getDashboardRecentOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const queryObject: Record<string, any> = {
      $or: [
        { status: { $regex: "Pending", $options: "i" } },
        { status: { $regex: "Processing", $options: "i" } },
        { status: { $regex: "Delivered", $options: "i" } },
        { status: { $regex: "Cancel", $options: "i" } },
      ],
    };

    const totalDoc = await Order.countDocuments(queryObject);
    const orders = await Order.find(queryObject)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      orders,
      page: pages,
      limit: limits,
      totalOrder: totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

// get dashboard count
export const getDashboardCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalDoc = await Order.countDocuments();

    const totalPendingOrder = await Order.aggregate([
      { $match: { status: "Pending" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalProcessingOrder = await Order.aggregate([
      { $match: { status: "Processing" } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    const totalDeliveredOrder = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    res.send({
      totalOrder: totalDoc,
      totalPendingOrder: totalPendingOrder[0] || 0,
      totalProcessingOrder: totalProcessingOrder[0]?.count || 0,
      totalDeliveredOrder: totalDeliveredOrder[0]?.count || 0,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getDashboardAmount = async (req: Request, res: Response): Promise<void> => {
  const week = new Date();
  week.setDate(week.getDate() - 10);

  try {
    const totalAmount = await Order.aggregate([
      {
        $group: {
          _id: null,
          tAmount: { $sum: "$total" },
        },
      },
    ]);

    const thisMonthlyOrderAmount = await Order.aggregate([
      {
        $match: {
          status: { $regex: "Delivered", $options: "i" },
          $expr: { $eq: [{ $month: "$updatedAt" }, { $month: new Date() }] },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$updatedAt" } },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 1 },
    ]);

    const orderFilteringData = await Order.find({
      status: { $regex: "Delivered", $options: "i" },
      updatedAt: { $gte: week },
    }).select("paymentMethod paymentDetails total createdAt updatedAt");

    res.send({
      totalAmount: totalAmount[0]?.tAmount?.toFixed(2) || 0,
      thisMonthlyOrderAmount: thisMonthlyOrderAmount[0]?.total || 0,
      ordersData: orderFilteringData,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const bestSellerProductChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalDoc = await Order.countDocuments();
    const bestSellingProduct = await Order.aggregate([
      { $unwind: "$cart" },
      {
        $group: {
          _id: "$cart.title",
          count: { $sum: "$cart.quantity" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 4 },
    ]);

    res.send({
      totalDoc,
      bestSellingProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getDashboardOrders = async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = req.query;

  const pages = Number(page) || 1;
  const limits = Number(limit) || 8;
  const skip = (pages - 1) * limits;

  const week = new Date();
  week.setDate(week.getDate() - 10);

  const start = new Date()

  try {
    const totalDoc = await Order.countDocuments();

    const orders = await Order.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    const totalAmount = await Order.aggregate([
      {
        $group: {
          _id: null,
          tAmount: { $sum: "$total" },
        },
      },
    ]);

    const todayOrder = await Order.find({ createdAt: { $gte: start } });

    const totalAmountOfThisMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 1 },
    ]);

    const totalPendingOrder = await Order.aggregate([
      { $match: { status: "Pending" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalProcessingOrder = await Order.aggregate([
      { $match: { status: "Processing" } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    const totalDeliveredOrder = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    const weeklySaleReport = await Order.find({
      status: { $regex: "Delivered", $options: "i" },
      createdAt: { $gte: week },
    });

    res.send({
      totalOrder: totalDoc,
      totalAmount: totalAmount[0]?.tAmount?.toFixed(2) || 0,
      todayOrder,
      totalAmountOfThisMonth: totalAmountOfThisMonth[0]?.total || 0,
      totalPendingOrder: totalPendingOrder[0] || 0,
      totalProcessingOrder: totalProcessingOrder[0]?.count || 0,
      totalDeliveredOrder: totalDeliveredOrder[0]?.count || 0,
      orders,
      weeklySaleReport,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

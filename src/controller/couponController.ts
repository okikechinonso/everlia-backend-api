import { Request, Response } from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Coupon from "../models/Coupon";

dayjs.extend(utc);

export const addCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.send({ message: "Coupon Added Successfully!" });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const addAllCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    await Coupon.deleteMany();
    await Coupon.insertMany(req.body);
    res.status(200).send({
      message: "Coupon Added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getAllCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryObject: Record<string, any> = {};
    const { status } = req.query;

    if (status) {
      queryObject.status = { $regex: `${status}`, $options: "i" };
    }
    const coupons = await Coupon.find(queryObject).sort({ _id: -1 });
    res.send(coupons);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getShowingCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find({
      status: "show",
    }).sort({ _id: -1 });
    res.send(coupons);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getCouponById = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    res.send(coupon);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      coupon.title = { ...coupon.title, ...req.body.title };
      coupon.couponCode = req.body.couponCode;
      coupon.endTime = new Date(dayjs().utc().format(req.body.endTime));
      coupon.minimumAmount = req.body.minimumAmount;
      coupon.productType = req.body.productType;
      coupon.discountType = req.body.discountType;
      coupon.logo = req.body.logo;

      await coupon.save();
      res.send({ message: "Coupon Updated Successfully!" });
    } else {
      res.status(404).send({ message: "Coupon not found!" });
    }
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const updateManyCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    await Coupon.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: {
          status: req.body.status,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
        },
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Coupons updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const newStatus = req.body.status;

    await Coupon.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Coupon ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    await Coupon.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Coupon Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const deleteManyCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    await Coupon.deleteMany({ _id: req.body.ids });
    res.send({
      message: "Coupons Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};
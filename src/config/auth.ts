import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin";
import { User } from "../types/user";

dotenv.config();


export const signInToken = (user: User): string => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "2d",
    }
  );
};

export const tokenForVerify = (user: User): string => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET_FOR_VERIFY as string,
    { expiresIn: "15m" }
  );
};

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      throw new Error("Authorization header is missing");
    }
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (err) {
    res.status(401).send({
      message: (err as Error).message,
    });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const admin = await Admin.findOne({ role: "Admin" });
  if (admin) {
    next();
  } else {
    res.status(401).send({
      message: "User is not Admin",
    });
  }
};
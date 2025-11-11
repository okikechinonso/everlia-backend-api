import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

dotenv.config();

/**
 * Middleware stub to verify an external order token.
 *
 * Implementation notes:
 * - Not async: sends responses directly and returns void to satisfy Express types.
 */
export const verifyOrderToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = (req.headers["x-verify-token"] as string) || req.body?.verificationToken || req.body?.token;
  if (!token) {
    res.status(401).send({ message: "Verification token missing" });
    return;
  }

  const secret = process.env.ORDER_VERIFY_SECRET;
  if (secret) {
    try {
      const decoded = jwt.verify(token, secret);
      (req as any).verifiedToken = decoded;
      next();
      return;
    } catch (err) {
      res.status(401).send({ message: "Order verification failed" });
      return;
    }
  }

  // Dev stub: accept the literal token "stub-valid"
  if (token === "stub-valid") {
    (req as any).verifiedToken = { stub: true };
    next();
    return;
  }

  res.status(401).send({ message: "Order verification failed" });
};

export default verifyOrderToken;

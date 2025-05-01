import dotenv from "dotenv";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import Customer from "../../models/Customer";
import { signInToken, tokenForVerify } from "../../config/auth";
import { sendEmail } from "../../lib/email-sender/sender";
import { customerRegisterBody } from "../../lib/email-sender/templates/register";
import { forgetPasswordEmailBody } from "../../lib/email-sender/templates/forget-password";

dotenv.config();

export const verifyEmailAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdded = await Customer.findOne({ email: req.body.email });
    if (isAdded) {
       res.status(403).send({
        message: "This Email already Added!",
      });
      return;
    }

    const token = tokenForVerify(req.body);
    const option = {
      name: req.body.name,
      email: req.body.email,
      token,
    };
    const body = {
      from: process.env.EMAIL_USER as string,
      to: req.body.email,
      subject: "Verify Your Email",
      html: customerRegisterBody(option),
    };

    const message = "Please check your email to verify your account!";
    sendEmail(body, res, message);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};


export const registerCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.params.token;
    const { name, email, password } = jwt.decode(token) as {
      name: string;
      email: string;
      password: string;
    };

    const isAdded = await Customer.findOne({ email });
    if (isAdded) {
      const token = signInToken(isAdded);
       res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        message: "Email Already Verified!",
      });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY as string, async (err: Error | null) => {
      if (err) {
        return res.status(401).send({
          message: "Token Expired, Please try again!",
        });
      }

      const newUser = new Customer({
        name,
        email,
        password: hashSync(password, 14),
      });
      await newUser.save();
      const token = signInToken(newUser);
      res.send({
        token,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        message: "Email Verified, Please Login Now!",
      });
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const addAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    await Customer.deleteMany();
    await Customer.insertMany(req.body);
    res.send({
      message: "Added all users successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const loginCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findOne({ email: req.body.registerEmail });

    if (
      customer &&
      customer.password &&
      compareSync(req.body.password, customer.password)
    ) {
      const token = signInToken(customer);
      res.send({
        token,
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone: customer.phone,
        image: customer.image,
      });
    } else {
      res.status(401).send({
        message: "Invalid user or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdded = await Customer.findOne({ email: req.body.verifyEmail });
    if (!isAdded) {
       res.status(404).send({
        message: "User Not found with this email!",
      });
      return
    }

    const token = tokenForVerify(isAdded);
    const option = {
      name: isAdded.name,
      email: isAdded.email,
      token,
    };

    const body = {
      from: process.env.EMAIL_USER as string,
      to: req.body.verifyEmail,
      subject: "Password Reset",
      html: forgetPasswordEmailBody(option),
    };

    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.body.token;
    const { email } = jwt.decode(token) as { email: string };
    const customer = await Customer.findOne({ email })
    if (!customer) {
      throw new Error("customer not found")
    }

    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY as string, async (err: Error | null) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      }

      customer.password = hashSync(req.body.newPassword, 14);
      await customer.save();
      res.send({
        message: "Your password change successful, you can login now!",
      });
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      customer.name = req.body.name;
      customer.email = req.body.email;
      customer.address = req.body.address;
      customer.phone = req.body.phone;
      customer.image = req.body.image;
      const updatedUser = await customer.save();
      const token = signInToken(updatedUser);
      res.send({
        token,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        image: updatedUser.image,
      });
    } else {
      res.status(404).send({
        message: "Customer not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "User Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const signUpWithProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = jwt.decode(req.params.token) as { email: string; name: string; picture?: string };

    const isAdded = await Customer.findOne({ email: user.email });
    if (isAdded) {
      const token = signInToken(isAdded);
      res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        address: isAdded.address,
        phone: isAdded.phone,
        image: isAdded.image,
      });
    } else {
      const newUser = new Customer({
        name: user.name,
        email: user.email,
        image: user.picture,
      });

      const signUpCustomer = await newUser.save();
      const token = signInToken(signUpCustomer);
      res.send({
        token,
        _id: signUpCustomer._id,
        name: signUpCustomer.name,
        email: signUpCustomer.email,
        image: signUpCustomer.image,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer?.password) {
       res.send({
        message: "For change password, you need to sign in with email & password!",
      });
    } else if (compareSync(req.body.currentPassword, customer.password)) {
      customer.password = hashSync(req.body.newPassword, 14);
      await customer.save();
      res.send({
        message: "Your password changed successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid email or current password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await Customer.find({}).sort({ _id: -1 });
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};
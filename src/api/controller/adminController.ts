import { hashSync, compareSync } from "bcrypt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import jwt from "jsonwebtoken";
import { signInToken, tokenForVerify } from "../../config/auth";
import { sendEmail } from "../../lib/email-sender/sender";
import Admin from "../../models/Admin";
import { Request, Response } from "express";


dayjs.extend(utc);

export const registerAdmin = async (req: Request, res: Response)=> {
  try {
    console.log(req.body)
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
       res.status(403).send({
        message: "This Email already Added!",
      });
      return
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: hashSync(req.body.password, 14),
      });
      const staff = await newStaff.save();
      const token = signInToken(staff);
      res.send({
        token,
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        joiningData: Date.now(),
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
};


export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email, status: "Active" });
    if (admin && compareSync(req.body.password, admin.password)) {
      const token = signInToken(admin);
      res.send({
        token,
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,
      });
    } else {
      res.status(401).send({
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    const { message } = err as Error;
    res.status(500).send({
      message: message,
    });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  const isAdded = await Admin.findOne({ email: req.body.verifyEmail });
  if (!isAdded) {
     res.status(404).send({
      message: "Admin/Staff Not found with this email!",
    });
    return
  } else {
    const token = tokenForVerify(isAdded);
    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.verifyEmail}`,
      subject: "Password Reset",
      html: `<h2>Hello ${req.body.verifyEmail}</h2>
      <p>A request has been received to change the password for your <strong>Kachabazar</strong> account </p>
      <p>This link will expire in <strong>15 minutes</strong>.</p>
      <p style="margin-bottom:20px;">Click this link to reset your password:</p>
      <a href=${process.env.ADMIN_URL}/reset-password/${token} style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>
      <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@kachabazar.com</p>
      <p style="margin-bottom:0px;">Thank you</p>
      <strong>Kachabazar Team</strong>`,
    };
    const message = "Please check your email to reset your password!";
    sendEmail(body, res, message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const token = req.body.token;
  const { email } = jwt.decode(token) as { email: string };
  const staff = await Admin.findOne({ email: email });
  if (!staff) {
     res.status(404).send({
      message: "Admin/Staff Not found with this email!",
    });
    return
  }

  if (token) {
    const secret = process.env.JWT_SECRET_FOR_VERIFY;
    if (!secret) {
       res.status(500).send({
        message: "JWT secret is not defined in the environment variables.",
      });
      return
    }
    jwt.verify(token, secret, (err: jwt.VerifyErrors | null) => {
      if (err) {
         res.status(500).send({
          message: "Token expired, please try again!",
        });
        return
      } else {
        
        staff.password = hashSync(req.body.newPassword, 14);
        staff.save();
        res.send({
          message: "Your password has been changed successfully. You can log in now!",
        });
      }
    });
  }
};

export const addStaff = async (req: Request, res: Response) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.staffData.email });
    if (isAdded) {
       res.status(500).send({
        message: "This Email already Added!",
      });
      return
    } else {
      const newStaff = new Admin({
        name: req.body.staffData.name,
        email: req.body.staffData.email,
        password: hashSync(req.body.staffData.password, 14),
        phone: req.body.staffData.phone,
        joiningDate: req.body.staffData.joiningDate ? req.body.staffData.joiningDate : new Date(),
        role: req.body.staffData.role,
        image: req.body.staffData.image,
      });
      await newStaff.save();
      res.status(200).send({
        message: "Staff Added Successfully!",
      });
    }
  } catch (err) {
    const { message } = err as Error;
    res.status(500).send({
      message: message,
    });
  }
};

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const admins = await Admin.find({}).sort({ _id: -1 });
    res.send(admins);
  } catch (err) {
    const { message } = err as Error;
    res.status(500).send({
      message: message,
    });
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    const { message } = err as Error;
    res.status(500).send({
      message: message,
    });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });
    if (admin) {
      admin.name = req.body.name ;
      admin.email = req.body.email;
      admin.phone = req.body.phone;
      admin.role = req.body.role;
      admin.status = req.body.userstatus;
      admin.joiningData = req.body.joiningDate;
      admin.password =
        req.body.password !== undefined
          ? hashSync(req.body.password, 14)
          : admin.password;
      admin.image = req.body.image;
      const updatedAdmin = await admin.save();
      const token = signInToken(updatedAdmin);
      res.send({
        token,
        message: "Staff Updated Successfully!",
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        userid: updatedAdmin._id,
        image: updatedAdmin.image,
      });
    } else {
      res.status(404).send({
        message: "This Staff not found!",
      });
    }
  } catch (err) {
    const { message } = err as Error;
    res.status(500).send({
      message: message,
    });
  }
};

export const deleteStaff = (req: Request, res: Response) => {
  Admin.deleteOne({ _id: req.params.id }, (err: Error) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Admin Deleted Successfully!",
      });
    }
  });
};

export const updatedStatus = async (req: Request, res: Response) => {
  try {
    const newStatus = req.body.status;

    await Admin.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `Store ${newStatus} Successfully!`,
    });
  } catch (err) {
    const { message } = err as Error;
    res.status(500).send({
      message: message,
    });
  }
};
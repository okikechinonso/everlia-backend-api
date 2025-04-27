import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

const sendEmail = (body: nodemailer.SendMailOptions, res: any, message: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE, // comment this line if you use a custom server/domain
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // comment out this one if you use a custom server/domain
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  transporter.verify((err: Error | null, success: boolean) => {
    if (err) {
      res.status(403).send({
        message: `Error happened during verification: ${err.message}`,
      });
      console.error(err.message);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail(body, (err: Error | null, data: nodemailer.SentMessageInfo) => {
    if (err) {
      res.status(403).send({
        message: `Error happened when sending email: ${err.message}`,
      });
    } else {
      res.send({
        message: message,
      });
    }
  });
};

// Limit email verification and forget password requests
const minutes = 30;

const emailVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const passwordVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const supportMessageLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

export {
  sendEmail,
  emailVerificationLimit,
  passwordVerificationLimit,
  supportMessageLimit,
};
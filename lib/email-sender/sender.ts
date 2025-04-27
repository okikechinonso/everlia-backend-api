import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import SMTPPool from "nodemailer/lib/smtp-pool";

const sendEmail = (body: nodemailer.SendMailOptions, res: any, message: string) => {
  const transportPayload: SMTPPool.Options = {
    host: process.env.HOST as string,
    service: process.env.SERVICE, // comment this line if you use a custom server/domain
    port: process.env.EMAIL_PORT as unknown as number,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true
    // comment out this one if you use a custom server/domain
    // tls: {
    //   rejectUnauthorized: false,
    // },
  }
  const transporter = nodemailer.createTransport(transportPayload as SMTPPool.Options);

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
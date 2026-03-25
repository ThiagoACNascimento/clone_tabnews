import nodemailer from "nodemailer";
import { ServiceError } from "./errors.js";

const trasporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    password: process.env.EMAIL_SMTP_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production" ? true : false,
});

async function send(mailOptions) {
  try {
    
    await trasporter.sendMail(mailOptions);
  } catch (error) {
    throw new ServiceError({
      message: "Nao foi possivel enviar o email.",
      action: "Verifiique se o servico de email esta disponivel.",
      cause: error,
      context: mailOptions,
    })
  }
}

const email = {
  send,
};

export default email;

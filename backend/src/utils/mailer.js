import nodemailer from "nodemailer";

import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendEmail = async (email, subject, text) => {
  try {
    // const accessToken = await oauth2Client.getAccessToken();
    // const mailTransport = nodemailer.createTransport({
    //   host: "smtpout.secureserver.net",
    //   secure: true,
    //   secureConnection: false,
    //   tls: {
    //     ciphers: "SSLv3",
    //   },
    //   requireTLS: true,
    //   port: 465,
    //   debug: true,
    //   auth: {
    //     user: process.env.GODADDY_EMAIL,
    //     pass: process.env.GODADDY_PASSWORD,
    //   },
    // });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `Nikhil <${process.env.GMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text,
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export const sendResetEmail = async (email, link) => {
  const subject = "Password Reset";
  const text = `Click on this link to reset your password: ${link}. If you did not request this, please ignore this email and your password will remain unchanged.`;
  await sendEmail(email, subject, text);
};

export const sendActivationEmail = async (email, link) => {
  const subject = "Activate Your Account";
  const text = `Welcome! Please click on the following link to activate your account: ${link}. If you did not register, please ignore this email.`;
  await sendEmail(email, subject, text);
};
export const sendWelcomeEmail = async (email, password) => {
  const subject = "Welcome to The Organization";
  const text = `Welcome! Your account has been created successfully. Your password is ${password}, you can change your password ${process.env.FRONTEND_URL}/reset-password, or you can login using ${process.env.FRONTEND_URL}/login`;
  await sendEmail(email, subject, text);
};

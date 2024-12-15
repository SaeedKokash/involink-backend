// services/emailService.js

const nodemailer = require("nodemailer");
const logger = require("../config/logger");
require("dotenv").config(); // Ensure environment variables are loaded

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "mail.involink.io",
  port: process.env.EMAIL_PORT || 587, // Replace with your SMTP port
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME || "saeed.kokash@involink.io", // Your email username
    pass: process.env.EMAIL_PASSWORD || "your-email-password", // Your email password
  },
});

/**
 * Send a verification email to the user.
 * @param {string} to - Recipient's email address.
 * @param {string} token - Verification token.
 */
exports.sendVerificationEmail = async (to, token) => {
  const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Involink Support" <${process.env.EMAIL_USERNAME || "saeed.kokash@involink.io"}>`, // Sender address
    to, // Recipient address
    subject: "Verify Your Email Address",
    text: `Hello,

Thank you for registering with Involink. Please verify your email by clicking the link below:

${verificationUrl}

If you did not create an account, please ignore this email.

Best regards,
Involink Team`,
    html: `<p>Hello,</p>
<p>Thank you for registering with Involink. Please verify your email by clicking the link below:</p>
<a href="${verificationUrl}">Verify Email</a>
<p>If you did not create an account, please ignore this email.</p>
<p>Best regards,<br/>Involink Team</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    logger.error(`Error sending verification email to ${to}: ${error.message}`);
    throw new Error("Could not send verification email");
  }
};

exports.sendInvoiceEmail = async (invoice, pdfPath) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: invoice.contact_email,
    subject: `Invoice ${invoice.invoice_number}`,
    text: `Dear ${invoice.contact_name},\n\nPlease find attached your invoice.\n\nThank you.`,
    attachments: [
      {
        filename: `invoice_${invoice.invoice_number}.pdf`,
        path: pdfPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

exports.sendPaymentConfirmationEmail = async (invoice) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: invoice.contact_email,
    subject: `Payment Received for Invoice ${invoice.invoice_number}`,
    text: `Dear ${invoice.contact_name},\n\nWe have received your payment for invoice ${invoice.invoice_number}.\n\nThank you.`,
  };

  await transporter.sendMail(mailOptions);
};

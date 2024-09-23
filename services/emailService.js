// services/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Use your email service configuration
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
// services/pdfService.js

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Invoice, InvoiceItem, Contact, Store } = require('../models');

exports.generateInvoicePDF = async (invoiceId) => {
  // Fetch invoice data
  const invoice = await Invoice.findByPk(invoiceId, {
    include: [
      { model: InvoiceItem },
      { model: Contact },
    ],
  });

  if (!invoice) {
    throw new Error('Invoice not found.');
  }

  const doc = new PDFDocument();

  const fileName = `invoice_${invoice.invoice_number}.pdf`;
  const filePath = path.join(__dirname, '..', 'invoices', fileName);

  // Ensure the invoices directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  doc.pipe(fs.createWriteStream(filePath));

  // Add content to the PDF (simplified example)
  doc.fontSize(20).text(`Invoice: ${invoice.invoice_number}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Date: ${invoice.invoiced_at}`);
  doc.text(`Due Date: ${invoice.due_at}`);
  doc.text(`Bill To: ${invoice.Contact.name}`);
  doc.moveDown();

  // Add table of items
  invoice.InvoiceItems.forEach((item) => {
    doc.text(`${item.name} - ${item.quantity} x ${item.price} = ${item.total}`);
  });

  doc.moveDown();
  doc.text(`Total Amount: ${invoice.amount}`);

  doc.end();

  return filePath;
};

exports.generateInvoiceNumber = async (storeId) => {
  const store = await Store.findByPk(storeId);
  if (!store) {
    return null;
  }

  const lastInvoice = await Invoice.findOne({
    where: { store_id: storeId },
    order: [['createdAt', 'DESC']],
  });

  if (!lastInvoice) {
    return `${store.prefix}-0001`;
  }

  const lastInvoiceNumber = lastInvoice.invoice_number;
  const lastNumber = parseInt(lastInvoiceNumber.split('-')[1]);
  const newNumber = lastNumber + 1;
  const newInvoiceNumber = `${store.prefix}-${newNumber.toString().padStart(4, '0')}`;
  return newInvoiceNumber;
};


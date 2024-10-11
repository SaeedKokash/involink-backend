// services/pdfService.js

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Invoice, InvoiceItem, Contact, Store } = require('../models');

exports.generateInvoicePDFHelper = async (invoiceId) => {
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
  const filePath = path.join(__dirname, '..', 'media', 'invoices', fileName);

  // Ensure the invoices directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

   // **Define the writeStream before using it**
   const writeStream = fs.createWriteStream(filePath);
   doc.pipe(writeStream);
 
   // Add content to the PDF (simplified example)
   doc.fontSize(20).text(`Invoice: ${invoice.invoice_number}`, { align: 'center' });
   doc.moveDown();
   doc.fontSize(12).text(`Date: ${new Date(invoice.invoiced_at).toLocaleDateString()}`);
   doc.text(`Due Date: ${new Date(invoice.due_at).toLocaleDateString()}`);
   doc.text(`Bill To: ${invoice.Contact.name}`);
   doc.moveDown();
 
   // Add table of items
   invoice.InvoiceItems.forEach((item) => {
     doc.text(`${item.name} - ${item.quantity} x ${item.price} = ${item.total}`);
   });
 
   doc.moveDown();
   doc.text(`Total Amount: ${invoice.amount}`);
 
   doc.end();
 
   // **Listen to 'finish' and 'error' events on the writeStream**
   return new Promise((resolve, reject) => {
     writeStream.on('finish', () => {
       console.log(`PDF generated at ${filePath}`);
       resolve(filePath);
     });
 
     writeStream.on('error', (err) => {
       console.error('Error generating PDF:', err);
       reject(err);
     });
   });
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


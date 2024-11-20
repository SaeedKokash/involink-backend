// services/pdfService.js

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Invoice, InvoiceItem, Contact, Store } = require('../models');
const ejs = require('ejs');
const puppeteer = require('puppeteer');

exports.generateInvoicePDFHelperPDFKit = async (invoiceId) => {
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

exports.generateInvoicePDFHelper = async (invoiceId) => {
  // Fetch invoice data
  const invoice = await Invoice.findByPk(invoiceId, {
    include: [
      { model: InvoiceItem },
      { model: Contact },
      { model: Store },
    ],
  });

  if (!invoice) {
    throw new Error('Invoice not found.');
  }

  // Define paths for the template and output
  const templatePath = path.join(__dirname, '..', 'templates', 'modern.html');
  const cssPath = path.join(__dirname, '..', 'templates', 'modern.css');
  const outputDir = path.join(__dirname, '..', 'media', 'invoices');
  const outputFile = `invoice_${invoice.invoice_number}.pdf`;
  const outputPath = path.join(outputDir, outputFile);

  // Ensure the output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(invoice.InvoiceItems)

  // Load and render the HTML template with EJS
  const template = fs.readFileSync(templatePath, 'utf-8');
  const renderedHtml = ejs.render(template, {
    logoUrl: "https://cdn1.site-media.eu/images/0/11998013/Diagonal-B-transparent.png",
    companyName: invoice.Store ? invoice.Store.name : "Your Company",
    invoiceNumber: invoice.invoice_number,
    poNumber: invoice.order_number || "N/A",
    invoiceDate: new Date(invoice.invoiced_at).toLocaleDateString(),
    dueDate: new Date(invoice.due_at).toLocaleDateString(),
    balanceDue: invoice.amount,
    items: invoice.InvoiceItems.map(item => ({
      name: item.name || "No Name",
      description: item.description ? item.description : "No description",
      unitCost: item.price,
      quantity: item.quantity,
      lineTotal: item.price * item.quantity
    })),
    customerName: invoice.Contact ? invoice.Contact.name : "No Customer Name",
    customerEmail: invoice.Contact ? invoice.Contact.email : "No Customer Email",
    customerPhone: invoice.Contact ? invoice.Contact.phone : "No Customer Phone",
    customerAddress: invoice.Contact ? invoice.Contact.address : "No Address",
    subtotal: invoice.amount,
    discount: "10",
    footerCompanyName: "Involink",
    footerContact: "contact@involink.io",
    footerAddress: "Wadi Saqra, Jordan",
  });

  // Use Puppeteer to generate the PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Disable sandboxing
  });

  const page = await browser.newPage();

  // Embed CSS into the HTML template
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  const styledHtml = `
    <style>${cssContent}</style>
    ${renderedHtml}
  `;

  await page.setContent(styledHtml, { waitUntil: 'load' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
  });
  await browser.close();

  return outputPath; // Return the path of the generated PDF
};


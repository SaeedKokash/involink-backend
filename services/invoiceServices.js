// services/pdfService.js

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Invoice, InvoiceItem, Contact, Store, Item, Tax } = require('../models');
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
  // Fetch invoice data with necessary associations
  const invoice = await Invoice.findByPk(invoiceId, {
    include: [
      {
        model: InvoiceItem,
        include: [
          {
            model: Item,
            include: [Tax], // Include associated Tax models
          },
        ],
      },
      { model: Contact },
      { model: Store },
    ],
  });

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  // Initialize variables
  let itemsData = [];
  let totalAmount = 0;
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  // Process each InvoiceItem
  for (const item of invoice.InvoiceItems) {
    const itemData = item.Item; // Associated Item data
    const description = itemData ? itemData.description : "No Description";

    // Calculate line total
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    // Calculate discount amount
    let discountAmount;
    if (item.discount_type === "percentage") {
      discountAmount = (lineTotal * item.discount_rate) / 100;
    } else {
      discountAmount = item.discount_rate;
    }
    totalDiscount += discountAmount;

    // Calculate taxable amount
    const taxableAmount = lineTotal - discountAmount;

    // Calculate tax amount
    let taxAmount = 0;
    if (item.taxes && item.taxes.length > 0) {
      for (const taxId of item.taxes) {
        const tax = await Tax.findByPk(taxId);
        if (tax) {
          taxAmount += (taxableAmount * tax.rate) / 100;
        }
      }
    } else if (itemData && itemData.Tax) {
      // If no taxes specified in InvoiceItem, use the item's default tax
      taxAmount += (taxableAmount * itemData.Tax.rate) / 100;
    }
    totalTax += taxAmount;

    // Calculate total amount for this item
    const totalItemAmount = taxableAmount + taxAmount;
    totalAmount += totalItemAmount;

    // Prepare item data for the template
    itemsData.push({
      name: item.name || "No Name",
      unitCost: item.price.toFixed(2),
      quantity: item.quantity,
      lineTotal: totalItemAmount.toFixed(2),
      description: description,
      discount: `${item.discount_rate} ${
        item.discount_type === "percentage" ? "%" : invoice.currency_code
      }`,
      taxes: taxAmount.toFixed(2),
    });
  }

  // Define paths for the template and output
  const templatePath = path.join(__dirname, "..", "templates", "modern.html");
  const cssPath = path.join(__dirname, "..", "templates", "modern.css");
  const outputDir = path.join(__dirname, "..", "media", "invoices");
  const outputFile = `invoice_${invoice.invoice_number}.pdf`;
  const outputPath = path.join(outputDir, outputFile);

  // Ensure the output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Load the CSS file and convert it to a Data URI
  const cssContent = fs.readFileSync(cssPath, "utf-8");
  const cssDataUri = `data:text/css;base64,${Buffer.from(cssContent).toString(
    "base64"
  )}`;

  // Load and render the HTML template with EJS
  const template = fs.readFileSync(templatePath, "utf-8");

  const renderedHtml = ejs.render(template, {
    logoUrl:
      "https://cdn1.site-media.eu/images/0/11998013/Diagonal-B-transparent.png",
    companyName: invoice.Store ? invoice.Store.name : "Your Company",
    invoiceNumber: invoice.invoice_number,
    poNumber: invoice.order_number || "N/A",
    invoiceDate: new Date(invoice.invoiced_at).toLocaleDateString(),
    dueDate: new Date(invoice.due_at).toLocaleDateString(),
    balanceDue: totalAmount.toFixed(2),
    currencyCode: invoice.currency_code,
    items: itemsData,
    customerName: invoice.Contact ? invoice.Contact.name : "No Customer Name",
    customerEmail: invoice.Contact
      ? invoice.Contact.email
      : "No Customer Email",
    customerPhone: invoice.Contact
      ? invoice.Contact.phone
      : "No Customer Phone",
    customerAddress: invoice.Contact ? invoice.Contact.address : "No Address",
    customerTaxNumber: invoice.Contact
      ? invoice.Contact.tax_number
      : "No Tax Number",
    subtotal: subtotal.toFixed(2),
    discount: totalDiscount.toFixed(2),
    tax: totalTax.toFixed(2),
    footerCompanyName: "Involink",
    footerContact: "contact@involink.io",
    footerAddress: "Wadi Saqra, Jordan",
  });

  // Replace the href in the <link> tag with the Data URI
  const modifiedHtml = renderedHtml.replace(
    '<link rel="stylesheet" href="modern.css" />',
    `<link rel="stylesheet" href="${cssDataUri}" />`
  );

  // Use Puppeteer to generate the PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Disable sandboxing
  });

  const page = await browser.newPage();

  // Set the HTML content with the modified CSS link
  await page.setContent(modifiedHtml, { waitUntil: "load" });

  // Generate the PDF
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return outputPath; // Return the path of the generated PDF
};


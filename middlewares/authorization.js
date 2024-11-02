// middleware/authorization.js
const { UserStore, Item, Contact, Account, Tax, Invoice } = require('../models');

exports.authorizeStoreAccess = async (req, res, next) => {
  const userId = req.user.id;
  const storeId = req.body.store_id || req.params.store_id;

  console.log('authorize mw params', req.params);

  // Check if user has access to the store
  const userStore = await UserStore.findOne({
    where: { user_id: userId, store_id: storeId },
  });

  if (!userStore) {
    return res.status(403).json({ error: 'You are not authorized to access this store' });
  }

  next();
};

exports.authorizeItemAccess = async (req, res, next) => {
  const userId = req.user.id;
  const itemId = req.params.item_id;

  // Find the item and get its store_id
  const item = await Item.findByPk(itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  // Check if user has access to the store
  const userStore = await UserStore.findOne({
    where: { user_id: userId, store_id: item.store_id },
  });

  if (!userStore) {
    return res.status(403).json({ error: 'You are not authorized to access this item' });
  }
  next();
};

exports.authorizeContactAccess = async (req, res, next) => {
  const userId = req.user.id;
  const contactId = req.params.contact_id;

  // Find the contact and get its store_id
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  // Check if user has access to the store
  const userStore = await UserStore.findOne({
    where: { user_id: userId, store_id: contact.store_id },
  });

  if (!userStore) {
    return res.status(403).json({ error: 'You are not authorized to access this contact' });
  }

  console.log('User has access to the contact');
  next();
};

exports.authorizeAccountAccess = async (req, res, next) => {
  const userId = req.user.id;
  const accountId = req.params.account_id;

  // Find the account and get its store_id
  const account = await Account.findByPk(accountId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  // Check if user has access to the store
  const userStore = await UserStore.findOne({
    where: { user_id: userId, store_id: account.store_id },
  });

  if (!userStore) {
    return res.status(403).json({ error: 'You are not authorized to access this account' });
  }
  next();
};

exports.authorizeTaxAccess = async (req, res, next) => {
  const userId = req.user.id;
  const taxId = req.params.tax_id;

  // Find the tax and get its store_id
  const tax = await Tax.findByPk(taxId);
  if (!tax) {
    return res.status(404).json({ error: 'Tax not found' });
  }

  // Check if user has access to the store
  const userStore = await UserStore.findOne({
    where: { user_id: userId, store_id: tax.store_id },
  });

  if (!userStore) {
    return res.status(403).json({ error: 'You are not authorized to access this tax' });
  }
  next();
};

exports.authorizeInvoiceAccess = async (req, res, next) => {
  const userId = req.user.id;
  const invoiceId = req.params.invoice_id;

  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  const userStore = await UserStore.findOne({
    where: { user_id: userId, store_id: invoice.store_id },
  });

  if (!userStore) {
    return res.status(403).json({ error: 'You are not authorized to access this invoice' });
  }
  next();
};
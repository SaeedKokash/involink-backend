'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

const port = process.env.PORT || 4000;

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const storeRoutes = require('./routes/store.routes');
const itemRoutes = require('./routes/item.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const rtpRoutes = require('./routes/rtp.routes');
const accountRoutes = require('./routes/account.routes');
const contactRoutes = require('./routes/contact.routes');
const taxRoutes = require('./routes/tax.routes');

const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');
const requestLogger = require('./middlewares/requestLogger');
const limiter = require('./middlewares/rateLimiter');

const helmet = require('helmet');
// const morgan = require('morgan');
const logger = require('./config/logger');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());
app.use(requestLogger);
app.use(limiter); // Apply rate limiter to all requests

// app.use(morgan('combined', {
//   stream: {
//     write: (message) => logger.info(message.trim()),
//   },
// }));

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware.protect, userRoutes);
app.use('/api/stores', authMiddleware.protect, authMiddleware.restrictTo('merchant', 'admin'), storeRoutes);
app.use('/api/items', authMiddleware.protect, authMiddleware.restrictTo('merchant, admin'), itemRoutes);
app.use('/api/invoices', authMiddleware.protect, invoiceRoutes);
app.use('/api/rtps', authMiddleware.protect, rtpRoutes);
app.use('/api/accounts', authMiddleware.protect, accountRoutes);
app.use('/api/contacts', authMiddleware.protect, contactRoutes);
app.use('/api/taxes', authMiddleware.protect, taxRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome To involink API");
});

app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Not Found',
  });
});

function start() {
  app.listen(port, () => logger.info(`Server running on port ${port} in ${process.env.NODE_ENV} mode`), console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`));
}

module.exports = {
  app,
  start,
};
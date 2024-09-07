'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

const port = process.env.PORT || 4000;

const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const itemRoutes = require('./routes/itemRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');
const requestLogger = require('./middlewares/requestLogger');
const limiter = require('./middlewares/rateLimiter');

const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./config/logger');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());
app.use(requestLogger);
app.use(limiter); // Apply rate limiter to all requests

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

app.use('/api/users', authRoutes);
app.use('/api/stores', authMiddleware.protect, authMiddleware.restrictTo('merchant'), storeRoutes);
app.use('/api/items', authMiddleware.protect, authMiddleware.restrictTo('merchant'), itemRoutes);
app.use('/api/invoices', authMiddleware.protect, invoiceRoutes);
app.use('/api/payments', authMiddleware.protect, paymentRoutes);

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
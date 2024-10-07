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
const morgan = require('morgan');
const logger = require('./config/logger');

const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Allow credentials (cookies)
};

// Handling Multiple Origins (Optional):
// If you have multiple allowed origins (e.g., for development, staging, production), you can modify the corsOptions to dynamically set the origin:

// const allowedOrigins = ['http://localhost:3000', 'http://your-production-domain.com'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };

app.use(cors(corsOptions));
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

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware.authenticate, userRoutes);
app.use('/api/stores', authMiddleware.authenticate, authMiddleware.authorize('merchant', 'admin'), storeRoutes);
app.use('/api/items', authMiddleware.authenticate, authMiddleware.authorize('merchant', 'admin'), itemRoutes);
app.use('/api/invoices', authMiddleware.authenticate,authMiddleware.authorize('merchant', 'admin'), invoiceRoutes);
app.use('/api/rtps', authMiddleware.authenticate,authMiddleware.authorize('merchant', 'admin'), rtpRoutes);
app.use('/api/accounts', authMiddleware.authenticate,authMiddleware.authorize('merchant', 'admin'), accountRoutes);
app.use('/api/contacts', authMiddleware.authenticate,authMiddleware.authorize('merchant', 'admin'), contactRoutes);
app.use('/api/taxes', authMiddleware.authenticate,authMiddleware.authorize('merchant', 'admin'), taxRoutes);

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
'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

const port = process.env.PORT || 4000;

const routes = require('./routes/index');

const errorHandler = require('./middlewares/errorMiddleware');
const requestLogger = require('./middlewares/requestLogger');
const limiter = require('./middlewares/rateLimiter');

const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./config/logger');


// const corsOptions = {
//   origin: 'http://localhost:3000', // Frontend URL
//   credentials: true, // Allow credentials (cookies)
// };

// Handling Multiple Origins (Optional):
// If you have multiple allowed origins (e.g., for development, staging, production), you can modify the corsOptions to dynamically set the origin:

const allowedOrigins = ['http://localhost:3000', 'https://involink.netlify.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

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

// all routes are prefixed with /api
app.use('/api', routes);

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
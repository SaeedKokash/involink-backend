# Logger Middleware

const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const { createLogger, transports, format } = winston;

// Initialize Express app
const app = express();

// Configure Winston for general logging
const logger = createLogger({
  level: 'info', // Set log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    // Log to console
    new transports.Console(),
    // Log to file
    new transports.File({ filename: 'combined.log' })
  ],
});

// Custom stream object for Morgan to use Winston's logger
const morganStream = {
  write: (message) => {
    // Morgan outputs a newline at the end of each log, so we trim the message
    logger.info(message.trim());
  },
};

// Setup Morgan to log HTTP requests, using the 'combined' format
app.use(morgan('combined', { stream: morganStream }));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Hello World!');
  logger.info('Hello World route was called');
});

// Handle error routes
app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

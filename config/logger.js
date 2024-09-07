const { createLogger, transports, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const config = require('./config.js');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create a logger with dynamic log level from the config
const logger = createLogger({
  level: dbConfig.logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    // new transports.Console(),  // Logs to console
    new DailyRotateFile({
      filename: 'logs/involink-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});

// Additional transport examples (optional):
// logger.add(new transports.Http({
//   host: 'logs-01.loggly.com',
//   path: '/inputs/YOUR_LOGGLY_TOKEN/tag/http/',
// }));

module.exports = logger;

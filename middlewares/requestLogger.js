const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`, { params: req.params, body: req.body });
  next();
};

module.exports = requestLogger;

// const morgan = require('morgan');
// const fs = require('fs');

// // Create a write stream (in append mode)
// const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });

// // Create a custom token for logging the modified ISO date
// morgan.token('modifiedIsoDate', (req, res, format) => {
//     // Get the current date in ISO format
//     const isoDate = new Date().toISOString();

//     // Parse the ISO date and add 3 hours
//     const modifiedDate = new Date(new Date(isoDate).getTime() + 3 * 60 * 60 * 1000);

//     // Format the modified date according to the desired format
//     const formattedDate = modifiedDate.toISOString().replace(/\.\d{3}Z$/, '');

//     return formattedDate;
// });

// // Define a custom format with the modified date token
// const logFormat = ':method :url :status :res[content-length] - :response-time ms [:modifiedIsoDate]';

// // Create the request logger middleware using Morgan
// const fileLogger = morgan(logFormat, { stream: accessLogStream });

// const consoleLogger = morgan(logFormat);

// // const requestLogger = (req, res, next) => {
// //     if (process.env.NODE_ENV === 'production') {
// //         fileLogger(req, res, next);
// //     } else {
// //         consoleLogger(req, res, next);
// //     }
// // };

// const requestLogger = (req, res, next) => {
//     // use the file logger and the console logger in development
//     fileLogger(req, res, () => {
//         consoleLogger(req, res, next);
//     }
//     );
// }


// module.exports = requestLogger;
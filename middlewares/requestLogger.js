const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`, { params: req.params, body: req.body });
  next();
};

module.exports = requestLogger;

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    port: "5432",
    logLevel: process.env.LOG_LEVEL || "debug",
    username: process.env.DB_DEV_USER,
    password: process.env.DB_DEV_PASS,
    database: process.env.DB_DEV_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  test: {
    port: "5432",
    logLevel: process.env.LOG_LEVEL || "error",
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASS,
    database: process.env.DB_TEST_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  production: {
    port: "5432",
    logLevel: process.env.LOG_LEVEL || "warn",
    username: process.env.DB_PROD_USER,
    password: process.env.DB_PROD_PASS,
    database: process.env.DB_PROD_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  azure: {
    port: "5432",
    logLevel: process.env.LOG_LEVEL || "warn",
    username: process.env.DB_DEV_USER_AZURE,
    password: process.env.DB_DEV_PASS_AZURE,
    database: process.env.DB_DEV_NAME_AZURE,
    host: process.env.DB_HOST_AZURE,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
};

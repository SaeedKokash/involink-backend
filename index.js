require("dotenv").config();
const server = require("./server.js");
const db = require("./models").sequelize; // You can also use .models.index to be more explicit

// Synchronize the models with the database and start the server
db.sync({ alter: true }) // 'force', 'alter: true' will auto-update the database without losing data; remove it in production
  .then(() => {
    // const port = process.env.PORT || 4001;
    server.start();
    console.log("Conneted to Postgress")
  })
  .catch(error => {
    console.error("Failed to start the server or connect to the database", error);
  });
require("dotenv").config();
const server = require("./server.js");
const db = require("./models").sequelize; // You can also use .models.index to be more explicit

const { seedUsers } = require("./seeders/users.seed");

const DB_SYNC = process.env.DB_SYNC || "alter";

const databaseSyncStatus = {
  force: "force",
  alter: "alter",
  // none: "none",
};

// if force: true, seed the database with users

if (DB_SYNC === databaseSyncStatus.force) {
  db.sync({ force: true })
    .then(() => {
      server.start();
      seedUsers();
      console.log("Database reset and seeded with new users");
    })
    .catch((error) => {
      console.error("Failed to sync the database", error);
    });
}

// if force: false, alter: true, seed the database with users
else if (DB_SYNC === databaseSyncStatus.alter) {
  db.sync({ alter: true })
    .then(() => {
      server.start();
      console.log("Database synced and seeded with last users");
    })
    .catch((error) => {
      console.error("Failed to sync the database", error);
    });
}

// if force: false, alter: false, seed the database with users
else if (DB_SYNC === undefined) {
  db.sync()
    .then(() => {
      server.start();
      console.log("Database synced and connected to PostgreSQL");
    })
    .catch((error) => {
      console.error("Failed to sync the database", error);
    });
}

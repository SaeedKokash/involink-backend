require("dotenv").config();
const server = require("./server.js");
const db = require("./models").sequelize;

const { seedUsers } = require("./seeders/users.seed");
const { seedRoles } = require("./seeders/role.seed");

const DB_SYNC = process.env.DB_SYNC || "none"; // Set "none" as default if not provided

const databaseSyncStatus = {
  force: "force",
  alter: "alter",
  none: "none",
};

async function syncDatabase() {
  try {
    if (DB_SYNC === databaseSyncStatus.force) {
      await db.sync({ force: true });
      console.log("Database reset.");
      await seedRoles();
      console.log("Seeded with new roles.");
      await seedUsers();
      console.log("Seeded with new users.");
    } else if (DB_SYNC === databaseSyncStatus.alter) {
      await db.sync({ alter: true });
      console.log("Database synced with alterations.");
    } else {
      await db.sync();
      console.log("Database synced without alterations.");
    }
    startServer();
  } catch (error) {
    console.error("Failed to sync the database:", error);
  }
}

function startServer() {
  server.start();
  console.log("Server running and connected to database.");
}

// Only sync the database if DB_SYNC is set to "force" or "alter"
if (DB_SYNC !== databaseSyncStatus.none) {
  syncDatabase();
} else {
  startServer(); // Start server without syncing database
}
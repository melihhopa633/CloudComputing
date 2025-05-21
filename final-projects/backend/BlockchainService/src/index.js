const express = require("express");
const bodyParser = require("body-parser");
const { setupApiRoutes } = require("./metrics");
const db = require("./database");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
db.initializeDatabase().then((success) => {
  if (!success) {
    console.error("Failed to initialize database");
    process.exit(1);
  }
});

// Setup routes with empty contract object for now
setupApiRoutes(app, {});

// Start server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { setupApiRoutes } = require("./metrics");
const { startCollecting } = require("./metrics-collector");
const db = require("./database");
const config = require("./config");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const dbStatus = (await db.testConnection()) ? "connected" : "error";
    res.json({
      status: "ok",
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
});

// Initialize services
async function initialize() {
  try {
    console.log("Starting service initialization...");

    // Initialize database first and retry if needed
    let dbInitialized = false;
    let retries = 5;

    while (!dbInitialized && retries > 0) {
      try {
        dbInitialized = await db.initializeDatabase();
        if (dbInitialized) {
          console.log("Database initialized successfully");
          break;
        }
      } catch (error) {
        console.error(
          `Database initialization attempt failed (${retries} retries left):`,
          error
        );
        retries--;
        if (retries > 0) {
          console.log("Waiting 5 seconds before retrying...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }

    if (!dbInitialized) {
      throw new Error("Database initialization failed after multiple attempts");
    }

    // Verify database schema
    try {
      const result = await db.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'metrics'
        ORDER BY ordinal_position;
      `);

      console.log("Current database schema:");
      result.forEach((col) => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });
    } catch (error) {
      console.error("Error verifying database schema:", error);
      throw error;
    }

    // Start metrics collection
    const TEST_USER_EMAIL =
      process.env.TEST_USER_EMAIL || "testuser@example.com";
    console.log("Starting metrics collection for user:", TEST_USER_EMAIL);

    const blockchainConfig = {
      contractAddress: config.blockchain.contractAddress,
      privateKey: config.blockchain.privateKey,
      rpcUrl: config.blockchain.rpcUrl,
    };

    // Setup API routes before starting collection
    setupApiRoutes(app, {});
    console.log("API routes initialized");

    // Start metrics collection last
    startCollecting(TEST_USER_EMAIL, blockchainConfig);
    console.log("Metrics collection started");

    return app;
  } catch (error) {
    console.error("Fatal initialization error:", error);
    throw error;
  }
}

module.exports = { app, initialize };

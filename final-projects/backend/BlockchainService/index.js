require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const { setupApiRoutes } = require("./src/metrics");
const db = require("./src/database");

// Veritabanını başlat
(async () => {
  await db.initializeDatabase();
})();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const ABI = [
  "function recordMetric(string containerId, uint256 memoryMB, uint256 cpuUsage, uint256 timestamp)",
  "function getMetricCount() view returns (uint256)",
  "function getMetric(uint256 index) view returns (string, uint256, uint256, uint256)",
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC).connect(provider);
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

setupApiRoutes(app, contract);

app.listen(PORT, () => {
  console.log(`BlockchainService listening on port ${PORT}`);
});

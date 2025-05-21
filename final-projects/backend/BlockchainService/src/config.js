module.exports = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4002,
    cors: {
      origin: ["http://localhost:3000", "http://localhost:4002"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  },
  database: {
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5435,
    database: process.env.PG_DATABASE || "blockchain_metrics",
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "blockchain",
    ssl: false,
  },
  blockchain: {
    contractAddress: process.env.CONTRACT_ADDRESS || "0x123...",
    privateKey: process.env.PRIVATE_KEY || "0xabc...",
    rpcUrl: process.env.RPC_URL || "http://localhost:8545",
    gasLimit: 500000,
    gasPrice: "20000000000",
  },
  metrics: {
    collectionInterval: 60000,
    cleanupInterval: 3600000,
    retentionPeriod: 7 * 24 * 3600000,
  },
  logging: {
    level: "debug",
    format: "combined",
  },
};

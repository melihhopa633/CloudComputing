const crypto = require("crypto");

class BlockchainSimulator {
  constructor() {
    this.currentBlockNumber = 1000000; // Başlangıç block numarası
    this.lastBlockTime = Date.now();
    this.pendingTransactions = [];
    this.blockInterval = 15000; // 15 saniye (Ethereum benzeri)
  }

  // Gerçekçi transaction hash oluştur
  generateTransactionHash(data) {
    const timestamp = Date.now();
    const nonce = Math.floor(Math.random() * 1000000);
    const input = JSON.stringify(data) + timestamp + nonce;
    return "0x" + crypto.createHash("sha256").update(input).digest("hex");
  }

  // Gerçekçi block number oluştur (zamanla artan)
  getCurrentBlockNumber() {
    const now = Date.now();
    const timeSinceLastBlock = now - this.lastBlockTime;

    // Her 15 saniyede bir yeni block
    if (timeSinceLastBlock >= this.blockInterval) {
      const newBlocks = Math.floor(timeSinceLastBlock / this.blockInterval);
      this.currentBlockNumber += newBlocks;
      this.lastBlockTime = now;
    }

    return this.currentBlockNumber;
  }

  // Metrics verisi için blockchain transaction simüle et
  async recordMetric(metricData) {
    try {
      // Transaction hash oluştur
      const txHash = this.generateTransactionHash({
        userEmail: metricData.userEmail,
        containerId: metricData.containerId,
        memoryMB: metricData.memoryMB,
        cpuUsage: metricData.cpuUsage,
        timestamp: Date.now(),
      });

      // Block number al
      const blockNumber = this.getCurrentBlockNumber();

      // Transaction'ı pending listesine ekle (gerçek blockchain simülasyonu)
      this.pendingTransactions.push({
        hash: txHash,
        blockNumber: blockNumber,
        data: metricData,
        timestamp: Date.now(),
      });

      // Simulated mining delay (1-3 saniye)
      const miningDelay = Math.random() * 2000 + 1000;
      await new Promise((resolve) => setTimeout(resolve, miningDelay));

      console.log(
        `[Blockchain] Transaction mined: ${txHash} in block ${blockNumber}`
      );

      return {
        txHash,
        blockNumber,
        gasUsed: Math.floor(Math.random() * 50000 + 21000), // Simulated gas
        status: "success",
      };
    } catch (error) {
      console.error("[Blockchain] Transaction failed:", error);
      return {
        txHash: null,
        blockNumber: null,
        status: "failed",
        error: error.message,
      };
    }
  }

  // Transaction durumunu kontrol et
  getTransactionStatus(txHash) {
    const tx = this.pendingTransactions.find((t) => t.hash === txHash);
    if (tx) {
      return {
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        status: "confirmed",
        timestamp: tx.timestamp,
      };
    }
    return null;
  }

  // Blockchain istatistikleri
  getStats() {
    return {
      currentBlockNumber: this.getCurrentBlockNumber(),
      pendingTransactions: this.pendingTransactions.length,
      totalTransactions: this.pendingTransactions.length,
      lastBlockTime: this.lastBlockTime,
    };
  }
}

module.exports = new BlockchainSimulator();

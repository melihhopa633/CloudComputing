const axios = require("axios");
const db = require("./database");
const ethers = require("ethers");

// Docker Stats Exporter URL'sini düzelt
const DOCKER_STATS_EXPORTER_URL =
  process.env.DOCKER_STATS_EXPORTER_URL ||
  "http://docker_stats_exporter:9487/metrics";

// Blockchain bağlantısı için gerekli değişkenler
let contract;
let wallet;

// Veri saklama süresi (24 saat)
const DATA_RETENTION_HOURS = 24;

// Blockchain bağlantısını başlat
function initializeBlockchain(blockchainConfig) {
  try {
    const { contractAddress, privateKey, rpcUrl } = blockchainConfig;
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    wallet = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(
      contractAddress,
      [
        "function recordMetric(string containerId, uint256 memoryMB, uint256 cpuUsage, uint256 timestamp) public",
        "function getMetricCount() public view returns (uint256)",
      ],
      wallet
    );
    console.log("Blockchain connection initialized successfully");
    return true;
  } catch (error) {
    console.error("Blockchain initialization error:", error.message);
    return false;
  }
}

// Veritabanı temizleme fonksiyonu
async function cleanupOldMetrics() {
  try {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - DATA_RETENTION_HOURS);
    // Türkiye saatine göre cutoff time'ı ayarla
    const cutoffTimestamp = Math.floor(cutoffTime.getTime() / 1000);

    const result = await db.pool.query(
      "DELETE FROM metrics WHERE created_at < to_timestamp($1)",
      [cutoffTimestamp]
    );

    console.log(
      `Cleaned up ${result.rowCount} old metrics records before ${new Date(
        cutoffTimestamp * 1000
      ).toLocaleString()}`
    );
  } catch (error) {
    console.error("Error cleaning up old metrics:", error.message);
  }
}

async function collectMetrics(userEmail) {
  if (!userEmail) {
    console.error("User email is required for metrics collection");
    return;
  }

  try {
    console.log(
      `Collecting metrics for user ${userEmail} from:`,
      DOCKER_STATS_EXPORTER_URL
    );

    const response = await axios.get(DOCKER_STATS_EXPORTER_URL, {
      timeout: 5000,
      headers: { Accept: "text/plain" },
    });

    if (!response.data) {
      console.warn("No metrics data received from exporter");
      return;
    }

    console.log("Received metrics data, length:", response.data.length);

    const metrics = parseMetrics(response.data);

    if (Object.keys(metrics).length === 0) {
      console.warn("No container metrics found in the response");
      return;
    }

    console.log(`Found metrics for ${Object.keys(metrics).length} containers`);

    // Her container için metrikleri kaydet
    for (const [containerId, containerMetrics] of Object.entries(metrics)) {
      try {
        const cpuUsage = containerMetrics.cpu_usage_percent || 0;
        const memoryMB = containerMetrics.memory_usage_bytes
          ? containerMetrics.memory_usage_bytes / (1024 * 1024)
          : 0;

        // Add metric to database with explicit user_email
        const metricData = {
          userEmail: userEmail, // Ensure user_email is explicitly set
          containerId,
          containerName: containerMetrics.name || containerId,
          memoryMB: parseFloat(memoryMB.toFixed(2)), // Round to 2 decimal places
          cpuUsage: parseFloat((cpuUsage / 100).toFixed(4)), // Convert to 0-1 range and round
        };

        console.log(
          `Adding metric for container ${containerMetrics.name}:`,
          metricData
        );

        // Add metric to database
        const metricId = await db.addMetric(metricData);

        console.log(
          `Metrics recorded successfully for ${containerMetrics.name} (ID: ${metricId})`
        );
      } catch (err) {
        console.error(
          `Error processing metrics for ${containerMetrics.name}:`,
          err.message
        );
      }
    }
  } catch (error) {
    console.error("Error collecting metrics:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error(
        "Could not connect to Docker Stats Exporter. Make sure it's running and accessible at:",
        DOCKER_STATS_EXPORTER_URL
      );
    }
  }
}

function parseMetrics(metricsText) {
  const metrics = {};
  const lines = metricsText.split("\n");

  console.log("Parsing metrics data...");
  console.log("Total lines:", lines.length);

  // Metrik tiplerini takip etmek için
  const metricTypes = {
    cpu: "dockerstats_cpu_usage_ratio",
    memory: "dockerstats_memory_usage_bytes",
    memoryRatio: "dockerstats_memory_usage_ratio",
  };

  for (const line of lines) {
    // Yorum satırlarını atla
    if (line.startsWith("#")) {
      continue;
    }

    // Docker container metriklerini parse et
    // Örnek format: dockerstats_cpu_usage_ratio{name="container_name",id="container_id"} 0.5
    const containerMatch = line.match(
      /dockerstats_(\w+)\{name="([^"]+)",id="([^"]+)"\} (\d+\.?\d*)/
    );

    if (containerMatch) {
      const [_, metricType, containerName, containerId, value] = containerMatch;

      if (!metrics[containerId]) {
        metrics[containerId] = {
          name: containerName,
          id: containerId,
        };
      }

      // Metrik tipine göre değeri kaydet
      switch (metricType) {
        case "cpu_usage_ratio":
          metrics[containerId].cpu_usage_percent = parseFloat(value) * 100; // 0-1'den 0-100'e çevir
          break;
        case "memory_usage_bytes":
          metrics[containerId].memory_usage_bytes = parseFloat(value);
          break;
        case "memory_usage_ratio":
          metrics[containerId].memory_usage_percent = parseFloat(value);
          break;
      }

      // Debug için ilk birkaç metriği logla
      if (Object.keys(metrics).length <= 3) {
        console.log(
          `Parsed metric: ${containerName} (${containerId}) - ${metricType} = ${value}`
        );
      }
    } else if (line.trim() && !line.startsWith("#")) {
      // Parse edilemeyen satırları logla (ilk 5 tanesi)
      console.log("Could not parse line:", line);
    }
  }

  // Parse edilen metrikleri özetle
  const containerCount = Object.keys(metrics).length;
  console.log(`Parsed metrics for ${containerCount} containers`);

  if (containerCount > 0) {
    // İlk container'ın metriklerini örnek olarak göster
    const firstContainer = Object.keys(metrics)[0];
    console.log("Sample metrics for first container:", {
      containerId: firstContainer,
      containerName: metrics[firstContainer].name,
      metrics: {
        cpu_usage_percent:
          metrics[firstContainer].cpu_usage_percent?.toFixed(2) + "%",
        memory_usage_mb:
          (metrics[firstContainer].memory_usage_bytes / (1024 * 1024)).toFixed(
            2
          ) + "MB",
        memory_usage_percent:
          metrics[firstContainer].memory_usage_percent?.toFixed(2) + "%",
      },
    });
  }

  return metrics;
}

function startCollecting(userEmail, blockchainConfig) {
  if (!userEmail) {
    console.error("User email is required to start metrics collection");
    return false;
  }

  console.log("Starting metrics collection service...");

  // Blockchain bağlantısını başlat
  if (blockchainConfig) {
    if (!initializeBlockchain(blockchainConfig)) {
      console.error(
        "Failed to initialize blockchain connection. Metrics will only be saved to database."
      );
    }
  }

  console.log(
    `Metrics will be collected every 5 minutes for user ${userEmail} from:`,
    DOCKER_STATS_EXPORTER_URL
  );

  // İlk çalıştırma
  collectMetrics(userEmail).catch((error) => {
    console.error("Initial metrics collection failed:", error.message);
  });

  // Her 5 dakikada bir metrik topla
  const metricsIntervalId = setInterval(() => {
    collectMetrics(userEmail).catch((error) => {
      console.error("Periodic metrics collection failed:", error.message);
    });
  }, 5 * 60 * 1000); // 5 dakika

  // Her 6 saatte bir eski verileri temizle
  const cleanupIntervalId = setInterval(() => {
    cleanupOldMetrics().catch((error) => {
      console.error("Cleanup failed:", error.message);
    });
  }, 6 * 60 * 60 * 1000); // 6 saat

  // Servis kapatıldığında interval'leri temizle
  process.on("SIGTERM", () => {
    console.log("Stopping metrics collection service...");
    clearInterval(metricsIntervalId);
    clearInterval(cleanupIntervalId);
  });

  return true;
}

module.exports = {
  startCollecting,
  initializeBlockchain,
};

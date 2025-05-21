const express = require("express");
const router = express.Router();
const db = require("./database");

// Blockchain işlem detaylarını loglamak için yardımcı fonksiyon
const logBlockchainInteraction = (action, details) => {
  console.log(`[Blockchain] ${action}:`, JSON.stringify(details, null, 2));
};

// Kullanıcı bazlı filtreleme için middleware
const requireUserEmail = (req, res, next) => {
  const userEmail = req.query.user_email || req.body.user_email;
  if (!userEmail) {
    return res.status(400).json({
      error: "Missing user email",
      message: "user_email is required for this operation",
    });
  }
  req.userEmail = userEmail;
  next();
};

function setupApiRoutes(app, contract) {
  // POST /api/metrics - Yeni metrik ekle
  router.post("/metrics", async (req, res) => {
    try {
      const { user_email, containerId, containerName, memoryMB, cpuUsage } =
        req.body;
      console.log("Received metric:", req.body);

      // Validate required fields
      if (!user_email || !containerId || !memoryMB || !cpuUsage) {
        return res.status(400).json({
          error: "Missing required fields",
          message:
            "user_email, containerId, memoryMB, and cpuUsage are required",
        });
      }

      // Add metric to database
      const metricId = await db.addMetric({
        userEmail: user_email,
        containerId,
        containerName: containerName || containerId,
        memoryMB: parseFloat(memoryMB),
        cpuUsage: parseFloat(cpuUsage),
      });

      res.status(201).json({
        id: metricId,
        message: "Metric added successfully",
      });
    } catch (error) {
      console.error("Error adding metric:", error);
      res.status(500).json({
        error: "Failed to add metric",
        details: error.message,
      });
    }
  });

  // GET /api/metrics/count - Get metric count
  router.get("/metrics/count", async (req, res) => {
    console.log("Getting metric count from /metrics/count path");

    // Timestamp range parameters
    const fromTimestamp = req.query.from ? parseInt(req.query.from) : 0;
    const toTimestamp = req.query.to
      ? parseInt(req.query.to)
      : Math.floor(Date.now() / 1000);

    const containerId = req.query.containerId;

    try {
      const dbResult = await db.getAllMetrics({
        fromTimestamp,
        toTimestamp,
        containerId,
        limit: 1, // We only need the count
        offset: 0,
      });

      return res.json({ count: dbResult.pagination.total });
    } catch (error) {
      console.error("Error getting metric count:", error);
      return res.status(500).json({
        error: "Failed to get metric count",
        message: error.message,
      });
    }
  });

  // DELETE /api/metrics - Clear all metrics (test only)
  router.delete("/metrics", async (req, res) => {
    console.log("Deleting all metrics...");

    try {
      await db.clearAllMetrics();
      res.json({ success: true, message: "All metrics cleared successfully" });
    } catch (error) {
      console.error("Error clearing metrics:", error);
      res.status(500).json({
        error: "Failed to clear metrics",
        message: error.message,
      });
    }
  });

  // GET /api/metrics - Get all metrics with pagination and filtering
  router.get("/metrics", requireUserEmail, async (req, res) => {
    const {
      limit = 10,
      offset = 0,
      sortBy = "created_at",
      sortOrder = "DESC",
      fromTimestamp,
      toTimestamp,
      containerId,
    } = req.query;

    try {
      const dbResult = await db.getAllMetrics({
        limit: parseInt(limit),
        offset: parseInt(offset),
        sortBy,
        sortOrder,
        fromTimestamp: fromTimestamp ? parseInt(fromTimestamp) : undefined,
        toTimestamp: toTimestamp
          ? parseInt(toTimestamp)
          : Math.floor(Date.now() / 1000),
        userEmail: req.userEmail,
        containerId,
      });

      // Transform database metrics
      const metrics = dbResult.metrics.map((m) => ({
        containerId: m.container_id,
        containerName: m.container_name,
        memoryMB: m.memory_mb,
        cpuUsage: m.cpu_usage,
        created_at: m.created_at,
        txHash: m.tx_hash,
        blockNumber: m.block_number,
        userEmail: m.user_email,
      }));

      res.json({
        metrics: metrics,
        pagination: dbResult.pagination,
      });
    } catch (error) {
      console.error("Error getting metrics:", error);
      res.status(500).json({
        error: "Failed to retrieve metrics",
        message: error.message,
      });
    }
  });

  // GET /api/metrics/:containerId - Get metrics for specific container
  router.get("/metrics/:containerId", async (req, res) => {
    const containerId = req.params.containerId;

    // Pagination and sorting
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder || "DESC";

    // Timestamp range filtering
    const fromTimestamp = req.query.from ? parseInt(req.query.from) : 0;
    const toTimestamp = req.query.to
      ? parseInt(req.query.to)
      : Math.floor(Date.now() / 1000);

    try {
      // Get metrics from database
      const dbResult = await db.getMetricsByContainerId(containerId, {
        limit,
        offset,
        sortBy,
        sortOrder,
        fromTimestamp,
        toTimestamp,
      });
      console.log(
        `Found ${dbResult.metrics.length} metrics for container ${containerId} in database (total: ${dbResult.pagination.total})`
      );

      // Transform database metrics
      const metrics = dbResult.metrics.map((m) => ({
        containerId: m.container_id,
        containerName: m.container_name,
        memoryMB: m.memory_mb,
        cpuUsage: m.cpu_usage,
        created_at: m.created_at,
        txHash: m.tx_hash,
        blockNumber: m.block_number,
        userEmail: m.user_email,
      }));

      return res.json({
        metrics: metrics,
        pagination: dbResult.pagination,
      });
    } catch (error) {
      console.error(
        `Error getting metrics for container ${containerId}:`,
        error
      );
      return res.status(500).json({
        error: "Failed to retrieve metrics",
        message: error.message,
      });
    }
  });

  // GET /health - Service health check
  router.get("/health", async (req, res) => {
    try {
      // Database check without timeout
      const dbStatus = await db
        .query("SELECT 1")
        .then(() => "connected")
        .catch(() => "error");

      // Blockchain check without waiting too long
      const blockStatus = await contract
        .getMetricCount()
        .then(() => "connected")
        .catch(() => "error");

      // Get metrics count directly
      let metricsCount = "unknown";
      try {
        metricsCount = await db.getMetricCount();
      } catch (err) {
        metricsCount = "error";
      }

      res.json({
        status: "ok",
        database: dbStatus,
        blockchain: blockStatus,
        metrics_count: metricsCount,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        error: err.message,
      });
    }
  });

  // GET /api/metrics/stats - Get metric statistics
  router.get("/metrics/stats", requireUserEmail, async (req, res) => {
    try {
      const stats = await db.getMetricStats(req.userEmail);
      res.json(stats);
    } catch (error) {
      console.error("Error getting metric statistics:", error);
      res.status(500).json({
        error: "Failed to retrieve metric statistics",
        message: error.message,
      });
    }
  });

  // GET /api/metrics/averages - Tüm containerlar için ortalama değerleri getir
  router.get("/metrics/averages", async (req, res) => {
    console.log("Getting metric averages for all containers");

    // Timestamp aralığı parametreleri
    const fromTimestamp = req.query.from ? parseInt(req.query.from) : 0;
    const toTimestamp = req.query.to
      ? parseInt(req.query.to)
      : Number.MAX_SAFE_INTEGER;

    try {
      const averages = await db.getMetricAverages(null, {
        fromTimestamp,
        toTimestamp,
      });
      console.log(`Found averages for ${averages.length} containers`);
      res.json(averages);
    } catch (error) {
      console.error("Error getting metric averages:", error);
      res.status(500).json({
        error: "Failed to retrieve metric averages",
        message: error.message,
      });
    }
  });

  // GET /api/metrics/averages/:containerId - Belirli bir container için ortalama değerleri getir
  router.get("/metrics/averages/:containerId", async (req, res) => {
    const containerId = req.params.containerId;
    console.log(`Getting metric averages for container: ${containerId}`);

    // Timestamp aralığı parametreleri
    const fromTimestamp = req.query.from ? parseInt(req.query.from) : 0;
    const toTimestamp = req.query.to
      ? parseInt(req.query.to)
      : Number.MAX_SAFE_INTEGER;

    try {
      const averages = await db.getMetricAverages(containerId, {
        fromTimestamp,
        toTimestamp,
      });

      if (averages.length === 0) {
        return res.status(404).json({
          error: "No metrics found",
          message: `No metrics found for container ${containerId}`,
        });
      }

      console.log(`Found averages for container ${containerId}`);
      res.json(averages[0]);
    } catch (error) {
      console.error(
        `Error getting metric averages for container ${containerId}:`,
        error
      );
      res.status(500).json({
        error: "Failed to retrieve metric averages",
        message: error.message,
      });
    }
  });

  // GET /api/metrics/latest - Son N metriği getir
  router.get("/metrics/latest", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    console.log(`Getting latest ${limit} metrics`);

    try {
      const latestMetrics = await db.getLatestMetrics(limit);
      console.log(`Retrieved ${latestMetrics.length} latest metrics`);

      // Format response
      const metrics = latestMetrics.map((m) => ({
        containerId: m.container_id,
        memoryMB: m.memory_mb,
        cpuUsage: m.cpu_usage,
        timestamp: m.created_at,
        txHash: m.tx_hash,
        blockNumber: m.block_number,
        userEmail: m.user_email,
      }));

      res.json(metrics);
    } catch (error) {
      console.error("Error getting latest metrics:", error);
      res.status(500).json({
        error: "Failed to retrieve latest metrics",
        message: error.message,
      });
    }
  });

  // POST /api/metrics/batch - Toplu metrik kaydı ekle
  router.post("/metrics/batch", async (req, res) => {
    const metrics = req.body;

    if (!Array.isArray(metrics) || metrics.length === 0) {
      return res.status(400).json({
        error: "Invalid request format",
        message: "Request body must be an array of metrics",
      });
    }

    console.log(`Processing batch of ${metrics.length} metrics`);

    try {
      // Önce veritabanına kaydet
      const dbResult = await db.addMetricsBatch(
        metrics.map((m) => ({
          userEmail: m.userEmail,
          containerId: m.containerId,
          containerName: m.containerName,
          memoryMB: m.memoryMB,
          cpuUsage: m.cpuUsage,
          txHash: null,
          blockNumber: null,
        }))
      );

      // Başarıyla kaydedilenler için asenkron olarak blockchain işlemlerini başlat
      if (dbResult.insertedCount > 0) {
        // Sadece veritabanına eklenenler için blockchain işlemi başlat
        const processedMetrics = metrics.slice(0, dbResult.insertedCount);

        // Blockchain kaydını asenkron yap (cevabı beklemeden)
        processedMetrics.forEach((metric, index) => {
          try {
            const scaledCpu = Math.round(Number(metric.cpuUsage) * 100);

            console.log(
              `Async recording metric ${index + 1}/${
                processedMetrics.length
              } to blockchain`
            );

            // Blockchain işlemini gönder ama bekletme
            contract
              .recordMetric(
                metric.containerId,
                BigInt(Math.round(metric.memoryMB)),
                BigInt(scaledCpu),
                BigInt(Math.floor(Date.now() / 1000)) // Use current timestamp
              )
              .then((tx) => {
                console.log(`Transaction ${index + 1} sent, hash:`, tx.hash);

                // Transaction hash'i güncelle
                db.query(
                  "UPDATE metrics SET tx_hash = $1 WHERE container_id = $2 AND created_at = (SELECT MAX(created_at) FROM metrics WHERE container_id = $2)",
                  [tx.hash, metric.containerId]
                ).catch((err) =>
                  console.error(
                    `Error updating tx hash for metric ${index + 1}:`,
                    err
                  )
                );

                // Sadece background'da onay dinle
                tx.wait()
                  .then((receipt) => {
                    console.log(
                      `Transaction ${index + 1} confirmed in block:`,
                      receipt.blockNumber
                    );

                    // Block number'ı güncelle
                    db.query(
                      "UPDATE metrics SET block_number = $1 WHERE container_id = $2 AND created_at = (SELECT MAX(created_at) FROM metrics WHERE container_id = $2)",
                      [receipt.blockNumber, metric.containerId]
                    ).catch((err) =>
                      console.error(
                        `Error updating block number for metric ${index + 1}:`,
                        err
                      )
                    );
                  })
                  .catch((err) =>
                    console.error(
                      `Transaction confirmation error for metric ${index + 1}:`,
                      err
                    )
                  );
              })
              .catch((err) => {
                console.error(
                  `Blockchain error for metric ${index + 1}:`,
                  err.message
                );
              });
          } catch (err) {
            console.error(`Error processing metric ${index + 1}:`, err.message);
          }
        });
      }

      // Hemen başarı mesajı dön
      res.json({
        success: true,
        databaseResult: dbResult,
        message: "Metrics saved to database and being processed for blockchain",
      });
    } catch (error) {
      console.error("Batch processing error:", error);
      res.status(500).json({
        error: "Failed to process batch metrics",
        message: error.message,
      });
    }
  });

  // Tüm router'ı /api prefix'i ile kullan
  app.use("/api", router);
}

module.exports = { setupApiRoutes };

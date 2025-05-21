require("dotenv").config();
const { Pool } = require("pg");

// Cache mekanizması için basit bir in-memory cache
const cache = {
  data: {},
  set: function (key, value, ttl = 30000) {
    const now = Date.now();
    this.data[key] = {
      value,
      expiry: now + ttl,
    };
    return value;
  },
  get: function (key) {
    const now = Date.now();
    const item = this.data[key];
    if (item && item.expiry > now) {
      return item.value;
    }
    delete this.data[key];
    return null;
  },
  invalidate: function (keyPattern) {
    if (keyPattern) {
      Object.keys(this.data).forEach((key) => {
        if (key.startsWith(keyPattern)) {
          delete this.data[key];
        }
      });
    } else {
      this.data = {};
    }
  },
};

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

async function testConnection() {
  try {
    const pool = getPool();
    await pool.query("SELECT 1");
    console.log("PostgreSQL connection test successful");
    return true;
  } catch (error) {
    console.error("PostgreSQL connection test failed:", error);
    return false;
  }
}

async function initializeDatabase() {
  try {
    console.log("Testing PostgreSQL connection...");
    let retries = 5;
    while (retries > 0) {
      if (await testConnection()) {
        break;
      }
      console.log(`Connection failed, retrying... (${retries} attempts left)`);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    if (retries === 0) {
      throw new Error(
        "Could not establish PostgreSQL connection after multiple attempts"
      );
    }

    console.log("Setting up database...");
    const pool = getPool();

    // Önce timezone ayarını yap
    await pool.query("SET timezone TO 'Europe/Istanbul'");
    console.log("Timezone set to Europe/Istanbul");

    // Mevcut tabloyu sil
    await pool.query("DROP TABLE IF EXISTS metrics CASCADE");
    console.log("Dropped existing metrics table");

    // Yeni tabloyu oluştur
    await pool.query(`
      CREATE TABLE metrics (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        container_id VARCHAR(255) NOT NULL,
        container_name VARCHAR(255) NOT NULL,
        memory_mb DECIMAL(10,2) NOT NULL,
        cpu_usage DECIMAL(5,4) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        tx_hash VARCHAR(66),
        block_number INTEGER,
        UNIQUE(container_id, created_at)
      );

      CREATE INDEX idx_metrics_created_at ON metrics (created_at);
      CREATE INDEX idx_metrics_container_id ON metrics (container_id);
      CREATE INDEX idx_metrics_container_name ON metrics (container_name);
      CREATE INDEX idx_metrics_user_email ON metrics (user_email);
    `);
    console.log("Created new metrics table with user_email column");

    return true;
  } catch (error) {
    console.error("Database initialization error:", error);
    return false;
  }
}

async function query(sql, params = []) {
  const pool = getPool();
  try {
    console.log("Executing query:", sql, "with params:", params);
    const result = await pool.query(sql, params);
    console.log("Query result:", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

async function addMetric({
  userEmail,
  containerId,
  containerName,
  memoryMB,
  cpuUsage,
  txHash,
  blockNumber,
}) {
  try {
    const result = await query(
      `INSERT INTO metrics 
       (user_email, container_id, container_name, memory_mb, cpu_usage, tx_hash, block_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id`,
      [
        userEmail,
        containerId,
        containerName,
        memoryMB,
        cpuUsage,
        txHash,
        blockNumber,
      ]
    );

    return result.rows[0].id;
  } catch (error) {
    console.error("Error adding metric:", error.message);
    throw error;
  }
}

async function addMetricsBatch(metrics) {
  try {
    const values = metrics.map((m) => [
      m.userEmail || "system@example.com", // Add default user_email
      m.containerId,
      m.containerName,
      m.memoryMB,
      m.cpuUsage,
      m.txHash,
      m.blockNumber,
    ]);
    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const data of values) {
        await client.query(
          `INSERT INTO metrics 
           (user_email, container_id, container_name, memory_mb, cpu_usage, tx_hash, block_number) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           ON CONFLICT (container_id, created_at) DO NOTHING`,
          data
        );
      }
      await client.query("COMMIT");
      return { insertedCount: values.length };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Toplu metrik ekleme hatası:", error);
    throw error;
  }
}

// Get all metrics with pagination and filtering
async function getAllMetrics(options = {}) {
  try {
    const {
      limit = 100,
      offset = 0,
      sortBy = "created_at",
      sortOrder = "DESC",
      fromTimestamp,
      toTimestamp,
      userEmail,
      containerId,
    } = options;

    const cacheKey = `metrics:${limit}:${offset}:${sortBy}:${sortOrder}:${fromTimestamp}:${toTimestamp}:${userEmail}:${containerId}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const validColumns = [
      "id",
      "container_id",
      "container_name",
      "memory_mb",
      "cpu_usage",
      "created_at",
      "tx_hash",
      "block_number",
      "user_email",
    ];
    if (!validColumns.includes(sortBy)) {
      throw new Error("Invalid sort column");
    }

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (userEmail) {
      conditions.push(`user_email = $${paramIndex}`);
      params.push(userEmail);
      paramIndex++;
    }

    if (containerId) {
      conditions.push(`container_id = $${paramIndex}`);
      params.push(containerId);
      paramIndex++;
    }

    if (fromTimestamp) {
      conditions.push(`created_at >= to_timestamp($${paramIndex})`);
      params.push(fromTimestamp);
      paramIndex++;
    }

    if (toTimestamp) {
      conditions.push(`created_at <= to_timestamp($${paramIndex})`);
      params.push(toTimestamp);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT * FROM metrics 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const result = await query(query, params);
    const countResult = await query(
      `SELECT COUNT(*) as total FROM metrics ${whereClause}`,
      conditions.length > 0 ? params.slice(0, -2) : []
    );

    const response = {
      metrics: result,
      pagination: {
        total: parseInt(countResult[0].total),
        offset: offset,
        limit: limit,
      },
    };

    cache.set(cacheKey, response);
    return response;
  } catch (error) {
    console.error("Error getting all metrics:", error);
    throw error;
  }
}

// Get metrics by container ID
async function getMetricsByContainerId(containerId, options = {}) {
  try {
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    const sortBy = options.sortBy || "created_at";
    const sortOrder =
      options.sortOrder && options.sortOrder.toUpperCase() === "ASC"
        ? "ASC"
        : "DESC";
    const fromTimestamp = options.fromTimestamp || 0;
    const toTimestamp = options.toTimestamp || Number.MAX_SAFE_INTEGER;

    const cacheKey = `metrics_container_${containerId}_${limit}_${offset}_${sortBy}_${sortOrder}_${fromTimestamp}_${toTimestamp}`;

    const cachedResult = cache.get(cacheKey);
    if (cachedResult !== null) {
      return cachedResult;
    }

    const metrics = await query(
      `SELECT * FROM metrics 
       WHERE container_id = $1 
       AND created_at >= to_timestamp($2)
       AND created_at <= to_timestamp($3)
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT $4 OFFSET $5`,
      [containerId, fromTimestamp, toTimestamp, limit, offset]
    );

    const countResult = await query(
      "SELECT COUNT(*) as total FROM metrics WHERE container_id = $1 AND created_at >= to_timestamp($2) AND created_at <= to_timestamp($3)",
      [containerId, fromTimestamp, toTimestamp]
    );

    const result = {
      metrics: metrics,
      pagination: {
        total: countResult[0].total,
        offset: offset,
        limit: limit,
      },
    };

    return cache.set(cacheKey, result, 5000);
  } catch (error) {
    console.error("Container metrikleri getirme hatası:", error);
    throw error;
  }
}

// Get total metric count
async function getMetricCount() {
  try {
    const result = await query("SELECT COUNT(*) as count FROM metrics");
    return result[0].count;
  } catch (error) {
    console.error("Metrik sayısı getirme hatası:", error);
    throw error;
  }
}

// Clear all metrics
async function clearAllMetrics() {
  try {
    await query("DELETE FROM metrics");
    cache.invalidate(); // Clear all cache
    return true;
  } catch (error) {
    console.error("Metrikleri temizleme hatası:", error);
    throw error;
  }
}

// Check for duplicate metric
async function checkDuplicateMetric(containerId, created_at) {
  try {
    const result = await query(
      "SELECT COUNT(*) as count FROM metrics WHERE container_id = $1 AND created_at = $2",
      [containerId, created_at]
    );
    return result[0].count > 0;
  } catch (error) {
    console.error("Duplicate kontrol hatası:", error);
    throw error;
  }
}

// Belirli bir container ID için ortalama CPU ve memory kullanımını getir
async function getMetricAverages(containerId, options = {}) {
  try {
    // Timestamp aralığı filtreleme
    const fromTimestamp = options.fromTimestamp || 0;
    const toTimestamp = options.toTimestamp || Number.MAX_SAFE_INTEGER;

    let sql, params;
    if (containerId) {
      sql = `
        SELECT 
          container_id,
          AVG(memory_mb) as avg_memory,
          AVG(cpu_usage) as avg_cpu,
          COUNT(*) as count,
          MIN(created_at) as first_timestamp,
          MAX(created_at) as last_timestamp
        FROM metrics
        WHERE container_id = $1 AND created_at >= to_timestamp($2) AND created_at <= to_timestamp($3)
        GROUP BY container_id
      `;
      params = [containerId, fromTimestamp, toTimestamp];
    } else {
      sql = `
        SELECT 
          container_id,
          AVG(memory_mb) as avg_memory,
          AVG(cpu_usage) as avg_cpu,
          COUNT(*) as count,
          MIN(created_at) as first_timestamp,
          MAX(created_at) as last_timestamp
        FROM metrics
        WHERE created_at >= to_timestamp($1) AND created_at <= to_timestamp($2)
        GROUP BY container_id
      `;
      params = [fromTimestamp, toTimestamp];
    }

    const rows = await query(sql, params);
    return rows;
  } catch (error) {
    console.error("Metrik ortalamalarını getirme hatası:", error);
    throw error;
  }
}

// Metrik istatistiklerini getir
async function getMetricStats(userEmail) {
  try {
    const [totalCount, containerCount, latest, earliest] = await Promise.all([
      query("SELECT COUNT(*) as count FROM metrics WHERE user_email = $1", [
        userEmail,
      ]),
      query(
        "SELECT COUNT(DISTINCT container_id) as count FROM metrics WHERE user_email = $1",
        [userEmail]
      ),
      query(
        "SELECT MAX(created_at) as latest FROM metrics WHERE user_email = $1",
        [userEmail]
      ),
      query(
        "SELECT MIN(created_at) as earliest FROM metrics WHERE user_email = $1",
        [userEmail]
      ),
    ]);

    return {
      totalMetrics: parseInt(totalCount[0].count),
      uniqueContainers: parseInt(containerCount[0].count),
      latestTimestamp: latest[0].latest,
      earliestTimestamp: earliest[0].earliest,
    };
  } catch (error) {
    console.error("Error getting metric stats:", error);
    throw error;
  }
}

// Son N metriği getir
async function getLatestMetrics(limit = 5) {
  try {
    const [rows] = await query(
      "SELECT * FROM metrics ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
    return rows;
  } catch (error) {
    console.error("Son metrikleri getirme hatası:", error);
    throw error;
  }
}

async function updateMetricBlockchainInfo(metricId, { txHash, blockNumber }) {
  try {
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (txHash !== undefined) {
      updates.push(`tx_hash = $${paramIndex}`);
      params.push(txHash);
      paramIndex++;
    }

    if (blockNumber !== undefined) {
      updates.push(`block_number = $${paramIndex}`);
      params.push(blockNumber);
      paramIndex++;
    }

    if (updates.length === 0) {
      return null;
    }

    params.push(metricId);

    const result = await query(
      `UPDATE metrics 
       SET ${updates.join(", ")} 
       WHERE id = $${paramIndex} 
       RETURNING id`,
      params
    );

    cache.invalidate(`metrics_*`);
    return result[0]?.id;
  } catch (error) {
    console.error("Error updating blockchain info:", error);
    throw error;
  }
}

module.exports = {
  getPool,
  query,
  cache,
  testConnection,
  initializeDatabase,
  addMetric,
  addMetricsBatch,
  getAllMetrics,
  getMetricsByContainerId,
  getMetricCount,
  clearAllMetrics,
  checkDuplicateMetric,
  getMetricAverages,
  getMetricStats,
  getLatestMetrics,
  updateMetricBlockchainInfo,
};

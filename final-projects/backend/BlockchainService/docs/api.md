# BlockchainService API Dokümantasyonu (PostgreSQL)

**Base URL:** `http://localhost:4002/api`

---

## 1. Metrik Ekle (POST /metrics)

- **Endpoint:** `POST /metrics`
- **Açıklama:** Yeni bir metrik kaydı ekler.
- **Request Body:**

```json
{
  "containerId": "test-container-1",
  "memoryMB": 512.5,
  "cpuUsage": 0.75,
  "timestamp": 1716123456
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Metric recorded in database and sent to blockchain",
  "metricId": 1
}
```

---

## 2. Tüm Metrikleri Getir (GET /metrics)

- **Endpoint:** `GET /metrics`
- **Query Params:**
  - `limit` (varsayılan: 10)
  - `offset` (varsayılan: 0)
  - `sortBy` (varsayılan: timestamp)
  - `sortOrder` (varsayılan: DESC)
  - `from` (timestamp, opsiyonel)
  - `to` (timestamp, opsiyonel)
- **Response:**

```json
{
  "metrics": [
    {
      "containerId": "test-container-1",
      "memoryMB": 512.5,
      "cpuUsage": 0.75,
      "timestamp": 1716123456,
      "txHash": "0x...",
      "blockNumber": 123
    }
  ],
  "pagination": {
    "total": 1,
    "offset": 0,
    "limit": 10
  }
}
```

---

## 3. Belirli Container'ın Metriklerini Getir (GET /metrics/:containerId)

- **Endpoint:** `GET /metrics/:containerId`
- **Query Params:** Yukarıdakiyle aynı
- **Response:** Yukarıdakiyle aynı

---

## 4. Metrik Sayısı (GET /metrics/count)

- **Endpoint:** `GET /metrics/count`
- **Query Params:**
  - `from` (timestamp, opsiyonel)
  - `to` (timestamp, opsiyonel)
  - `containerId` (opsiyonel)
- **Response:**

```json
{
  "count": 5
}
```

---

## 5. Metrik İstatistikleri (GET /metrics/stats)

- **Endpoint:** `GET /metrics/stats`
- **Response:**

```json
{
  "totalMetrics": 5,
  "uniqueContainers": 2,
  "latestTimestamp": 1716123456,
  "earliestTimestamp": 1716120000
}
```

---

## 6. Ortalama Metrikler (GET /metrics/averages)

- **Endpoint:** `GET /metrics/averages`
- **Query Params:**
  - `from` (timestamp, opsiyonel)
  - `to` (timestamp, opsiyonel)
- **Response:**

```json
[
  {
    "container_id": "test-container-1",
    "avg_memory": 512.5,
    "avg_cpu": 0.75,
    "count": 3,
    "first_timestamp": 1716120000,
    "last_timestamp": 1716123456
  }
]
```

---

## 7. Belirli Container için Ortalama (GET /metrics/averages/:containerId)

- **Endpoint:** `GET /metrics/averages/:containerId`
- **Query Params:** Yukarıdakiyle aynı
- **Response:**

```json
{
  "container_id": "test-container-1",
  "avg_memory": 512.5,
  "avg_cpu": 0.75,
  "count": 3,
  "first_timestamp": 1716120000,
  "last_timestamp": 1716123456
}
```

---

## 8. Son N Metrik (GET /metrics/latest)

- **Endpoint:** `GET /metrics/latest?limit=5`
- **Response:**

```json
[
  {
    "containerId": "test-container-1",
    "memoryMB": 512.5,
    "cpuUsage": 0.75,
    "timestamp": 1716123456,
    "txHash": "0x...",
    "blockNumber": 123
  }
]
```

---

## 9. Toplu Metrik Ekle (POST /metrics/batch)

- **Endpoint:** `POST /metrics/batch`
- **Request Body:**

```json
[
  {
    "containerId": "test-container-1",
    "memoryMB": 512.5,
    "cpuUsage": 0.75,
    "timestamp": 1716123456
  },
  {
    "containerId": "test-container-2",
    "memoryMB": 256.0,
    "cpuUsage": 0.55,
    "timestamp": 1716123470
  }
]
```

- **Response:**

```json
{
  "success": true,
  "databaseResult": { "insertedCount": 2 },
  "message": "Metrics saved to database and being processed for blockchain"
}
```

---

## 10. Sağlık Kontrolü (GET /health)

- **Endpoint:** `GET /health`
- **Response:**

```json
{
  "status": "ok",
  "database": "connected",
  "blockchain": "connected",
  "metrics_count": 5
}
```

---

## 11. Tüm Metrikleri Sil (DELETE /metrics)

- **Endpoint:** `DELETE /metrics`
- **Açıklama:** Tüm metrikleri siler (test amaçlı).
- **Response:**

```json
{
  "success": true,
  "message": "All metrics cleared successfully"
}
```

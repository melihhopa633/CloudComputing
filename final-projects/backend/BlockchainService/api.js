const express = require('express');

module.exports = function setupApiRoutes(app, contract) {
  // POST /api/metrics
  app.post('/api/metrics', async (req, res) => {
    try {
      const { containerId, memoryMB, cpuUsage, timestamp } = req.body;

      if (!containerId || memoryMB == null || cpuUsage == null || !timestamp) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // CPU usage değerini 2 ondalık hassasiyetle tam sayıya çevir
      const scaledCpu = Math.round(cpuUsage * 100);

      // Solidity için uygun parametrelerle çağır
      const tx = await contract.recordMetric(
        containerId,
        BigInt(Math.round(memoryMB)),
        BigInt(scaledCpu),
        BigInt(timestamp)
      );

      await tx.wait();
      res.json({ success: true, txHash: tx.hash });

    } catch (err) {
      console.error('POST /api/metrics error:', err);
      res.status(500).json({ error: err.reason || err.message || 'Internal server error' });
    }
  });

  // GET /api/metrics
  app.get('/api/metrics', async (req, res) => {
    try {
      const count = await contract.getMetricCount();
      const metrics = [];

      for (let i = 0; i < count; i++) {
        const m = await contract.getMetric(i);
        metrics.push({
          containerId: m[0],
          memoryMB: Number(m[1]),
          cpuUsage: Number(m[2]) / 100, // Geri yüzdeye çevir
          timestamp: Number(m[3])
        });
      }

      res.json(metrics);
    } catch (err) {
      console.error('GET /api/metrics error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/metrics/:containerId
  app.get('/api/metrics/:containerId', async (req, res) => {
    try {
      const count = await contract.getMetricCount();
      const metrics = [];

      for (let i = 0; i < count; i++) {
        const m = await contract.getMetric(i);
        if (m[0] === req.params.containerId) {
          metrics.push({
            containerId: m[0],
            memoryMB: Number(m[1]),
            cpuUsage: Number(m[2]) / 100,
            timestamp: Number(m[3])
          });
        }
      }

      res.json(metrics);
    } catch (err) {
      console.error('GET /api/metrics/:containerId error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/metrics/count
  app.get('/api/metrics/count', async (req, res) => {
    try {
      const count = await contract.getMetricCount();
      res.json({ count: Number(count) });
    } catch (err) {
      console.error('GET /api/metrics/count error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET /health
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/recep', (req, res) => {
    res.json({ status: 'Recep siki tutu' });
  });
};

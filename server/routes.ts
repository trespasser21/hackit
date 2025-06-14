import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/:id/supply-chain", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const events = await storage.getSupplyChainEvents(productId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supply chain events" });
    }
  });

  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getReviewsForProduct(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Seller routes
  app.get("/api/sellers", async (req, res) => {
    try {
      const sellers = await storage.getAllSellers();
      res.json(sellers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sellers" });
    }
  });

  // Moderation routes
  app.get("/api/moderation/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAllModerationAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch moderation alerts" });
    }
  });

  app.post("/api/moderation/alerts", async (req, res) => {
    try {
      const alert = await storage.createModerationAlert(req.body);
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  // Edge metrics routes
  app.get("/api/edge-metrics", async (req, res) => {
    try {
      const metrics = await storage.getEdgeMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch edge metrics" });
    }
  });

  // Trust score updates
  app.put("/api/products/:id/trust-score", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { trustScore } = req.body;
      const updated = await storage.updateProduct(id, { trustScore });
      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trust score" });
    }
  });

  // Product scanning simulation
  app.post("/api/scan-product", async (req, res) => {
    try {
      const { nfcTagId, qrCode } = req.body;
      const products = await storage.getAllProducts();
      const product = products.find(p => p.nfcTagId === nfcTagId || p.sku === qrCode);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Simulate authenticity verification
      const authenticityResult = {
        productId: product.id,
        verified: true,
        trustScore: product.trustScore,
        scanTimestamp: new Date(),
        verificationDetails: {
          nfcAuthentic: true,
          supplyChainVerified: true,
          sellerVerified: true,
          reviewsAuthentic: Math.random() > 0.1
        }
      };

      res.json(authenticityResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to scan product" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const alerts = await storage.getAllModerationAlerts();
      
      const analytics = {
        scannedToday: Math.floor(Math.random() * 5000) + 20000,
        trustAverage: products.reduce((sum, p) => sum + parseFloat(p.trustScore || "0"), 0) / products.length,
        fakesBlocked: Math.floor(Math.random() * 200) + 1000,
        pendingReviews: alerts.filter(a => a.status === "open").length,
        totalProducts: products.length,
        verifiedSellers: Math.floor(Math.random() * 100) + 800
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    // Send initial data
    ws.send(JSON.stringify({
      type: 'connected',
      timestamp: new Date()
    }));

    // Simulate real-time trust score updates every 120 seconds
    const trustScoreInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const randomProduct = Math.floor(Math.random() * 2) + 1;
        const newTrustScore = (Math.random() * 15 + 85).toFixed(1);
        
        ws.send(JSON.stringify({
          type: 'trust_score_update',
          productId: randomProduct,
          trustScore: newTrustScore,
          timestamp: new Date()
        }));
      }
    }, 120000);

    // Simulate scan counter updates every 30 seconds
    const scanInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'scan_update',
          scansToday: Math.floor(Math.random() * 5000) + 20000,
          timestamp: new Date()
        }));
      }
    }, 30000);

    // Simulate new alerts
    const alertInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN && Math.random() > 0.7) {
        ws.send(JSON.stringify({
          type: 'new_alert',
          alert: {
            id: Date.now(),
            type: 'review_anomaly',
            severity: 'medium',
            title: 'Review Pattern Alert',
            description: 'Unusual review pattern detected',
            timestamp: new Date()
          }
        }));
      }
    }, 60000);

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clearInterval(trustScoreInterval);
      clearInterval(scanInterval);
      clearInterval(alertInterval);
    });
  });

  return httpServer;
}

import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product and Digital Twin tracking
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  digitalTwinId: text("digital_twin_id").unique(),
  nfcTagId: text("nfc_tag_id").unique(),
  manufacturerId: text("manufacturer_id"),
  trustScore: decimal("trust_score", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Supply chain events for blockchain-like tracking
export const supplyChainEvents = pgTable("supply_chain_events", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  eventType: text("event_type").notNull(), // manufacturing, shipping, scanning, delivery
  location: text("location").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  gpsCoordinates: text("gps_coordinates"),
  temperature: decimal("temperature", { precision: 5, scale: 2 }),
  humidity: decimal("humidity", { precision: 5, scale: 2 }),
  blockHash: text("block_hash"),
  verificationStatus: text("verification_status").default("pending"),
  metadata: jsonb("metadata"),
});

// Seller credentials and zero-knowledge verification
export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  sellerId: text("seller_id").notNull().unique(),
  companyName: text("company_name").notNull(),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected
  zkCredentialHash: text("zk_credential_hash"),
  trustToken: decimal("trust_token", { precision: 5, scale: 2 }).default("0"),
  kycDocuments: jsonb("kyc_documents"),
  supplyChainProof: jsonb("supply_chain_proof"),
  counterfeiteStrikes: integer("counterfeit_strikes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product reviews and authenticity analysis
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  sellerId: integer("seller_id").references(() => sellers.id),
  reviewText: text("review_text").notNull(),
  rating: integer("rating").notNull(),
  authenticityScore: decimal("authenticity_score", { precision: 5, scale: 2 }),
  imageOriginalityScore: decimal("image_originality_score", { precision: 5, scale: 2 }),
  analysisStatus: text("analysis_status").default("pending"), // pending, genuine, suspicious, fake
  edgeModelVersion: text("edge_model_version"),
  flagged: boolean("flagged").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Moderation alerts and actions
export const moderationAlerts = pgTable("moderation_alerts", {
  id: serial("id").primaryKey(),
  alertType: text("alert_type").notNull(), // counterfeit_ring, review_anomaly, supply_chain_breach
  severity: text("severity").notNull(), // low, medium, high, critical
  title: text("title").notNull(),
  description: text("description").notNull(),
  affectedProducts: jsonb("affected_products"),
  affectedSellers: jsonb("affected_sellers"),
  status: text("status").default("open"), // open, investigating, resolved
  assignedTo: text("assigned_to"),
  autoActions: jsonb("auto_actions"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Graph analytics for supply chain anomaly detection
export const supplyChainGraphs = pgTable("supply_chain_graphs", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  nodeId: text("node_id").notNull(),
  nodeType: text("node_type").notNull(), // manufacturer, distributor, fc, seller
  parentNodeId: text("parent_node_id"),
  anomalyScore: decimal("anomaly_score", { precision: 5, scale: 2 }),
  isGreyMarket: boolean("is_grey_market").default(false),
  pathVerified: boolean("path_verified").default(false),
  detectedAt: timestamp("detected_at").defaultNow(),
});

// Edge AI model performance metrics
export const edgeMetrics = pgTable("edge_metrics", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  modelVersion: text("model_version").notNull(),
  falsePositiveRate: decimal("false_positive_rate", { precision: 5, scale: 4 }),
  accuracyScore: decimal("accuracy_score", { precision: 5, scale: 4 }),
  processingLatency: integer("processing_latency"), // milliseconds
  lastUpdate: timestamp("last_update").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Schema types
export const insertProductSchema = createInsertSchema(products);
export const insertSupplyChainEventSchema = createInsertSchema(supplyChainEvents);
export const insertSellerSchema = createInsertSchema(sellers);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertModerationAlertSchema = createInsertSchema(moderationAlerts);
export const insertSupplyChainGraphSchema = createInsertSchema(supplyChainGraphs);
export const insertEdgeMetricsSchema = createInsertSchema(edgeMetrics);

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type SupplyChainEvent = typeof supplyChainEvents.$inferSelect;
export type InsertSupplyChainEvent = z.infer<typeof insertSupplyChainEventSchema>;
export type Seller = typeof sellers.$inferSelect;
export type InsertSeller = z.infer<typeof insertSellerSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type ModerationAlert = typeof moderationAlerts.$inferSelect;
export type InsertModerationAlert = z.infer<typeof insertModerationAlertSchema>;
export type SupplyChainGraph = typeof supplyChainGraphs.$inferSelect;
export type InsertSupplyChainGraph = z.infer<typeof insertSupplyChainGraphSchema>;
export type EdgeMetrics = typeof edgeMetrics.$inferSelect;
export type InsertEdgeMetrics = z.infer<typeof insertEdgeMetricsSchema>;

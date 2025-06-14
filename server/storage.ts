import { 
  products, 
  supplyChainEvents, 
  sellers, 
  reviews, 
  moderationAlerts, 
  supplyChainGraphs, 
  edgeMetrics,
  type Product, 
  type InsertProduct,
  type SupplyChainEvent,
  type InsertSupplyChainEvent,
  type Seller,
  type InsertSeller,
  type Review,
  type InsertReview,
  type ModerationAlert,
  type InsertModerationAlert,
  type SupplyChainGraph,
  type InsertSupplyChainGraph,
  type EdgeMetrics,
  type InsertEdgeMetrics
} from "@shared/schema";

export interface IStorage {
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  
  // Supply chain operations
  getSupplyChainEvents(productId: number): Promise<SupplyChainEvent[]>;
  createSupplyChainEvent(event: InsertSupplyChainEvent): Promise<SupplyChainEvent>;
  
  // Seller operations
  getSeller(id: number): Promise<Seller | undefined>;
  getSellerBySellerId(sellerId: string): Promise<Seller | undefined>;
  createSeller(seller: InsertSeller): Promise<Seller>;
  updateSeller(id: number, updates: Partial<Seller>): Promise<Seller | undefined>;
  getAllSellers(): Promise<Seller[]>;
  
  // Review operations
  getReviewsForProduct(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, updates: Partial<Review>): Promise<Review | undefined>;
  
  // Moderation operations
  getAllModerationAlerts(): Promise<ModerationAlert[]>;
  createModerationAlert(alert: InsertModerationAlert): Promise<ModerationAlert>;
  updateModerationAlert(id: number, updates: Partial<ModerationAlert>): Promise<ModerationAlert | undefined>;
  
  // Graph analytics operations
  getSupplyChainGraph(productId: number): Promise<SupplyChainGraph[]>;
  createSupplyChainGraphNode(node: InsertSupplyChainGraph): Promise<SupplyChainGraph>;
  
  // Edge metrics operations
  getEdgeMetrics(): Promise<EdgeMetrics[]>;
  updateEdgeMetrics(deviceId: string, metrics: Partial<EdgeMetrics>): Promise<EdgeMetrics | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private supplyChainEvents: Map<number, SupplyChainEvent>;
  private sellers: Map<number, Seller>;
  private reviews: Map<number, Review>;
  private moderationAlerts: Map<number, ModerationAlert>;
  private supplyChainGraphs: Map<number, SupplyChainGraph>;
  private edgeMetrics: Map<number, EdgeMetrics>;
  private currentId: number;

  constructor() {
    this.products = new Map();
    this.supplyChainEvents = new Map();
    this.sellers = new Map();
    this.reviews = new Map();
    this.moderationAlerts = new Map();
    this.supplyChainGraphs = new Map();
    this.edgeMetrics = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data for demonstration
    const sampleProducts: Product[] = [
      {
        id: 1,
        sku: "APL-IP15PM-256",
        name: "iPhone 15 Pro Max 256GB",
        category: "Electronics",
        price: "1199.00",
        digitalTwinId: "DT789456",
        nfcTagId: "NFC892847",
        manufacturerId: "APPLE_FACTORY_001",
        trustScore: "96.8",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        sku: "SN-WTCH-S9",
        name: "Sony WH-1000XM5 Headphones",
        category: "Electronics", 
        price: "399.99",
        digitalTwinId: "DT394857",
        nfcTagId: "NFC745629",
        manufacturerId: "SONY_FACTORY_002",
        trustScore: "98.6",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
      this.currentId = Math.max(this.currentId, product.id + 1);
    });

    // Initialize supply chain events
    const sampleEvents: SupplyChainEvent[] = [
      {
        id: 1,
        productId: 1,
        eventType: "manufacturing",
        location: "Foxconn Factory, Shenzhen",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        gpsCoordinates: "22.5431°N, 114.0579°E",
        temperature: "22.0",
        humidity: "45.0",
        blockHash: "0xd4e5f892847...",
        verificationStatus: "verified",
        metadata: { batchNumber: "B2024001", qualityCheck: "passed" }
      },
      {
        id: 2,
        productId: 1,
        eventType: "shipping",
        location: "DHL Hub, Hong Kong",
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
        gpsCoordinates: "22.3193°N, 114.1694°E",
        blockHash: "0xf8a9c7d2154...",
        verificationStatus: "verified",
        metadata: { carrier: "DHL", trackingNumber: "DHL7894561230" }
      }
    ];

    sampleEvents.forEach(event => {
      this.supplyChainEvents.set(event.id, event);
    });

    // Initialize moderation alerts
    const sampleAlerts: ModerationAlert[] = [
      {
        id: 1,
        alertType: "counterfeit_ring",
        severity: "critical",
        title: "Counterfeit Ring Detected",
        description: "15 linked sellers pushing fake AirPods",
        affectedProducts: ["APL-AIRPODS-PRO"],
        affectedSellers: ["SELLER001", "SELLER002"],
        status: "open",
        autoActions: { listingsRemoved: 12, sellersFlag: 3 },
        createdAt: new Date(Date.now() - 2 * 60 * 1000)
      }
    ];

    sampleAlerts.forEach(alert => {
      this.moderationAlerts.set(alert.id, alert);
    });
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.sku === sku);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updated = { ...product, ...updates, updatedAt: new Date() };
    this.products.set(id, updated);
    return updated;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  // Supply chain operations
  async getSupplyChainEvents(productId: number): Promise<SupplyChainEvent[]> {
    return Array.from(this.supplyChainEvents.values())
      .filter(event => event.productId === productId)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());
  }

  async createSupplyChainEvent(insertEvent: InsertSupplyChainEvent): Promise<SupplyChainEvent> {
    const id = this.currentId++;
    const event: SupplyChainEvent = { 
      ...insertEvent, 
      id,
      timestamp: new Date()
    };
    this.supplyChainEvents.set(id, event);
    return event;
  }

  // Seller operations
  async getSeller(id: number): Promise<Seller | undefined> {
    return this.sellers.get(id);
  }

  async getSellerBySellerId(sellerId: string): Promise<Seller | undefined> {
    return Array.from(this.sellers.values()).find(seller => seller.sellerId === sellerId);
  }

  async createSeller(insertSeller: InsertSeller): Promise<Seller> {
    const id = this.currentId++;
    const seller: Seller = { 
      ...insertSeller, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sellers.set(id, seller);
    return seller;
  }

  async updateSeller(id: number, updates: Partial<Seller>): Promise<Seller | undefined> {
    const seller = this.sellers.get(id);
    if (!seller) return undefined;
    
    const updated = { ...seller, ...updates, updatedAt: new Date() };
    this.sellers.set(id, updated);
    return updated;
  }

  async getAllSellers(): Promise<Seller[]> {
    return Array.from(this.sellers.values());
  }

  // Review operations
  async getReviewsForProduct(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentId++;
    const review: Review = { 
      ...insertReview, 
      id,
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async updateReview(id: number, updates: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;
    
    const updated = { ...review, ...updates };
    this.reviews.set(id, updated);
    return updated;
  }

  // Moderation operations
  async getAllModerationAlerts(): Promise<ModerationAlert[]> {
    return Array.from(this.moderationAlerts.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createModerationAlert(insertAlert: InsertModerationAlert): Promise<ModerationAlert> {
    const id = this.currentId++;
    const alert: ModerationAlert = { 
      ...insertAlert, 
      id,
      createdAt: new Date()
    };
    this.moderationAlerts.set(id, alert);
    return alert;
  }

  async updateModerationAlert(id: number, updates: Partial<ModerationAlert>): Promise<ModerationAlert | undefined> {
    const alert = this.moderationAlerts.get(id);
    if (!alert) return undefined;
    
    const updated = { ...alert, ...updates };
    this.moderationAlerts.set(id, updated);
    return updated;
  }

  // Graph analytics operations
  async getSupplyChainGraph(productId: number): Promise<SupplyChainGraph[]> {
    return Array.from(this.supplyChainGraphs.values())
      .filter(node => node.productId === productId);
  }

  async createSupplyChainGraphNode(insertNode: InsertSupplyChainGraph): Promise<SupplyChainGraph> {
    const id = this.currentId++;
    const node: SupplyChainGraph = { 
      ...insertNode, 
      id,
      detectedAt: new Date()
    };
    this.supplyChainGraphs.set(id, node);
    return node;
  }

  // Edge metrics operations
  async getEdgeMetrics(): Promise<EdgeMetrics[]> {
    return Array.from(this.edgeMetrics.values());
  }

  async updateEdgeMetrics(deviceId: string, updates: Partial<EdgeMetrics>): Promise<EdgeMetrics | undefined> {
    const existing = Array.from(this.edgeMetrics.values()).find(m => m.deviceId === deviceId);
    if (existing) {
      const updated = { ...existing, ...updates, lastUpdate: new Date() };
      this.edgeMetrics.set(existing.id, updated);
      return updated;
    }
    return undefined;
  }
}

export const storage = new MemStorage();

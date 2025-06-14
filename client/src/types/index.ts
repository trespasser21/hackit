export interface DashboardMetrics {
  scannedToday: number;
  trustAverage: number;
  fakesBlocked: number;
  pendingReviews: number;
  totalProducts: number;
  verifiedSellers: number;
}

export interface ScanResult {
  productId: number;
  verified: boolean;
  trustScore: string;
  scanTimestamp: Date;
  verificationDetails: {
    nfcAuthentic: boolean;
    supplyChainVerified: boolean;
    sellerVerified: boolean;
    reviewsAuthentic: boolean;
  };
}

export interface ReviewAnalysis {
  id: number;
  reviewText: string;
  authenticityScore: number;
  status: 'genuine' | 'suspicious' | 'pending';
  timestamp: Date;
}

export interface WebSocketMessage {
  type: 'connected' | 'trust_score_update' | 'scan_update' | 'new_alert';
  productId?: number;
  trustScore?: string;
  scansToday?: number;
  alert?: any;
  timestamp: Date;
}

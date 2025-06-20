import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QrCode, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useWebSocket } from "@/lib/websocket";
import NavigationHeader from "@/components/NavigationHeader";
import ProductScanner from "@/components/ProductScanner";
import TrustBadge from "@/components/TrustBadge";
import SupplyChainTracker from "@/components/SupplyChainTracker";
import EdgeReviewAnalysis from "@/components/EdgeReviewAnalysis";
import ModerationDashboard from "@/components/ModerationDashboard";
import GraphAnalytics from "@/components/GraphAnalytics";
import CustomerInterface from "@/components/CustomerInterface";
import type { DashboardMetrics } from "@/types";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("scanner");
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    scannedToday: 24847,
    trustAverage: 94.2,
    fakesBlocked: 1203,
    pendingReviews: 456,
    totalProducts: 0,
    verifiedSellers: 0
  });

  const { data: analyticsData } = useQuery<DashboardMetrics>({
    queryKey: ["/api/analytics/dashboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { isConnected, lastMessage } = useWebSocket();

  // Update metrics from WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === 'scan_update' && lastMessage.scansToday) {
      setMetrics(prev => ({ ...prev, scannedToday: lastMessage.scansToday! }));
    }
  }, [lastMessage]);

  // Update metrics from analytics API
  useEffect(() => {
    if (analyticsData) {
      setMetrics(analyticsData);
    }
  }, [analyticsData]);

  const renderMainContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <>
            <div className="lg:col-span-2">
              <GraphAnalytics />
            </div>
            <div className="lg:col-span-1">
              <EdgeReviewAnalysis />
            </div>
          </>
        );
      case 'sellers':
        return (
          <div className="lg:col-span-3">
            <CustomerInterface />
          </div>
        );
      case 'moderation':
        return (
          <>
            <div className="lg:col-span-2">
              <ModerationDashboard />
            </div>
            <div className="lg:col-span-1">
              <GraphAnalytics />
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="lg:col-span-1">
              <ProductScanner />
              <div className="mt-6">
                <TrustBadge />
              </div>
            </div>
            <div className="lg:col-span-1">
              <SupplyChainTracker />
              <div className="mt-6">
                <EdgeReviewAnalysis />
              </div>
            </div>
            <div className="lg:col-span-1">
              <ModerationDashboard />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Live Stats */}
        <div className="mb-8">
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold text-amazon-neutral mb-2">
                Edge-Trust Mesh Platform
              </h1>
              <p className="text-gray-600 mb-6">
                AI-powered authenticity verification and trust scoring for Amazon marketplace
              </p>
              
              {/* Real-time metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="metric-card bg-amazon-secondary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Products Scanned Today</p>
                      <p className="text-2xl font-bold text-amazon-secondary">
                        {metrics.scannedToday.toLocaleString()}
                      </p>
                    </div>
                    <QrCode className="text-amazon-secondary" size={32} />
                  </div>
                </div>
                
                <div className="metric-card bg-amazon-primary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Trust Score Average</p>
                      <p className="text-2xl font-bold text-amazon-primary">
                        {metrics.trustAverage.toFixed(1)}%
                      </p>
                    </div>
                    <Shield className="text-amazon-primary" size={32} />
                  </div>
                </div>
                
                <div className="metric-card bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Fakes Blocked</p>
                      <p className="text-2xl font-bold text-red-600">
                        {metrics.fakesBlocked.toLocaleString()}
                      </p>
                    </div>
                    <AlertTriangle className="text-red-600" size={32} />
                  </div>
                </div>
                
                <div className="metric-card bg-yellow-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Reviews</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {metrics.pendingReviews}
                      </p>
                    </div>
                    <TrendingUp className="text-yellow-600" size={32} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {renderMainContent()}
        </div>

        {/* Customer Interface for all tabs except sellers */}
        {activeTab !== 'sellers' && (
          <div className="mt-8">
            {/* <CustomerInterface /> */}
          </div>
        )}
        
      </main>

      {/* Real-time Update Indicator */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-amazon-secondary animate-pulse' : 'bg-gray-400'}`}></div>
          <div>
            <p className="font-medium text-amazon-neutral text-sm">
              {isConnected ? 'Live Updates Active' : 'Connecting...'}
            </p>
            <p className="text-xs text-gray-600">Trust scores updating every 120s</p>
          </div>
        </div>
      </div>
    </div>
  );
}

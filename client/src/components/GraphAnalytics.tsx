import { Network, AlertTriangle, CheckCircle, ShieldAlert, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function GraphAnalytics() {
  // Mock anomaly detection results
  const mockAnomalies = [
    {
      id: 1,
      type: "grey_market",
      severity: "critical",
      title: "Grey Market Path",
      description: "SKU: SN-WTCH-S9 diverted through unauthorized distributor",
      icon: ShieldAlert,
      color: "border-red-500 bg-red-50 text-red-800"
    },
    {
      id: 2,
      type: "duplicate_tags",
      severity: "medium",
      title: "Duplicate NFC Tags",
      description: "3 products with identical tag ID: #NFC745629",
      icon: AlertTriangle,
      color: "border-yellow-500 bg-yellow-50 text-yellow-800"
    },
    {
      id: 3,
      type: "verified_path",
      severity: "normal",
      title: "Path Verified",
      description: "Standard supply chain for category: Electronics",
      icon: CheckCircle,
      color: "border-green-500 bg-green-50 text-green-800"
    }
  ];

  const autoActions = {
    listingsRemoved: 12,
    sellersFlags: 3,
    recallAlerts: 1
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Network className="text-amazon-primary" size={20} />
          <span>Supply Chain Graph Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Graph Visualization Placeholder */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Network className="text-gray-400 mx-auto mb-2" size={48} />
          <p className="text-sm text-gray-600 mb-1">Network Graph Visualization</p>
          <p className="text-xs text-gray-500">Detecting diverging sub-chains and grey market flows</p>
          
          {/* Simulated Network Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-amazon-primary">1,247</div>
              <div className="text-xs text-gray-600">Supply Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amazon-primary">3,892</div>
              <div className="text-xs text-gray-600">Product Paths</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amazon-secondary">98.7%</div>
              <div className="text-xs text-gray-600">Path Integrity</div>
            </div>
          </div>
        </div>

        {/* Anomaly Detection Results */}
        <div className="space-y-3">
          <h4 className="font-medium text-amazon-neutral">Detected Anomalies</h4>
          
          {mockAnomalies.map((anomaly) => {
            const IconComponent = anomaly.icon;
            return (
              <div key={anomaly.id} className={`border-l-4 p-3 rounded-r-lg ${anomaly.color}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <IconComponent size={16} />
                    <span className="text-sm font-medium">{anomaly.title}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {anomaly.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{anomaly.description}</p>
                {anomaly.severity !== 'normal' && (
                  <Button size="sm" variant="outline" className="text-xs">
                    Investigate Path →
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Graph Analytics Metrics */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-amazon-neutral mb-3">Real-time Analysis</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Paths Analyzed:</span>
              <span className="font-medium">847/min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Anomaly Rate:</span>
              <span className="font-medium text-yellow-600">1.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Latency:</span>
              <span className="font-medium">23ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Model Confidence:</span>
              <span className="font-medium text-amazon-secondary">94.8%</span>
            </div>
          </div>
        </div>

        {/* Auto Actions */}
        <div className="bg-amazon-primary/10 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="text-amazon-primary" size={16} />
            <span className="text-sm font-medium text-amazon-primary">Auto Actions Triggered</span>
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• {autoActions.listingsRemoved} listings auto-removed</p>
            <p>• {autoActions.sellersFlags} sellers flagged for review</p>
            <p>• {autoActions.recallAlerts} instant recall alert sent</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

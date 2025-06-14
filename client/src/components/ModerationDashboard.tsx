import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, AlertTriangle, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ModerationAlert } from "@shared/schema";

export default function ModerationDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [] } = useQuery<ModerationAlert[]>({
    queryKey: ["/api/moderation/alerts"]
  });

  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<ModerationAlert> }) => {
      const response = await apiRequest("PUT", `/api/moderation/alerts/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moderation/alerts"] });
      toast({
        title: "Alert Updated",
        description: "Alert status has been updated successfully"
      });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'counterfeit_ring': return <ShieldAlert className="text-red-500" size={16} />;
      case 'review_anomaly': return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'supply_chain_breach': return <XCircle className="text-red-500" size={16} />;
      default: return <AlertTriangle className="text-gray-500" size={16} />;
    }
  };

  // Mock seller verification queue
  const mockSellerQueue = [
    { id: 1, companyName: "TechGear Pro LLC", category: "Electronics", productCount: 847 },
    { id: 2, companyName: "LuxWatch Direct", category: "Watches", productCount: 23 }
  ];

  // Mock model performance metrics
  const mockPerformance = {
    falsePositiveRate: 2.3,
    activeDevices: 847239,
    federatedUpdates: 2400000
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShieldAlert className="text-amazon-primary" size={20} />
          <span>Moderation Dashboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* High Priority Alerts */}
        <div>
          <h3 className="font-semibold text-amazon-neutral mb-3">High Priority Alerts</h3>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className={`alert-card ${alert.severity}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.alertType)}
                    <span className="font-medium">{alert.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-600">
                      {new Date(alert.createdAt!).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateAlertMutation.mutate({ 
                      id: alert.id, 
                      updates: { status: 'investigating' } 
                    })}
                  >
                    Investigate →
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateAlertMutation.mutate({ 
                      id: alert.id, 
                      updates: { status: 'resolved' } 
                    })}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Verification Queue */}
        <div>
          <h3 className="font-semibold text-amazon-neutral mb-3">zk-Credential Queue</h3>
          <div className="space-y-2">
            {mockSellerQueue.map((seller) => (
              <div key={seller.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{seller.companyName}</p>
                  <p className="text-xs text-gray-600">
                    {seller.category}, {seller.productCount} products
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-amazon-secondary hover:bg-green-700 text-white">
                    <CheckCircle size={12} className="mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive">
                    <XCircle size={12} className="mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Model Performance */}
        <div>
          <h3 className="font-semibold text-amazon-neutral mb-3">Model Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">False Positive Rate</span>
              <span className="text-sm font-medium text-amazon-secondary">
                {mockPerformance.falsePositiveRate}%
              </span>
            </div>
            <Progress value={100 - mockPerformance.falsePositiveRate} className="h-2" />

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Edge Devices Active</span>
                <span className="text-sm font-medium text-amazon-primary">
                  {mockPerformance.activeDevices.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Federated Updates/Day</span>
                <span className="text-sm font-medium text-amazon-primary">
                  {(mockPerformance.federatedUpdates / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Auto Actions Summary */}
        <div className="bg-amazon-primary/10 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="text-amazon-primary" size={16} />
            <span className="text-sm font-medium text-amazon-primary">Auto Actions (Last 24h)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-bold text-lg text-amazon-primary">142</div>
              <div className="text-gray-600">Listings Removed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-amazon-primary">23</div>
              <div className="text-gray-600">Sellers Flagged</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-amazon-primary">3</div>
              <div className="text-gray-600">Recall Alerts</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

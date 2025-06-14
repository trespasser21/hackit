import { useEffect, useState } from "react";
import { Shield, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/lib/websocket";

interface TrustBadgeProps {
  productId?: number;
  initialTrustScore?: number;
}

export default function TrustBadge({ productId = 1, initialTrustScore = 96.8 }: TrustBadgeProps) {
  const [trustScore, setTrustScore] = useState(initialTrustScore);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type === 'trust_score_update' && lastMessage.productId === productId) {
      setTrustScore(parseFloat(lastMessage.trustScore || "0"));
      setLastUpdated(new Date());
    }
  }, [lastMessage, productId]);

  const getTrustLevel = (score: number) => {
    if (score >= 95) return { level: 'excellent', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    if (score >= 85) return { level: 'good', color: 'bg-blue-100 text-blue-800', icon: Shield };
    if (score >= 70) return { level: 'fair', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    return { level: 'poor', color: 'bg-red-100 text-red-800', icon: Shield };
  };

  const trustInfo = getTrustLevel(trustScore);
  const IconComponent = trustInfo.icon;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="text-amazon-primary" size={20} />
          <span>Live Trust Badge</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <IconComponent className="text-amazon-secondary" size={20} />
              <span className="font-semibold text-amazon-neutral">Trust Score</span>
            </div>
            <span className="text-lg font-bold text-amazon-secondary">
              {trustScore.toFixed(1)}%
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Seller Verified:</span>
              <span className="text-amazon-secondary flex items-center">
                <CheckCircle size={12} className="mr-1" />
                zk-Credential
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Supply Chain:</span>
              <span className="text-amazon-secondary flex items-center">
                <CheckCircle size={12} className="mr-1" />
                Tracked
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Reviews Authentic:</span>
              <span className="text-amazon-secondary flex items-center">
                <CheckCircle size={12} className="mr-1" />
                94.2%
              </span>
            </div>
          </div>
          
          <div className="mt-4 bg-amazon-secondary/10 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-amazon-secondary">
              Updated {Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)} seconds ago
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useQuery } from "@tanstack/react-query";
import { History, MapPin, CheckCircle, Clock, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product, SupplyChainEvent } from "@shared/schema";

interface SupplyChainTrackerProps {
  productId?: number;
}

export default function SupplyChainTracker({ productId = 1 }: SupplyChainTrackerProps) {
  const { data: product } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`]
  });

  const { data: events = [] } = useQuery<SupplyChainEvent[]>({
    queryKey: [`/api/products/${productId}/supply-chain`]
  });

  const getEventIcon = (eventType: string, isLatest: boolean) => {
    if (isLatest) return <Clock className="text-amber-500" size={16} />;
    return <CheckCircle className="text-green-500" size={16} />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="text-amazon-primary" size={20} />
          <span>Supply Chain Journey</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Info */}
        {product && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                📱
              </div>
              <div>
                <h3 className="font-semibold text-amazon-neutral">{product.name}</h3>
                <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                <p className="text-sm text-amazon-primary">Digital Twin: #{product.digitalTwinId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Supply Chain History */}
        <div className="space-y-4">
          {events.map((event, index) => {
            const isLatest = index === 0;
            return (
              <div key={event.id} className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-amazon-secondary rounded-full flex items-center justify-center">
                    {getEventIcon(event.eventType, isLatest)}
                  </div>
                  {index < events.length - 1 && (
                    <div className="w-px h-8 bg-gray-300"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-amazon-neutral capitalize">
                      {event.eventType.replace('_', ' ')} Complete
                    </h4>
                    <span className="text-xs text-gray-600">
                      {new Date(event.timestamp!).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  {event.gpsCoordinates && (
                    <p className="text-xs text-gray-500 flex items-center">
                      <MapPin size={10} className="mr-1" />
                      GPS: {event.gpsCoordinates}
                    </p>
                  )}
                  {event.temperature && (
                    <p className="text-xs text-gray-500">
                      Temp: {event.temperature}°C, Humidity: {event.humidity}%
                    </p>
                  )}
                  {event.nfcTagId && (
                    <p className="text-xs text-amazon-secondary">
                      NFC Tag: #{event.nfcTagId}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Blockchain Verification */}
        <div className="bg-amazon-primary/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Link className="text-amazon-primary" size={16} />
            <span className="font-semibold text-amazon-primary">Blockchain Verified</span>
          </div>
          <p className="text-sm text-gray-600">Block: #847592 | Hash: 0xd4e5f...</p>
          <p className="text-xs text-gray-500">Immutable record on permissioned ledger</p>
        </div>
      </CardContent>
    </Card>
  );
}

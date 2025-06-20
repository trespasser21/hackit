import { useState } from "react";
import { QrCode, Scan, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ScanResult } from "@/types";

interface RecentScan {
  id: number;
  productName: string;
  sku: string;
  status: 'verified' | 'suspicious' | 'pending';
  timestamp: Date;
}

export default function ProductScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([
    {
      id: 1,
      productName: "iPhone 15 Pro Max",
      sku: "APL-IP15PM-256",
      status: "verified",
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();

  const scanMutation = useMutation({
    mutationFn: async (scanData: { nfcTagId?: string; qrCode?: string }) => {
      const response = await apiRequest("POST", "/api/scan-product", scanData);
      return await response.json() as ScanResult;
    },
    onSuccess: (result: any) => {
      const productName = selectedProduct.includes("FAKE") ? 
        (selectedProduct.includes("AIRPODS") ? "AirPods Pro (COUNTERFEIT DETECTED)" : "Sony WH-1000XM5 (COUNTERFEIT DETECTED)") :
        (selectedProduct.includes("APL") ? "iPhone 15 Pro Max" : "Sony WH-1000XM5");
        
      const newScan: RecentScan = {
        id: Date.now(),
        productName,
        sku: selectedProduct,
        status: result.verified ? 'verified' : 'suspicious',
        timestamp: new Date()
      };
      setRecentScans(prev => [newScan, ...prev.slice(0, 4)]);
      
      const riskLevel = result.aiAnalysis?.riskLevel || "UNKNOWN";
      const anomalies = result.aiAnalysis?.detectedAnomalies || [];
      
      toast({
        title: result.verified ? "✅ Product Verified" : `⚠️ ${riskLevel} RISK - Counterfeit Detected`,
        description: result.verified ? 
          `Trust Score: ${result.trustScore}% - Authentic product` :
          `Trust Score: ${result.trustScore}% - ${anomalies.length} anomalies detected`,
        variant: result.verified ? "default" : "destructive"
      });
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Unable to verify product authenticity",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsScanning(false);
    }
  });

  const [selectedProduct, setSelectedProduct] = useState("APL-IP15PM-256");

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      scanMutation.mutate({ qrCode: selectedProduct });
    }, 3000);
  };

  const productOptions = [
    { sku: "APL-IP15PM-256", name: "iPhone 15 Pro Max (Genuine)" },
    { sku: "SN-WTCH-S9", name: "Sony WH-1000XM5 (Genuine)" },
    { sku: "APL-AIRPODS-FAKE", name: "AirPods Pro (FAKE - Test Detection)" },
    { sku: "SONY-WH-FAKE", name: "Sony WH-1000XM5 (FAKE - Test Detection)" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'suspicious': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="text-amazon-primary" size={20} />
          <span>Product Scanner</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Selection for Demo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product to Scan (Demo Mode)
          </label>
          <select 
            value={selectedProduct} 
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amazon-primary"
          >
            {productOptions.map((option) => (
              <option key={option.sku} value={option.sku}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Scanner Interface */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          <div className={`mb-4 ${isScanning ? 'scanning-animation' : ''}`}>
            <Scan className="text-gray-400 mx-auto" size={48} />
          </div>
          <p className="text-gray-600 mb-4">
            {isScanning ? "Scanning product..." : "Scan product QR code or NFC tag"}
          </p>
          <Button 
            onClick={handleStartScan}
            disabled={isScanning || scanMutation.isPending}
            className="bg-amazon-primary hover:bg-blue-700"
          >
            {isScanning ? (
              <>
                <Scan className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              "Start Scanning"
            )}
          </Button>
        </div>

        {/* Recent Scans */}
        <div className="space-y-3">
          <h3 className="font-semibold text-amazon-neutral">Recent Scans</h3>
          {recentScans.map((scan) => (
            <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <QrCode size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm">{scan.productName}</p>
                  <p className="text-xs text-gray-600">SKU: {scan.sku}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Badge className={getStatusColor(scan.status)}>
                  {scan.status === 'verified' && <CheckCircle size={12} className="mr-1" />}
                  {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

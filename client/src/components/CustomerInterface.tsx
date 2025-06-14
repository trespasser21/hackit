import { useState } from "react";
import { ShoppingCart, QrCode, Shield, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function CustomerInterface() {
  const [isScanning, setIsScanning] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  // Mock product data
  const product = {
    id: 2,
    name: "Sony WH-1000XM5 Headphones",
    price: "$399.99",
    trustScore: 98.6,
    image: "🎧", // Using emoji as placeholder
    verificationDetails: {
      sellerVerified: true,
      supplyChainTracked: true,
      nfcAuthentic: true,
      reviewsAuthentic: 97.2
    },
    journey: {
      manufactured: "Sony Factory, Malaysia",
      shipped: "Dec 15, 2024", 
      amazonFc: "Dec 18, 2024",
      digitalTwinId: "DT394857"
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      toast({
        title: "Added to Cart",
        description: "Product has been added to your cart",
        variant: "default"
      });
    }, 2000);
  };

  const handleScanProduct = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Authenticity Confirmed",
        description: `Trust Score: ${product.trustScore}% - Product is genuine`,
        variant: "default"
      });
    }, 2000);
  };

  const getTrustBadgeColor = (score: number) => {
    if (score >= 95) return "trust-badge verified";
    if (score >= 85) return "trust-badge warning";
    return "trust-badge danger";
  };

  return (
    <div className="bg-gradient-to-br from-amazon-primary/5 to-amazon-secondary/5 rounded-xl p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-amazon-neutral mb-6 text-center">
          Customer Product Verification
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Display */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-6xl">
                {product.image}
              </div>
              
              <h3 className="text-lg font-bold text-amazon-neutral mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.price}</p>

              {/* Trust Badge Integration */}
              <div className="bg-amazon-secondary/10 border border-amazon-secondary/20 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Shield className="text-amazon-secondary" size={24} />
                  <div>
                    <p className="font-semibold text-amazon-secondary">Trust Verified</p>
                    <p className="text-sm text-gray-600">
                      Score: {product.trustScore}% • Updated 45s ago
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-amazon-primary hover:bg-blue-700 mb-3"
              >
                {isAdding ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleScanProduct}
                disabled={isScanning}
                variant="outline"
                className="w-full hover:bg-gray-50"
              >
                {isScanning ? (
                  <>
                    <QrCode className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Authenticity...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-4 w-4" />
                    Scan to Verify Authenticity
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Verification Details */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h4 className="font-bold text-amazon-neutral mb-4 flex items-center">
                  <Shield className="mr-2 text-amazon-secondary" size={20} />
                  Authenticity Verification
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Seller Verification:</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="text-amazon-secondary" size={16} />
                      <span className="text-amazon-secondary font-medium">zk-Verified</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Supply Chain:</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="text-amazon-secondary" size={16} />
                      <span className="text-amazon-secondary font-medium">Tracked</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">NFC Tag:</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="text-amazon-secondary" size={16} />
                      <span className="text-amazon-secondary font-medium">Authentic</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Review Quality:</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="text-amazon-secondary" size={16} />
                      <span className="text-amazon-secondary font-medium">
                        {product.verificationDetails.reviewsAuthentic}% Genuine
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h4 className="font-bold text-amazon-neutral mb-4 flex items-center">
                  <Clock className="mr-2 text-amazon-primary" size={20} />
                  Product Journey
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manufactured:</span>
                    <span className="text-amazon-neutral">{product.journey.manufactured}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipped:</span>
                    <span className="text-amazon-neutral">{product.journey.shipped}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amazon FC:</span>
                    <span className="text-amazon-neutral">{product.journey.amazonFc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Digital Twin ID:</span>
                    <span className="text-amazon-primary font-mono">
                      #{product.journey.digitalTwinId}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

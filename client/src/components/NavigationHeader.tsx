import { Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavigationHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavigationHeader({ activeTab, onTabChange }: NavigationHeaderProps) {
  const tabs = [
    { id: 'scanner', label: 'Scanner' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'sellers', label: 'Sellers' },
    { id: 'moderation', label: 'Moderation' }
  ];

  return (
    <header className="bg-[#131921] shadow-sm border-b border-[#232F3E] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#FF9900] rounded-md flex items-center justify-center">
                <Shield className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-white">Amazon Trust & Safety</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-6">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={`font-medium ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:text-black"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </nav>

          {/* Notifications and Avatar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="text-white cursor-pointer" size={20} />
              <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs h-5 w-5 flex items-center justify-center rounded-full">
                3
              </Badge>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
          </div>

        </div>
      </div>
    </header>
  );
}

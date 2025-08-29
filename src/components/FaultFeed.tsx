import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock } from "lucide-react";

interface Fault {
  id: string;
  location: string;
  issue: string;
  severity: "low" | "medium" | "high";
  detectedTime: string;
  status: "active" | "resolved";
}

const mockFaults: Fault[] = [
  {
    id: "SL-001",
    location: "Main St & 5th Ave",
    issue: "LED Module Failure",
    severity: "high",
    detectedTime: "2 hours ago",
    status: "active",
  },
  {
    id: "SL-024",
    location: "Park Avenue",
    issue: "Dimming Sensor Error",
    severity: "medium",
    detectedTime: "4 hours ago",
    status: "active",
  },
  {
    id: "SL-156",
    location: "Broadway & 12th",
    issue: "Communication Loss",
    severity: "low",
    detectedTime: "6 hours ago",
    status: "active",
  },
  {
    id: "SL-089",
    location: "Central Plaza",
    issue: "Power Supply Issue",
    severity: "high",
    detectedTime: "1 day ago",
    status: "resolved",
  },
];

const FaultFeed = () => {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("active");

  const filteredFaults = mockFaults.filter((fault) => {
    if (filter === "all") return true;
    return fault.status === filter;
  });

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-danger";
      case "medium":
        return "text-warning";
      case "low":
        return "text-energy";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
            Fault Detection Feed
          </CardTitle>
          <div className="flex space-x-2">
            {(["active", "resolved", "all"] as const).map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterOption)}
                className="capitalize"
              >
                {filterOption}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredFaults.map((fault) => (
            <div
              key={fault.id}
              className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <AlertTriangle className={`w-5 h-5 ${getSeverityColor(fault.severity)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {fault.id} - {fault.issue}
                  </p>
                  <Badge variant={getSeverityVariant(fault.severity) as any}>
                    {fault.severity}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {fault.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {fault.detectedTime}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FaultFeed;
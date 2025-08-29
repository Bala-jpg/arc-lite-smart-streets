import { AlertTriangle, CheckCircle, Clock, Settings } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Faults = () => {
  const mockFaults = [
    {
      id: 1,
      location: "Main Street - Light #42",
      issue: "LED malfunction",
      severity: "high",
      status: "active",
      reportedAt: "2 hours ago"
    },
    {
      id: 2,
      location: "Park Avenue - Light #15",
      issue: "Dimming sensor fault",
      severity: "medium",
      status: "active",
      reportedAt: "5 hours ago"
    },
    {
      id: 3,
      location: "Oak Street - Light #23",
      issue: "Power supply issue",
      severity: "high",
      status: "resolved",
      reportedAt: "1 day ago"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "destructive";
      case "resolved": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Faults & Maintenance
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage street light faults and maintenance requests
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Faults</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">8</div>
              <p className="text-xs text-muted-foreground">
                Requiring attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">3</div>
              <p className="text-xs text-muted-foreground">
                Fixed today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">2</div>
              <p className="text-xs text-muted-foreground">
                Awaiting parts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actions</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full">
                Report Fault
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Faults List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Faults
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockFaults.map((fault) => (
                <div key={fault.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{fault.location}</h4>
                      <Badge variant={getSeverityColor(fault.severity) as any}>
                        {fault.severity}
                      </Badge>
                      <Badge variant={getStatusColor(fault.status) as any}>
                        {fault.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{fault.issue}</p>
                    <p className="text-xs text-muted-foreground">{fault.reportedAt}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Faults;
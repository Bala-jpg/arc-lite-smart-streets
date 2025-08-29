import { Zap, BarChart3, Calendar, Download } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EnergyReports = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Energy Reports
          </h1>
          <p className="text-muted-foreground">
            Detailed energy consumption and savings reports for your smart lighting network
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Generate Report</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Monthly Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,847 kWh</div>
              <p className="text-xs text-muted-foreground">
                Current month consumption
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reporting Period</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Select Date Range
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reports List Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Energy Reports Coming Soon</h3>
              <p className="text-muted-foreground">
                Detailed energy consumption and savings reports will be available here.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EnergyReports;
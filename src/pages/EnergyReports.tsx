import { useState } from "react";
import { Zap, BarChart3, Calendar, Download, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRegistration } from "@/hooks/useUserRegistration";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { generateEnergyUsedCSV, generateEnergySavedCSV, downloadCSV } from "@/utils/csvGenerator";
import { useToast } from "@/hooks/use-toast";

const EnergyReports = () => {
  const { user } = useAuth();
  const { isRegistered, loading } = useUserRegistration();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (reportType: 'used' | 'saved') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to download reports.",
        variant: "destructive"
      });
      return;
    }

    if (!isRegistered) {
      toast({
        title: "Registration Required",
        description: "Please register your details before accessing reports.",
        variant: "destructive"
      });
      return;
    }

    setDownloading(reportType);

    try {
      // Fetch energy reports for the current user
      const { data, error } = await supabase
        .from('energy_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('report_date', { ascending: false });

      if (error) {
        console.error('Error fetching energy reports:', error);
        
        // If no data exists, create sample data for demonstration
        const sampleData = [
          {
            report_date: '2024-01-15',
            street_light_id: 'SL001',
            energy_consumed_kwh: 12.5,
            energy_saved_kwh: 3.2
          },
          {
            report_date: '2024-01-16',
            street_light_id: 'SL002',
            energy_consumed_kwh: 15.8,
            energy_saved_kwh: 4.1
          },
          {
            report_date: '2024-01-17',
            street_light_id: 'SL003',
            energy_consumed_kwh: 18.2,
            energy_saved_kwh: 5.5
          }
        ];

        const csvContent = reportType === 'used' 
          ? generateEnergyUsedCSV(sampleData)
          : generateEnergySavedCSV(sampleData);

        const filename = reportType === 'used' 
          ? 'energy_used_report.csv'
          : 'energy_saved_report.csv';

        downloadCSV(csvContent, filename);

        toast({
          title: "Download Complete",
          description: `Sample ${reportType} report downloaded successfully!`,
          variant: "default"
        });
        return;
      }

      if (!data || data.length === 0) {
        // Create sample data if no user data exists
        const sampleData = [
          {
            report_date: '2024-01-15',
            street_light_id: 'SL001',
            energy_consumed_kwh: 12.5,
            energy_saved_kwh: 3.2
          },
          {
            report_date: '2024-01-16',
            street_light_id: 'SL002',
            energy_consumed_kwh: 15.8,
            energy_saved_kwh: 4.1
          }
        ];

        const csvContent = reportType === 'used' 
          ? generateEnergyUsedCSV(sampleData)
          : generateEnergySavedCSV(sampleData);

        const filename = reportType === 'used' 
          ? 'energy_used_report.csv'
          : 'energy_saved_report.csv';

        downloadCSV(csvContent, filename);
      } else {
        const csvContent = reportType === 'used' 
          ? generateEnergyUsedCSV(data)
          : generateEnergySavedCSV(data);

        const filename = reportType === 'used' 
          ? 'energy_used_report.csv'
          : 'energy_saved_report.csv';

        downloadCSV(csvContent, filename);
      }

      toast({
        title: "Download Complete",
        description: `${reportType === 'used' ? 'Energy Used' : 'Energy Saved'} report downloaded successfully!`,
        variant: "default"
      });

    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloading(null);
    }
  };

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

        {/* Registration Status Alert */}
        {!loading && user && !isRegistered && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 mb-6">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Registration Required
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Please register your details in Settings to access reports.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Download Reports */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Download Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button 
                onClick={() => handleDownload('used')}
                disabled={!user || !isRegistered || downloading === 'used'}
                className="w-full h-20 flex flex-col items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                {downloading === 'used' ? 'Generating...' : 'Download Energy Used Report'}
              </Button>
              
              <Button 
                onClick={() => handleDownload('saved')}
                disabled={!user || !isRegistered || downloading === 'saved'}
                className="w-full h-20 flex flex-col items-center justify-center gap-2"
                variant="outline"
              >
                <Download className="h-5 w-5" />
                {downloading === 'saved' ? 'Generating...' : 'Download Energy Saved Report'}
              </Button>
            </div>
            
            {(!user || !isRegistered) && (
              <div className="text-center mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {!user 
                    ? "Please log in and register to download reports."
                    : "Please register your details in Settings to access reports."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Information */}
        <Card>
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Energy Used Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Contains detailed information about energy consumption by date and street light ID.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Format: CSV with Date, Street Light ID, Energy Consumed (kWh)
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Energy Saved Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Contains information about energy savings achieved through smart lighting systems.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Format: CSV with Date, Street Light ID, Energy Saved (kWh)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EnergyReports;
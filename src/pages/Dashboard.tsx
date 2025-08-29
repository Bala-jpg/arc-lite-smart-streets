import { Zap, Lightbulb, AlertTriangle, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import OverviewCard from "@/components/OverviewCard";
import EnergyChart from "@/components/EnergyChart";
import FaultFeed from "@/components/FaultFeed";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor your smart street lighting network in real-time
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard
            title="Total Energy Consumed"
            value="12,847 kWh"
            icon={Zap}
            trend={{ value: -8.2, label: "from last month" }}
          />
          <OverviewCard
            title="Total Energy Saved"
            value="3,264 kWh"
            icon={TrendingUp}
            trend={{ value: 15.3, label: "from last month" }}
            variant="energy"
          />
          <OverviewCard
            title="Active Street Lights"
            value="1,247"
            icon={Lightbulb}
            trend={{ value: 2.1, label: "from last week" }}
          />
          <OverviewCard
            title="Faulty Street Lights"
            value="8"
            icon={AlertTriangle}
            trend={{ value: -12.5, label: "from last week" }}
            variant="warning"
          />
        </div>

        {/* Charts and Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnergyChart />
          </div>
          <div className="lg:col-span-1">
            <FaultFeed />
          </div>
        </div>

        {/* Weekly/Monthly/Yearly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <OverviewCard
            title="Energy Saved This Week"
            value="486 kWh"
            icon={TrendingUp}
            variant="energy"
          />
          <OverviewCard
            title="Energy Saved This Month"
            value="1,853 kWh"
            icon={TrendingUp}
            variant="energy"
          />
          <OverviewCard
            title="Energy Saved This Year"
            value="18,642 kWh"
            icon={TrendingUp}
            variant="energy"
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
import { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockData = {
  daily: [
    { time: "00:00", consumption: 120, savings: 25 },
    { time: "04:00", consumption: 95, savings: 35 },
    { time: "08:00", consumption: 180, savings: 15 },
    { time: "12:00", consumption: 220, savings: 10 },
    { time: "16:00", consumption: 190, savings: 18 },
    { time: "20:00", consumption: 250, savings: 8 },
  ],
  weekly: [
    { time: "Mon", consumption: 1250, savings: 180 },
    { time: "Tue", consumption: 1180, savings: 220 },
    { time: "Wed", consumption: 1320, savings: 150 },
    { time: "Thu", consumption: 1100, savings: 280 },
    { time: "Fri", consumption: 1450, savings: 120 },
    { time: "Sat", consumption: 980, savings: 320 },
    { time: "Sun", consumption: 850, savings: 380 },
  ],
  monthly: [
    { time: "Jan", consumption: 32000, savings: 5200 },
    { time: "Feb", consumption: 29000, savings: 6100 },
    { time: "Mar", consumption: 31000, savings: 5800 },
    { time: "Apr", consumption: 28000, savings: 6500 },
    { time: "May", consumption: 30000, savings: 6200 },
    { time: "Jun", consumption: 27000, savings: 7100 },
  ],
};

const EnergyChart = () => {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Energy Trends</CardTitle>
          <div className="flex space-x-2">
            {(["daily", "weekly", "monthly"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData[timeRange]}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="consumption"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                name="Consumption (kWh)"
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="hsl(var(--energy-green))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--energy-green))", strokeWidth: 2, r: 4 }}
                name="Savings (kWh)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyChart;
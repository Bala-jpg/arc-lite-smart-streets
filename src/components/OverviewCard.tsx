import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "energy" | "warning" | "danger";
}

const OverviewCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = "default" 
}: OverviewCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "energy":
        return "bg-gradient-energy border-energy/20";
      case "warning":
        return "bg-gradient-to-br from-warning/10 to-warning/20 border-warning/30";
      case "danger":
        return "bg-gradient-to-br from-danger/10 to-danger/20 border-danger/30";
      default:
        return "bg-card border-border hover:border-primary/30";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "energy":
        return "text-energy";
      case "warning":
        return "text-warning";
      case "danger":
        return "text-danger";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg animate-slide-up ${getVariantStyles()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${getIconStyles()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className={trend.value >= 0 ? "text-energy" : "text-danger"}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
            {" "}
            {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
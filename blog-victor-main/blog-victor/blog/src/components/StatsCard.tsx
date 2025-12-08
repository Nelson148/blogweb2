import { ReactNode } from "react";
import { Card, CardBody } from "@heroui/react";
import { Loader2 } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | ReactNode;
  icon: ReactNode;
  loading?: boolean;
  iconBgColor?: string;
  iconTextColor?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  loading = false,
  iconBgColor = "bg-blue-500/10",
  iconTextColor = "text-blue-400"
}: StatsCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm h-full">
      <CardBody className="p-6 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 leading-tight">{title}</p>
            <p className="text-3xl font-bold text-white">
              {loading ? <Loader2 className="animate-spin h-6 w-6"/> : value}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${iconBgColor} ${iconTextColor} flex-shrink-0 ml-4`}>
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}


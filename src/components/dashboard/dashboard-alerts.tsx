"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  InformationCircleIcon,
  Task02Icon,
  Money01Icon,
} from "@hugeicons/core-free-icons";

interface AlertItem {
  type: "warning" | "destructive" | "info";
  message: string;
  category: "budget" | "tasks";
}

interface DashboardAlertsProps {
  alerts: AlertItem[];
}

export const DashboardAlerts = ({ alerts }: DashboardAlertsProps) => {
  if (!alerts || alerts.length === 0) return null;

  const getIcon = (category: string) => {
    switch (category) {
      case "budget":
        return Money01Icon;
      case "tasks":
        return Task02Icon;
      default:
        return InformationCircleIcon;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case "destructive":
        return "bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50";
      case "warning":
        return "bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50";
      default:
        return "bg-slate-50 text-slate-800 border-slate-100";
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 rounded-md border px-4 py-3 ${getStyles(alert.type)}`}
        >
          <HugeiconsIcon
            icon={
              alert.type === "destructive"
                ? AlertCircleIcon
                : getIcon(alert.category)
            }
            size={20}
            className="shrink-0"
          />
          <p className="text-sm font-medium">{alert.message}</p>
        </div>
      ))}
    </div>
  );
};
